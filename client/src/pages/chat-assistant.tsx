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
    <div className="space-y-8 p-6">
      {/* Header Futuriste */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-green-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl blur opacity-60 animate-pulse"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <Bot className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent mb-4">
            Assistant Conversationnel IA
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Générez des réponses professionnelles et empathiques avec l'intelligence artificielle avancée
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      {/* Interface Principale */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-green-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-700"></div>
        <Card className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]"></div>
            <div className="relative z-10 space-y-8">

              {/* Zone de saisie quantique */}
              <div className="space-y-4">
                <Label htmlFor="customerMessage" className="text-white/80 text-lg font-medium">Message client détecté</Label>
                <div className="relative group/input">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-2xl blur group-hover/input:blur-none transition-all duration-500"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-2xl">
                    <Textarea
                      id="customerMessage"
                      rows={6}
                      placeholder="Analysez le message client pour générer des réponses intelligentes..."
                      value={customerMessage}
                      onChange={(e) => setCustomerMessage(e.target.value)}
                      className="resize-none bg-transparent border-0 text-white placeholder:text-white/40 text-lg p-6"
                    />
                  </div>
                </div>
              </div>

              {/* Bouton de génération */}
              <div className="text-center">
                <div className="relative group/button">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-2xl blur-xl opacity-60 group-hover/button:opacity-80 transition-all duration-500"></div>
                  <Button
                    onClick={handleGenerate}
                    disabled={generateMutation.isPending}
                    className="relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-12 py-6 rounded-2xl border border-white/20 backdrop-blur-xl font-bold text-lg transition-all duration-500 group-hover/button:scale-105"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Analyse neuronale...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="w-6 h-6" />
                          <span>GÉNÉRER 3 RÉPONSES IA</span>
                        </div>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Réponses générées holographiques */}
              {responses.length > 0 && (
                <div className="space-y-8">
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                  
                  <h3 className="text-2xl font-bold text-white/90 text-center flex items-center justify-center">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
                    Réponses quantiques générées
                  </h3>
                  
                  <div className="space-y-6">
                    {responses.map((response, index) => (
                      <div key={index} className="relative group/response">
                        <div className={`absolute inset-0 rounded-2xl blur transition-all duration-500 ${
                          index === 0 ? 'bg-gradient-to-r from-emerald-500/20 to-green-600/20' :
                          index === 1 ? 'bg-gradient-to-r from-blue-500/20 to-cyan-600/20' :
                          'bg-gradient-to-r from-purple-500/20 to-pink-600/20'
                        }`}></div>
                        <div className={`relative backdrop-blur-xl border rounded-2xl p-6 ${
                          index === 0 ? 'bg-black/40 border-emerald-500/30' :
                          index === 1 ? 'bg-black/40 border-blue-500/30' :
                          'bg-black/40 border-purple-500/30'
                        }`}>
                          <div className="flex items-center justify-between mb-4">
                            <Badge className={`${
                              index === 0 ? 'bg-emerald-500/80 text-white' :
                              index === 1 ? 'bg-blue-500/80 text-white' :
                              'bg-purple-500/80 text-white'
                            } backdrop-blur-sm border border-white/20`}>
                              {responseLabels[index].label}
                            </Badge>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(response, index)}
                                className={`${
                                  index === 0 ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30' :
                                  index === 1 ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30' :
                                  'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30'
                                }`}
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => regenerateResponse(index)}
                                disabled={generateMutation.isPending}
                                className={`${
                                  index === 0 ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30' :
                                  index === 1 ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30' :
                                  'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30'
                                }`}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 whitespace-pre-wrap text-white/90">
                            {response}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}