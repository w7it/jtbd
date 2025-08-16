import { eq, sql } from "drizzle-orm";
import { db } from "../db.ts";
import {
  boardDiscussions,
  boardNodes,
  boards,
  boardStickyNotes,
  projectInterviewJobs,
  projectJobs,
  projects,
  projectVersions,
  settings,
} from "./schema.ts";
import {
  BoardDiscussionId,
  BoardId,
  BoardNodeId,
  BoardStickyNoteId,
  genBoardId,
  genProjectId,
  genProjectVersionId,
  ProjectInterviewJobId,
  ProjectJobId,
  ProjectVersionId,
  UserId,
} from "@/lib/genId.ts";
import {
  BoardNode,
  BoardType,
  NodeType,
  ProjectJobData,
  StickyNoteData,
} from "@/constants/boards.ts";
import { assert } from "@/lib/assert.ts";

export const writeInstallSettings = db
  .insert(settings)
  .values([
    { name: "installation_id", value: sql.placeholder("installationId") },
    { name: "admin_email", value: sql.placeholder("adminEmail") },
  ])
  .prepare();

export const getAdminEmail = db.query.settings
  .findFirst({
    columns: { value: true },
    where: (settings, { eq }) => eq(settings.name, "admin_email"),
  })
  .prepare();

export const getProjectsByUserId = db.query.projects
  .findMany({
    where: (projects, { eq, sql }) =>
      eq(projects.ownerId, sql.placeholder("userId")),
  })
  .prepare();

export const getProjectByIdAndUserId = db.query.projects
  .findFirst({
    where: (projects, { and, eq, sql }) =>
      and(
        eq(projects.id, sql.placeholder("projectId")),
        eq(projects.ownerId, sql.placeholder("userId")),
      ),
    with: {
      lastVersion: true,
    },
  })
  .prepare();

export const createEmptyProject = ({ userId }: { readonly userId: UserId }) =>
  db.transaction(async (tx) => {
    const projectId = genProjectId();
    const boardId = genBoardId();
    const projectVersionId = genProjectVersionId();

    await tx.insert(projects).values({
      id: projectId,
      ownerId: userId,
      title: "Untitled Project",
      description: null,
      lastVersionId: projectVersionId,
    });

    await tx.insert(boards).values({
      id: boardId,
      relatedType: BoardType.PROJECT,
      relatedId: projectVersionId,
    });

    await tx.insert(projectVersions).values({
      id: projectVersionId,
      projectId,
      boardId,
      version: "draft",
    });
  });

export const getBoardDataById = db.query.boards
  .findFirst({
    where: (boards, { eq, sql }) => eq(boards.id, sql.placeholder("boardId")),
    with: {
      nodes: {
        with: {
          stickyNoteData: true,
          projectJobData: true,
          projectInterviewJobData: true,
          boardDiscussion: true,
        },
      },
    },
  })
  .prepare();

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const createStickyNote = async ({
  tx,
  node,
  boardId,
}: {
  tx: Tx;
  node: BoardNode;
  boardId: BoardId;
}) => {
  const data = node.data as StickyNoteData;

  await tx.insert(boardNodes).values({
    id: node.id,
    boardId,
    relatedType: NodeType.STICKY_NOTE,
    relatedId: data.id,
    x: node.position.x,
    y: node.position.y,
  });

  await tx.insert(boardStickyNotes).values({
    id: data.id,
    boardNodeId: node.id,
    content: data.content ?? "",
    color: data.color,
    size: data.size,
  });
};

const updateStickyNote = async ({ tx, node }: { tx: Tx; node: BoardNode }) => {
  const data = node.data as StickyNoteData;

  await tx
    .update(boardNodes)
    .set({ x: node.position.x, y: node.position.y })
    .where(eq(boardNodes.id, node.id));

  await tx
    .update(boardStickyNotes)
    .set({
      content: data.content,
      color: data.color,
      size: data.size,
    })
    .where(eq(boardStickyNotes.id, data.id));
};

