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

  // Set up Firebase Admin or regular standard firebase on backend with 100% crash protection
  let storage: any = null;
  try {
    let configPath = path.join(process.cwd(), 'src', 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    }
    if (!fs.existsSync(configPath)) {
      configPath = path.join(__dirname, 'src', 'firebase-applet-config.json');
    }
    if (!fs.existsSync(configPath)) {
      configPath = path.join(__dirname, '..', 'src', 'firebase-applet-config.json');
    }

    if (fs.existsSync(configPath)) {
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const firebaseApp = initializeApp(firebaseConfig);
      storage = getStorage(firebaseApp);
      console.log("Firebase initialized successfully on Express backend.");
    } else {
      console.warn("Firebase configuration file fine check: not found. Local offline storage fallback is armed.");
    }
  } catch (err: any) {
    console.error("Firebase Storage backend initialization was bypassed due to error:", err.message || err);
  }

  // Set up local folder for static upload fallback
  // Use /tmp/uploads as default or fallback to handle read-only filesystems in Cloud Run containers smoothly
  let uploadsDir = path.join('/tmp', 'uploads');
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not write inside /tmp/uploads, using current working directory:", err);
    uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
  }

  // Add robust double protection: Register static middleware for BOTH /tmp/uploads and local /uploads folders!
  const localUploadsDir = path.join(process.cwd(), 'uploads');
  try {
    if (!fs.existsSync(localUploadsDir)) {
      fs.mkdirSync(localUploadsDir, { recursive: true });
    }
  } catch (err) {
    console.warn("Could not create local project root uploads directory:", err);
  }

  app.use('/uploads', express.static(uploadsDir));
  app.use('/uploads', express.static(localUploadsDir));

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

  // API upload route - server-to-server with robust local fallback!
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      const fileName = `${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9.]/g, "_")}`;

      try {
        console.log("Attempting Firebase Storage upload for", fileName);
        if (!storage) {
          throw new Error("Firebase Storage client is not initialized.");
        }
        const storageRef = ref(storage, `robot_portfolio_images/${fileName}`);

        // Perform upload using the buffer
        const snapshot = await uploadBytes(storageRef, req.file.buffer, {
          contentType: req.file.mimetype,
        });

        const downloadUrl = await getDownloadURL(snapshot.ref);
        console.log("Firebase Storage upload successful!", downloadUrl);
        return res.json({ url: downloadUrl });
      } catch (fbError: any) {
        console.warn("Firebase Storage upload fallback (GCS bucket or client might not be initialised/configured):", fbError.message || fbError);
        console.log("Falling back to local disk storage upload...");

        const localFilePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(localFilePath, req.file.buffer);

        try {
          const secondLocalFilePath = path.join(localUploadsDir, fileName);
          fs.writeFileSync(secondLocalFilePath, req.file.buffer);
        } catch (copyErr) {
          console.warn("Could not copy uploaded image to root folder uploads:", copyErr);
        }

        console.log("Local upload successful. Serving via /uploads/", fileName);
        return res.json({ url: `/uploads/${fileName}` });
      }
    } catch (error: any) {
      console.error("Server-side image upload error:", error);
      return res.status(500).json({ error: error.message || "Failed to upload image" });
    }
  });

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Global error handler for middleware & routes
  app.use((err: any, req: any, res: any, next: any) => {
    console.error("Global Express Error Handler Captured Error:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
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
