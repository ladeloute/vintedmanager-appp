import { articles, sales, conversations, type Article, type InsertArticle, type Sale, type InsertSale, type Conversation, type InsertConversation, type DashboardStats } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, count, sum, avg, sql } from "drizzle-orm";

export interface IStorage {
  // Articles
  createArticle(article: InsertArticle): Promise<Article>;
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article | undefined>;
  deleteArticle(id: number): Promise<boolean>;
  updateArticleGeneration(id: number, title: string, description: string): Promise<Article | undefined>;
  
  // Sales
  createSale(sale: InsertSale): Promise<Sale>;
  getSales(): Promise<Sale[]>;
  
  // Conversations
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversationResponses(id: number, responses: string[]): Promise<Conversation | undefined>;
  
  // Stats
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values(insertArticle)
      .returning();
    return article;
  }

  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async updateArticle(id: number, updateData: Partial<InsertArticle>): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return (result.rowCount || 0) > 0;
  }

  async updateArticleGeneration(id: number, title: string, description: string): Promise<Article | undefined> {
    const [article] = await db
      .update(articles)
      .set({ 
        generatedTitle: title, 
        generatedDescription: description,
        updatedAt: new Date()
      })
      .where(eq(articles.id, id))
      .returning();
    return article || undefined;
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const [sale] = await db
      .insert(sales)
      .values(insertSale)
      .returning();
    
    // Update article status to sold
    await db
      .update(articles)
      .set({ status: "vendu", updatedAt: new Date() })
      .where(eq(articles.id, insertSale.articleId));
    
    return sale;
  }

  async getSales(): Promise<Sale[]> {
    return await db.select().from(sales).orderBy(desc(sales.saleDate));
  }

  async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
    const [conversation] = await db
      .insert(conversations)
      .values(insertConversation)
      .returning();
    return conversation;
  }

  async updateConversationResponses(id: number, responses: string[]): Promise<Conversation | undefined> {
    const [conversation] = await db
      .update(conversations)
      .set({ generatedResponses: responses })
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }

  async getDashboardStats(): Promise<DashboardStats> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Monthly stats
    const monthlyStats = await db
      .select({
        count: count(),
        revenue: sum(sales.salePrice)
      })
      .from(sales)
      .where(gte(sales.saleDate, startOfMonth));

    // Total stats
    const totalStats = await db
      .select({
        count: count(),
        avgCoefficient: avg(sales.coefficient)
      })
      .from(sales);

    return {
      monthlyItemsSold: monthlyStats[0]?.count || 0,
      monthlyRevenue: monthlyStats[0]?.revenue || "0",
      totalItemsSold: totalStats[0]?.count || 0,
      averageCoefficient: totalStats[0]?.avgCoefficient || "0"
    };
  }
}

export const storage = new DatabaseStorage();
