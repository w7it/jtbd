import {
  NodeType,
  ProjectJobNode,
  StickyNoteData,
  StickyNoteNode,
} from "@/constants/boards.ts";
import {
  genBoardNodeId,
  genBoardStickyNoteId,
  genProjectJobId,
} from "./genId.ts";

export const genEmptyStickyNoteData = (): StickyNoteData => ({
  id: genBoardStickyNoteId(),
  content: "",
  size: "md",
  color: "yellow",
});

export const genEmptyStickyNoteNode = (): StickyNoteNode => ({
  id: genBoardNodeId(),
  type: NodeType.STICKY_NOTE,
  position: { x: 0, y: 0 },
  data: genEmptyStickyNoteData(),
});

export const genEmptyProjectJobNode = (): ProjectJobNode => ({
  id: genBoardNodeId(),
  type: NodeType.PROJECT_JOB,
  position: { x: 0, y: 0 },
  data: {
    id: genProjectJobId(),
    name: "to ...",
    when: "",
    soThat: "",
    importance: "",
    frequency: "",
  },
});
