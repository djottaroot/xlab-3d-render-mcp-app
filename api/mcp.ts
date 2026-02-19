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
  {
    basePath: "/mcp",
    maxDuration: 60,
    verboseLogs: true,
    redisUrl: process.env.UPSTASH_REDIS_REST_URL
  },
);

const handler = async (request: Request) => {
  try {
    const url = new URL(request.url);
    console.log("url: ", url)
    // On s'assure que le chemin est bien /mcp même si Vercel passe par /api/mcp
    if (url.pathname === "/api/mcp" || url.pathname.startsWith("/api/mcp/")) {
      url.pathname = url.pathname.replace("/api/mcp", "/mcp");
    }

    return await mcpHandler(new Request(url.toString(), request));
  } catch (error: any) {
    console.error("[XLab 3D Render] Global Handler Error:", error);
    return new Response(JSON.stringify({
      error: "Internal Server Error",
      message: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export { handler as GET, handler as POST, handler as DELETE };