const createProjectJob = async ({
  tx,
  node,
  boardId,
  projectVersionId,
}: {
  tx: Tx;
  node: BoardNode;
  boardId: BoardId;
  projectVersionId: ProjectVersionId;
}) => {
  const data = node.data as ProjectJobData;

  await tx.insert(boardNodes).values({
    id: node.id,
    boardId,
    relatedType: NodeType.PROJECT_JOB,
    relatedId: data.id,
    x: node.position.x,
    y: node.position.y,
  });

  await tx.insert(projectJobs).values({
    id: data.id,
    projectVersionId,
    name: data.name,
    data: {
      when: data.when,
      soThat: data.soThat,
      importance: data.importance,
      frequency: data.frequency,
    },
  });
};

const updateProjectJob = async ({ tx, node }: { tx: Tx; node: BoardNode }) => {
  const data = node.data as ProjectJobData;

  await tx
    .update(boardNodes)
    .set({ x: node.position.x, y: node.position.y })
    .where(eq(boardNodes.id, node.id));

  await tx
    .update(projectJobs)
    .set({
      name: data.name,
      data: {
        when: data.when,
        soThat: data.soThat,
        importance: data.importance,
        frequency: data.frequency,
      },
    })
    .where(eq(projectJobs.id, data.id));
};

export const updateBoardData = ({
  boardId,
  nodes,
}: {
  readonly boardId: BoardId;
  readonly nodes: BoardNode[];
}) =>
  db.transaction(async (tx) => {
    const board = await tx.query.boards.findFirst({
      where: (boards, { eq }) => eq(boards.id, boardId),
    });
    assert(board, "Board not found");

    const existingNodes = await tx.query.boardNodes.findMany({
      where: eq(boardNodes.boardId, boardId),
    });
    const touchedNodeIds = new Set<BoardNodeId>();

    const projectVersion =
      board.relatedType === BoardType.PROJECT
        ? await (async () => {
            const result = await tx.query.projectVersions.findFirst({
              where: (projectVersions, { eq }) =>
                eq(projectVersions.boardId, boardId),
            });
            assert(result, "Project version not found");
            return result;
          })()
        : null;

    await Promise.all(
      nodes.map(async (node) => {
        touchedNodeIds.add(node.id);
        const isExistingNode = existingNodes.some(({ id }) => id === node.id);

        switch (node.type) {
          case NodeType.STICKY_NOTE: {
            return isExistingNode
              ? updateStickyNote({ tx, node })
              : createStickyNote({ tx, node, boardId });
          }
          case NodeType.PROJECT_JOB: {
            assert(projectVersion, "Project version is required");

            return isExistingNode
              ? updateProjectJob({ tx, node })
              : createProjectJob({
                  tx,
                  node,
                  boardId,
                  projectVersionId: projectVersion.id,
                });
          }
          default:
            throw new Error("Not supported");
        }
      }),
    );

    await Promise.all(
      existingNodes
        .filter(({ id }) => !touchedNodeIds.has(id))
        .map(async (node) => {
          switch (node.relatedType) {
            case NodeType.STICKY_NOTE: {
              await tx.delete(boardNodes).where(eq(boardNodes.id, node.id));
              await tx
                .delete(boardStickyNotes)
                .where(
                  eq(boardStickyNotes.id, node.relatedId as BoardStickyNoteId),
                );
              break;
            }
            case NodeType.PROJECT_JOB: {
              await tx.delete(boardNodes).where(eq(boardNodes.id, node.id));
              await tx
                .delete(projectJobs)
                .where(eq(projectJobs.id, node.relatedId as ProjectJobId));
              break;
            }
            case NodeType.PROJECT_INTERVIEW_JOB: {
              await tx.delete(boardNodes).where(eq(boardNodes.id, node.id));
              await tx
                .delete(projectInterviewJobs)
                .where(
                  eq(
                    projectInterviewJobs.id,
                    node.relatedId as ProjectInterviewJobId,
                  ),
                );
              break;
            }
            case NodeType.DISCUSSION: {
              await tx.delete(boardNodes).where(eq(boardNodes.id, node.id));
              await tx
                .delete(boardDiscussions)
                .where(
                  eq(boardDiscussions.id, node.relatedId as BoardDiscussionId),
                );
              break;
            }
            default:
              throw new Error("Not supported");
          }
        }),
    );
  });
