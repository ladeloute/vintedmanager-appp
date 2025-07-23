import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { upload, getImageAsBase64 } from "./services/upload";
import { generateArticleDescription, generateCustomerResponses } from "./services/gemini";
import { insertArticleSchema, insertSaleSchema, insertConversationSchema } from "@shared/schema";
import { z } from "zod";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded images
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  // Keep-alive endpoint
  app.get("/ping", (req, res) => {
    res.json({ status: "alive", timestamp: new Date().toISOString() });
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    try {
      const articles = await storage.getArticles();
      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des articles" });
    }
  });

  app.post("/api/articles", upload.any(), async (req, res) => {
    try {
      console.log("Raw request body:", req.body);
      console.log("Request files:", req.files ? req.files.length : 0);
      console.log("All body keys:", Object.keys(req.body || {}));
      
      // Extract data from the parsed form
      const cleanData = {
        name: req.body.name || "",
        brand: req.body.brand || "",
        size: req.body.size || "",
        price: req.body.price || "",
        status: req.body.status || "non-vendu",
        comment: req.body.comment || ""
      };
      
      console.log("Cleaned form data:", cleanData);
      
      const validatedData = insertArticleSchema.parse(cleanData);
      
      // Find the image file if uploaded
      const imageFile = Array.isArray(req.files) ? req.files.find(f => f.fieldname === 'image') : null;
      
      // Add image URL if file was uploaded
      const articleData = {
        ...validatedData,
        imageUrl: imageFile ? `/uploads/${imageFile.filename}` : null
      };

      const article = await storage.createArticle(articleData);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation errors:", error.errors);
        res.status(400).json({ message: "Données invalides", errors: error.errors });
      } else {
        console.log("Server error:", error);
        res.status(500).json({ message: "Erreur lors de la création de l'article" });
      }
    }
  });

  // PUT and PATCH for article updates
  app.put("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const article = await storage.updateArticle(id, updateData);
      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'article" });
    }
  });

  app.patch("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      const article = await storage.updateArticle(id, updateData);
      if (!article) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'article" });
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteArticle(id);
      
      if (!success) {
        return res.status(404).json({ message: "Article non trouvé" });
      }
      
      res.json({ message: "Article supprimé avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression de l'article" });
    }
  });

  // AI Description Generation
  app.post("/api/generate-description", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image requise" });
      }

      const { price, size, brand, comment, articleId } = req.body;
      
      if (!price || !size || !brand) {
        return res.status(400).json({ message: "Prix, taille et marque sont requis" });
      }

      const imageBase64 = getImageAsBase64(req.file.path);
      const generated = await generateArticleDescription(imageBase64, price, size, brand, comment);

      // If articleId provided, update the article
      if (articleId) {
        await storage.updateArticleGeneration(parseInt(articleId), generated.title, generated.description);
      }

      res.json(generated);
    } catch (error) {
      console.error("Generation error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Erreur lors de la génération" });
    }
  });

  // Customer Response Assistant
  app.post("/api/generate-responses", async (req, res) => {
    try {
      const { customerMessage } = req.body;
      
      if (!customerMessage) {
        return res.status(400).json({ message: "Message client requis" });
      }

      const conversation = await storage.createConversation({ customerMessage });
      const responses = await generateCustomerResponses(customerMessage);
      
      await storage.updateConversationResponses(conversation.id, responses);

      res.json({ responses });
    } catch (error) {
      console.error("Response generation error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "Erreur lors de la génération des réponses" });
    }
  });

  // Sales routes
  app.post("/api/sales", async (req, res) => {
    try {
      const validatedData = insertSaleSchema.parse(req.body);
      const sale = await storage.createSale(validatedData);
      res.json(sale);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Données invalides", errors: error.errors });
      } else {
        res.status(500).json({ message: "Erreur lors de la création de la vente" });
      }
    }
  });

  // Dashboard stats
  app.get("/api/dashboard-stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la récupération des statistiques" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
