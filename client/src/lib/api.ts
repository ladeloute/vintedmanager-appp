import { apiRequest } from "./queryClient";

export interface GeneratedContent {
  title: string;
  description: string;
}

export interface Article {
  id: number;
  name: string;
  brand: string;
  size: string;
  price: string;
  purchasePrice: string;
  status: "vendu" | "non-vendu" | "en-attente";
  imageUrl?: string;
  comment?: string;
  generatedTitle?: string;
  generatedDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalArticles: number;
  monthlyItemsSold: number;
  monthlyRevenue: string;
  monthlyMargin: string;
  totalItemsSold: number;
  totalRevenue: string;
  totalMargin: string;
  averageCoefficient: string;
  averageMarginPercent: string;
}

export async function generateDescription(formData: FormData): Promise<GeneratedContent> {
  const response = await apiRequest("POST", "/api/generate-description", formData);
  return response.json();
}

export async function generateResponses(customerMessage: string): Promise<{ responses: string[] }> {
  const response = await apiRequest("POST", "/api/generate-responses", { customerMessage });
  return response.json();
}

export async function createArticle(formData: FormData): Promise<Article> {
  const response = await apiRequest("POST", "/api/articles", formData);
  return response.json();
}

export async function updateArticle(id: number, data: Partial<Article>): Promise<Article> {
  const response = await apiRequest("PATCH", `/api/articles/${id}`, data);
  return response.json();
}

export async function updateArticleWithImage(id: number, formData: FormData): Promise<Article> {
  const response = await apiRequest("PUT", `/api/articles/${id}`, formData);
  return response.json();
}

export async function deleteArticle(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/articles/${id}`);
}
