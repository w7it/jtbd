import { mcpServer } from "@/server/mcp.ts";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  createServerFileRoute,
  getEvent,
  fromNodeMiddleware,
} from "@tanstack/react-start/server";

const transports = new Map<string, StreamableHTTPServerTransport>();

const createTransport = async () => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
    onsessioninitialized: (sessionId) => {
      transports.set(sessionId, transport);
    },
  });
  transport.onerror = (error) => {
    console.error(error);
  };
  transport.onclose = () => {
    if (transport.sessionId) {
      transports.delete(transport.sessionId);
    }
  };

  await mcpServer.connect(transport);

  return transport;
};

const handleRequest = async (
  transport: StreamableHTTPServerTransport,
): Promise<Response> => {
  const { req, res } = getEvent().node;
  await transport.handleRequest(req, res);

  // TODO: figure out how to return the response without sending it?
  // giving endless promise to do not call sendWebResponse
  return new Promise<Response>(() => {});
};

const handleNewSessionRequest = async (request: Request) => {
  const sessionId = request.headers.get("mcp-session-id") as string | undefined;
  const transport =
    (sessionId ? transports.get(sessionId) : null) ?? (await createTransport());

  return handleRequest(transport);
};

const handleSessionRequest = async (request: Request): Promise<Response> => {
  const sessionId = request.headers.get("mcp-session-id") as string | undefined;
  if (!sessionId) {
    return new Response('Missing or empty "mcp-session-id" header', {
      status: 400,
    });
  }

  const transport = transports.get(sessionId);
  if (!transport) {
    return new Response("Invalid or missing session ID", { status: 400 });
  }

  return handleRequest(transport);
};

export const ServerRoute = createServerFileRoute("/api/mcp").methods({
  GET: async ({ request }) => handleSessionRequest(request),
  POST: async ({ request }) => handleNewSessionRequest(request),
  DELETE: async ({ request }) => handleSessionRequest(request),
});
