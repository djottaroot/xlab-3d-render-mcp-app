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
      console.error("[3D-Render] Error during registerTools:", error);
    }
  },
  { serverInfo: { name: "XLab-3D-Render", version: "1.0.0" } },
  {
    basePath: "", // On garde le basePath vide pour la flexibilité
    maxDuration: 60,
    // !!! Ne change pas la variable !!!
    redisUrl: process.env.REDIS_URL
  },
);

const handler = async (request: Request) => {
  const url = new URL(request.url);

  // Normalisation de l'URL pour mcp-handler
  // Si on arrive via /mcp ou /api/mcp, on nettoie pour que mcp-handler voie "/"
  if (url.pathname.startsWith("/api/mcp")) {
    url.pathname = url.pathname.replace("/api/mcp", "");
  } else if (url.pathname.startsWith("/mcp")) {
    url.pathname = url.pathname.replace("/mcp", "");
  } else if (url.pathname.startsWith("/api")) {
    url.pathname = url.pathname.replace("/api", "");
  }

  // S'assurer que le pathname n'est pas vide
  if (url.pathname === "") url.pathname = "/";

  return mcpHandler(new Request(url.toString(), request));
};

export { handler as GET, handler as POST, handler as DELETE };
