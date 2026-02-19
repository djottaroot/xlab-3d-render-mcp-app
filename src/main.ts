import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import cors from "cors";
import express, { type Request, type Response } from "express";
import { createServer } from "./server.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = __filename.endsWith(".ts") || __filename.endsWith(".tsx")
  ? path.resolve(__dirname, "..", "dist")
  : __dirname;

/**
 * Starts an Express server using Streamable HTTP transport.
 * This is the primary transport for web-based MCP clients (e.g. Host App).
 * 
 * @returns {Promise<void>}
 */
async function startStreamableHTTPServer(): Promise<void> {
  const port = parseInt(process.env.PORT ?? "3000", 10);
  const app = createMcpExpressApp({ host: "0.0.0.0" });

  // Robust cors call for different environments
  app.use(cors({ origin: "*" }));

  // Serve static UI files from dist
  app.use(express.static(DIST_DIR));

  app.all("/mcp", async (req: Request, res: Response) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    res.on("close", () => {
      transport.close().catch(() => { });
      server.close().catch(() => { });
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
    } catch (error) {
      console.error("MCP error:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  app.listen(port, () => {
    console.log(`MCP server listening on http://localhost:${port}/mcp`);
  });
}

/**
 * Starts a Stdio based MCP server.
 * Used for CLI-based MCP clients or local testing.
 * 
 * @returns {Promise<void>}
 */
async function startStdioServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

/**
 * Entry point for the MCP server.
 * Selects transport based on command line arguments.
 */
async function main() {
  if (process.argv.includes("--stdio")) {
    await startStdioServer();
  } else {
    await startStreamableHTTPServer();
  }
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
