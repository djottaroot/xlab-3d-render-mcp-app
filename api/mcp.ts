import { createMcpHandler } from "mcp-handler";
import path from "node:path";
import { registerTools } from "../src/server.js";

const mcpHandler = createMcpHandler(
  (server) => {
    const distDir = path.join(process.cwd(), "dist");
    registerTools(server, distDir);
  },
  { serverInfo: { name: "XLab-3D-Render", version: "1.0.0" } },
  {
    basePath: "",
    maxDuration: 60,
    // !!! Ne change pas la variable !!!
    redisUrl: process.env.REDIS_URL
  },
);

const handler = async (request: Request) => {
  const url = new URL(request.url);

  // Normalisation pour aligner les requêtes /api/mcp/... vers /...
  if (url.pathname.startsWith("/api/mcp")) {
    url.pathname = url.pathname.replace("/api/mcp", "");
  } else if (url.pathname.startsWith("/mcp")) {
    url.pathname = url.pathname.replace("/mcp", "");
  }

  if (url.pathname === "") {
    url.pathname = "/";
  }

  return mcpHandler(new Request(url.toString(), request));
};

export { handler as GET, handler as POST, handler as DELETE };
