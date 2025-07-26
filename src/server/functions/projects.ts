import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type ShortProject = {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
};

type FullProject = ShortProject & {
  readonly boardId: string | null;
};

export const getProjects = createServerFn().handler(
  async (): Promise<ShortProject[]> => {
    const { getProjectsByUserId, createEmptyProject } = await import(
      "../db/queries.ts"
    );
    const { getUserId } = await import("../auth.ts");

    const userId = await getUserId();
    if (!userId) return [];

    let result = await getProjectsByUserId.execute({ userId });

    if (result.length === 0) {
      await createEmptyProject.execute({ userId });
      result = await getProjectsByUserId.execute({ userId });
    }

    return result.map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
    }));
  },
);

export const getProjectById = createServerFn()
  .validator(z.object({ projectId: z.string() }))
  .handler(async ({ data }): Promise<FullProject | null> => {
    const { getProjectByIdAndUserId } = await import("../db/queries.ts");
    const { getUserId } = await import("../auth.ts");

    const userId = await getUserId();
    if (!userId) return null;

    const result = await getProjectByIdAndUserId.execute({
      projectId: data.projectId,
      userId: userId,
    });
    if (!result) return null;

    return {
      id: result.id,
      title: result.title,
      description: result.description,
      boardId: result.lastVersion?.boardId ?? null,
    };
  });
