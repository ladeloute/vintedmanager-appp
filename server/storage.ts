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

    // Get total articles count
    const [totalArticles] = await db
      .select({ count: count() })
      .from(articles);

    // Get articles sold this month (by status change)
    const [monthlySoldArticles] = await db
      .select({ count: count() })
      .from(articles)
      .where(and(
        eq(articles.status, "vendu"),
        gte(articles.updatedAt, startOfMonth)
      ));

    // Get total sold articles
    const [totalSoldArticles] = await db
      .select({ count: count() })
      .from(articles)
      .where(eq(articles.status, "vendu"));

    // Get monthly revenue from sold articles this month
    const [monthlyRevenue] = await db
      .select({ 
        revenue: sum(sql`CAST(${articles.price} AS DECIMAL)`)
      })
      .from(articles)
      .where(and(
        eq(articles.status, "vendu"),
        gte(articles.updatedAt, startOfMonth)
      ));

    // Get total revenue from all sold articles
    const [totalRevenue] = await db
      .select({ 
        revenue: sum(sql`CAST(${articles.price} AS DECIMAL)`)
      })
      .from(articles)
      .where(eq(articles.status, "vendu"));

    // Calculate average price as coefficient
    const [avgPrice] = await db
      .select({ 
        avgPrice: avg(sql`CAST(${articles.price} AS DECIMAL)`)
      })
      .from(articles)
      .where(eq(articles.status, "vendu"));

    return {
      totalArticles: totalArticles.count || 0,
      monthlyItemsSold: monthlySoldArticles.count || 0,
      monthlyRevenue: monthlyRevenue.revenue?.toString() || "0.00",
      totalItemsSold: totalSoldArticles.count || 0,
      totalRevenue: totalRevenue.revenue?.toString() || "0.00",
      averageCoefficient: avgPrice.avgPrice?.toString() || "0.00"
    };
  }
}

export const storage = new DatabaseStorage();
