import express from "express";
import fs from "fs";
import path from "path";
import { registerRoutes } from "../server/routes.js";

const app = express();

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      let logLine = `${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Initialize routes synchronously (registerRoutes doesn't actually need async)
registerRoutes(null, app);

// Error handler
app.use((err, _req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Internal Server Error:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(status).json({ message });
});

// Handle SPA routing - serve index.html for all non-API routes
// Static assets (JS, CSS, images) should be served directly by Vercel from dist/public
// This handler receives requests that don't match existing static files
if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
  app.use((req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api/")) {
      return next();
    }
    
    // Check if this is a static file request
    const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.json', '.map', '.webp'];
    const hasStaticExtension = staticExtensions.some(ext => req.path.toLowerCase().endsWith(ext));
    
    if (hasStaticExtension) {
      // Static file should have been served by Vercel, return 404 if we reach here
      return res.status(404).send("Static file not found");
    }
    
    // Serve index.html for SPA routing with correct Content-Type
    const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");
    const indexPath = path.resolve(distPath, "index.html");
    
    if (fs.existsSync(indexPath)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      return res.sendFile(indexPath);
    } else {
      console.error(`index.html not found at ${indexPath}. Current dir: ${import.meta.dirname}`);
      return res.status(500).send("Build files not found. Please check the build output.");
    }
  });
}

// Vercel serverless function handler
// This is the entry point for all requests
export default function handler(req, res) {
  return app(req, res);
}
