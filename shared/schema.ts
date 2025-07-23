import { pgTable, text, serial, integer, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  size: text("size").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  status: text("status", { enum: ["vendu", "non-vendu", "en-attente"] }).notNull().default("non-vendu"),
  imageUrl: text("image_url"),
  comment: text("comment"),
  generatedTitle: text("generated_title"),
  generatedDescription: text("generated_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sales = pgTable("sales", {
  id: serial("id").primaryKey(),
  articleId: integer("article_id").references(() => articles.id).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }).notNull(),
  saleDate: timestamp("sale_date").defaultNow().notNull(),
  coefficient: decimal("coefficient", { precision: 5, scale: 2 }),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  customerMessage: text("customer_message").notNull(),
  generatedResponses: json("generated_responses").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertArticleSchema = createInsertSchema(articles).pick({
  name: true,
  brand: true,
  size: true,
  price: true,
  status: true,
  comment: true,
});

export const insertSaleSchema = createInsertSchema(sales).pick({
  articleId: true,
  salePrice: true,
  coefficient: true,
});

export const insertConversationSchema = createInsertSchema(conversations).pick({
  customerMessage: true,
});

export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;
export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Dashboard stats type
export interface DashboardStats {
  monthlyItemsSold: number;
  monthlyRevenue: string;
  totalItemsSold: number;
  averageCoefficient: string;
}
