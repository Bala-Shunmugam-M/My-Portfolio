import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

const MIME: Record<string, string> = {
  ".html": "text/html",
  ".pdf": "application/pdf",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
};

// Serve the existing portfolio files (project pages, résumé, assets) that live
// one level up, so links like /inventoryiq.html resolve during `npm run dev`.
function serveParentPortfolio(): Plugin {
  const parent = path.resolve(__dirname, "..");
  return {
    name: "serve-parent-portfolio",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || req.url === "/") return next();
        const urlPath = decodeURIComponent(req.url.split("?")[0]);
        // Don't hijack the dev app's own modules/assets
        if (urlPath.startsWith("/src") || urlPath.startsWith("/@") || urlPath.startsWith("/node_modules")) {
          return next();
        }
        const filePath = path.join(parent, urlPath);
        // Keep it inside the portfolio folder
        if (!filePath.startsWith(parent)) return next();
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
          fs.createReadStream(filePath).pipe(res);
          return;
        }
        return next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), serveParentPortfolio()],
  base: "./",
});
