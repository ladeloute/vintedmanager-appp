import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Bot, Copy, RefreshCw, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateResponses } from "@/lib/api";

export default function ChatAssistant() {
  const [customerMessage, setCustomerMessage] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: generateResponses,
    onSuccess: (data) => {
      setResponses(data.responses);
      toast({
        title: "Réponses générées",
        description: "3 suggestions de réponses sont prêtes !",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!customerMessage.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message client",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate(customerMessage);
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `Réponse ${index + 1} copiée`,
        description: "Le texte a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le texte",
        variant: "destructive",
      });
    }
  };

  const regenerateResponse = (index: number) => {
    // For now, regenerate all responses
    // In a real app, you might want to regenerate just one response
    if (customerMessage.trim()) {
      generateMutation.mutate(customerMessage);
    }
  };

  const responseLabels = [
    { label: "Réponse 1 - Chaleureuse", color: "bg-success text-white" },
    { label: "Réponse 2 - Précise", color: "bg-primary text-white" },
    { label: "Réponse 3 - Courte", color: "bg-accent text-white" },
  ];

  return (
    <Card className="shadow-material-1 max-w-4xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-medium mb-6 flex items-center">
          <Bot className="w-6 h-6 mr-3 text-primary" />
          Assistant réponses client avec Gemini
        </h2>

        {/* Input Customer Message */}
        <div className="mb-6">
          <Label htmlFor="customerMessage">Message reçu d'un acheteur</Label>
          <Textarea
            id="customerMessage"
            rows={4}
            placeholder="Collez ici le message que vous avez reçu..."
            value={customerMessage}
            onChange={(e) => setCustomerMessage(e.target.value)}
            className="resize-none"
          />

          <div className="mt-4 text-center">
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="bg-primary hover:bg-blue-600 px-6 py-3 shadow-material-1"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  Générer des réponses
                </>
              )}
            </Button>
          </div>
        </div>

        {/* AI Generated Responses */}
        {responses.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center mb-4">
              <MessageCircle className="w-5 h-5 mr-2" />
              Réponses suggérées par Gemini
            </h3>

            {responses.map((response, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Badge className={`${responseLabels[index].color} mb-2`}>
                      {responseLabels[index].label}
                    </Badge>
                    <p className="text-text-primary">{response}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(response, index)}
                      className="text-text-secondary hover:text-primary"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateResponse(index)}
                      className="text-text-secondary hover:text-accent"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Regenerate All Button */}
            <div className="text-center pt-4">
              <Button
                onClick={handleGenerate}
                variant="outline"
                className="bg-accent hover:bg-orange-600 text-white border-accent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Régénérer toutes les réponses
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
