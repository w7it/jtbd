import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type Project = {
  readonly id: string;
  readonly name: string;
};

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "Project 1" },
  { id: "2", name: "Project 2" },
  { id: "3", name: "Project 3" },
  { id: "4", name: "Project 4" },
];

export const getProjects = createServerFn().handler(
  async (): Promise<Project[]> => {
    return MOCK_PROJECTS;
  },
);

export const getCurrentProject = createServerFn().handler(
  async (): Promise<Project | null> => {
    return MOCK_PROJECTS[0] ?? null;
  },
);

export const setCurrentProject = createServerFn()
  .validator(z.object({ projectId: z.string() }))
  .handler(async ({ data }): Promise<Project | null> => {
    return (
      MOCK_PROJECTS.find((project) => project.id === data.projectId) ?? null
    );
  });
