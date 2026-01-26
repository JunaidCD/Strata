import express from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app) {
  // For Vercel, static files are in dist/public
  // For local, they're in dist/public relative to project root
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
  
  if (!fs.existsSync(distPath)) {
    console.warn(`Build directory not found at ${distPath}, skipping static file serving`);
    // In Vercel, static files are handled by the platform, so we just need to serve index.html for SPA routing
    app.use("*", (_req, res) => {
      // Try to serve index.html from dist/public
      const indexPath = path.resolve(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Not found - build files missing");
      }
    });
    return;
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist (SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
