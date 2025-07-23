import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "" 
});

export interface GeneratedContent {
  title: string;
  description: string;
}

export async function generateArticleDescription(
  imageBase64: string,
  price: string,
  size: string,
  brand: string,
  comment?: string
): Promise<GeneratedContent> {
  try {
    const prompt = `Tu es un expert en vente sur Vinted. Génère un titre accrocheur et une description complète pour cet article.

Informations:
- Prix: ${price}€
- Taille: ${size}
- Marque: ${brand}
${comment ? `- Commentaire: ${comment}` : ''}

Analyse l'image et crée:
1. Un titre court et accrocheur avec des émojis
2. Une description détaillée pour Vinted avec:
   - Une intro accrocheuse
   - Les détails techniques
   - Les points forts
   - Des hashtags pertinents

Réponds au format JSON avec les clés "title" et "description".`;

    const contents = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
      prompt,
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
          },
          required: ["title", "description"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return {
      title: result.title || "Titre généré",
      description: result.description || "Description générée"
    };
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Erreur lors de la génération du contenu");
  }
}

export async function generateCustomerResponses(customerMessage: string): Promise<string[]> {
  try {
    const prompt = `Tu es un vendeur expérimenté sur Vinted. Un client t'a envoyé ce message:
"${customerMessage}"

Génère 3 réponses différentes:
1. Une réponse chaleureuse et détaillée
2. Une réponse précise et professionnelle
3. Une réponse courte et amicale

Chaque réponse doit:
- Être en français
- Inclure un émoji approprié
- Être polie et helpful
- Être adaptée au ton demandé

Réponds au format JSON avec un array "responses" contenant les 3 réponses.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            responses: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 3
            }
          },
          required: ["responses"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result.responses || [
      "Bonjour ! Merci pour votre message 😊",
      "Hello ! Je vous réponds rapidement.",
      "Salut ! 👋"
    ];
  } catch (error) {
    console.error("Error generating responses with Gemini:", error);
    throw new Error("Erreur lors de la génération des réponses");
  }
}
