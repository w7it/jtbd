import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z as mcpZod } from "mcp-zod";
const z = mcpZod as unknown as typeof import("zod").z;

export const mcpServer = new McpServer({
  name: "jtbd-server",
  version: "1.0.0",
  description: "MCP server for JTBD Builder",
});

mcpServer.registerTool(
  "roll_dice",
  {
    description: "Rolls an N-sided die",
    inputSchema: {
      sides: z.number().int().min(2).describe("The number of sides on the die"),
    },
  },
  async ({ sides }) => {
    const value = 1 + Math.floor(Math.random() * sides);
    return {
      content: [{ type: "text", text: `🎲 You rolled a ${value}!` }],
    };
  },
);
