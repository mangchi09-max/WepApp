import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import multer from "multer";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set up Firebase Admin or regular standard firebase on backend
  const configPath = path.join(process.cwd(), 'src', 'firebase-applet-config.json');
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const firebaseApp = initializeApp(firebaseConfig);
  const storage = getStorage(firebaseApp);

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Multer config for in-memory upload
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    }
  });

  // API upload route - server-to-server to avoid CORS issues!
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const fileName = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`;
      const storageRef = ref(storage, `robot_portfolio_images/${fileName}`);

      // Perform upload using the buffer
      const snapshot = await uploadBytes(storageRef, req.file.buffer, {
        contentType: req.file.mimetype,
      });

      const downloadUrl = await getDownloadURL(snapshot.ref);
      return res.json({ url: downloadUrl });
    } catch (error: any) {
      console.error("Server-side image upload error:", error);
      return res.status(500).json({ error: error.message || "Failed to upload image" });
    }
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
