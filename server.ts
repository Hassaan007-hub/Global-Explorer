import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS
  app.use(cors());
  app.use(express.json());

  // API Proxy for Countries
  app.get("/api/countries", async (req, res) => {
    try {
      const { fields } = req.query;
      const url = `https://restcountries.com/v3.1/all${fields ? `?fields=${fields}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch countries" });
    }
  });

  app.get("/api/countries/alpha", async (req, res) => {
    try {
      const { codes, fields } = req.query;
      const url = `https://restcountries.com/v3.1/alpha?codes=${codes}${fields ? `&fields=${fields}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bordering countries" });
    }
  });

  app.get("/api/countries/:code", async (req, res) => {
    try {
      const { code } = req.params;
      const url = `https://restcountries.com/v3.1/alpha/${code}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch country details" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
