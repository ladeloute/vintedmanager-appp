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
  status: "vendu" | "non-vendu" | "en-attente";
  imageUrl?: string;
  comment?: string;
  generatedTitle?: string;
  generatedDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  monthlyItemsSold: number;
  monthlyRevenue: string;
  totalItemsSold: number;
  averageCoefficient: string;
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

export async function deleteArticle(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/articles/${id}`);
}
