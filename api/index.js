import express from "express";
import { registerRoutes } from "../server/routes.js";
import { serveStatic } from "../server/static.js";

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
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
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

// Serve static files in production
// In Vercel, static files from dist/public are served automatically via outputDirectory
// This handles SPA routing fallback
if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
  try {
    serveStatic(app);
  } catch (err) {
    console.warn("Static file serving setup failed:", err.message);
    // Fallback for SPA routing - serve index.html for all non-API routes
    app.get("*", (_req, res) => {
      res.status(404).json({ message: "Not found" });
    });
  }
}

// Vercel serverless function handler
// This is the entry point for all requests
export default function handler(req, res) {
  return app(req, res);
}
