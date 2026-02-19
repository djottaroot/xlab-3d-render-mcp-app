import { createMcpHandler } from "mcp-handler";
import path from "node:path";
import { registerTools } from "../src/server.js";

import { fileURLToPath } from "node:url";

const mcpHandler = createMcpHandler(
  (server) => {
    try {
      const __dirname = path.dirname(fileURLToPath(import.meta.url));
      const distDir = path.resolve(__dirname, "../dist");
      registerTools(server, distDir);
    } catch (error) {
      console.error("[XLab 3D Render] Fatal error during registerTools:", error);
    }
  },
  { serverInfo: { name: "XLab 3D Render", version: "1.0.0" } },
  { basePath: "", maxDuration: 60, sessionIdGenerator: undefined },
);

const handler = async (request: Request) => {
  try {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      url.pathname = url.pathname.replace("/api/", "/");
      return await mcpHandler(new Request(url.toString(), request));
    }
    return await mcpHandler(request);
  } catch (error: any) {
    console.error("[XLab 3D Render] Global Handler Error:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: error.message,
      stack: error.stack,
      note: "This is a debug response to identify the cause of the 500 error."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export { handler as GET, handler as POST, handler as DELETE };
