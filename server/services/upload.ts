import multer from "multer";
import { Request } from "express";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, `article-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  }
});

export function getImageAsBase64(imagePath: string): string {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString("base64");
  } catch (error) {
    throw new Error("Erreur lors de la lecture de l'image");
  }
}
