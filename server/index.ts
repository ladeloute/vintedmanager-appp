import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

// Version production sans Vite
const log = (message: string, source = "express") => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
};

const serveStatic = (app: express.Express) => {
  app.use(express.static("dist/public"));
  app.get("*", (_req, res) => {
    res.sendFile(process.cwd() + "/dist/public/index.html");
  });
};

// Import dynamique de Vite seulement en développement
async function loadViteIfNeeded() {
  if (process.env.NODE_ENV === "development") {
    const viteModule = await import("./vite.js");
    return {
      setupVite: viteModule.setupVite,
      serveStatic: viteModule.serveStatic,
      log: viteModule.log
    };
  }
  return { setupVite: null, serveStatic, log };
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

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

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Load Vite conditionally and setup routes
  const { setupVite, serveStatic: staticHandler, log: logger } = await loadViteIfNeeded();
  
  if (process.env.NODE_ENV === "development" && setupVite) {
    await setupVite(app, server);
  } else {
    staticHandler(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    logger(`serving on port ${port}`);
    
    // Démarrer le keep-alive automatique
    const REPL_URL = 'https://e8c39cc9-cf2c-4307-b459-339a185d3aa2-00-2fom0j0gq2vvu.picard.repl.co';
    
    // Auto-ping toutes les 3 minutes pour maintenir l'app active
    setInterval(() => {
      fetch(`${REPL_URL}/ping`)
        .then(res => {
          if (res.ok) {
            console.log(`Keep-alive: App active at ${new Date().toLocaleTimeString()}`);
          }
        })
        .catch(() => {
          console.log('Keep-alive: Retrying in 30s...');
          // Retry after 30 seconds
          setTimeout(() => {
            fetch(`${REPL_URL}/ping`).catch(() => {});
          }, 30000);
        });
    }, 3 * 60 * 1000); // 3 minutes
    
    console.log(`🚀 VintedManager active 24h/24 sur: ${REPL_URL}`);
  });
})();
