import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Sparkles, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateDescription, type Article } from "@/lib/api";

interface ArticleDescriptionGeneratorProps {
  onBack: () => void;
}

export default function ArticleDescriptionGenerator({ onBack }: ArticleDescriptionGeneratorProps) {
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    // Récupérer l'article depuis sessionStorage
    const articleData = sessionStorage.getItem("selectedArticle");
    if (articleData) {
      const parsedArticle = JSON.parse(articleData);
      setArticle(parsedArticle);
      
      // Générer automatiquement la description
      handleGenerateDescription(parsedArticle);
    } else {
      // Rediriger si pas d'article
      onBack();
    }
  }, [onBack]);

  const handleGenerateDescription = async (articleData: Article) => {
    if (!articleData.imageUrl) {
      toast({
        title: "Image requise",
        description: "L'article doit avoir une image pour générer une description",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Créer un FormData avec les données de l'article
      const formData = new FormData();
      
      // Récupérer l'image depuis l'URL (simulation)
      const response = await fetch(articleData.imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "article-image.jpg", { type: "image/jpeg" });
      
      formData.append("image", file);
      formData.append("price", articleData.price);
      formData.append("size", articleData.size);
      formData.append("brand", articleData.brand);
      formData.append("comment", articleData.comment || "");

      const generated = await generateDescription(formData);
      setGeneratedContent(generated);
      
      toast({
        title: "Description générée !",
        description: "L'IA a analysé votre article et créé une description optimisée",
      });
    } catch (error) {
      console.error("Erreur génération:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération de la description",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copié !",
        description: `${type} copié dans le presse-papier`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papier",
        variant: "destructive",
      });
    }
  };

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Effets de fond animés */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grille quantique de fond */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(14, 165, 233, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14, 165, 233, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative group/back">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover/back:opacity-100 transition-all duration-300"></div>
              <Button
                onClick={onBack}
                className="relative bg-black/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-60 animate-pulse"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-3">
                  <Sparkles className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Générateur IA de Description
                </h1>
                <p className="text-white/60">Analyse quantique de votre article</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Article Info */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-600/10 rounded-2xl blur"></div>
              <Card className="relative bg-black/40 backdrop-blur-xl border border-white/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white/90 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-3"></div>
                    Article analysé
                  </h2>
                  
                  <div className="space-y-4">
                    {article.imageUrl && (
                      <div className="relative group/image">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover/image:opacity-100 transition-all duration-300"></div>
                        <img
                          src={article.imageUrl}
                          alt={article.name}
                          className="relative w-full h-48 object-cover rounded-xl border border-white/20"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-white/60 text-sm">Nom</label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-lg blur opacity-50"></div>
                          <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-lg p-3">
                            <span className="text-white/90 font-medium">{article.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-white/60 text-sm">Marque</label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg blur opacity-50"></div>
                          <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-lg p-3">
                            <span className="text-white/90 font-medium">{article.brand}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-white/60 text-sm">Taille</label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-600/20 rounded-lg blur opacity-50"></div>
                          <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-lg p-3">
                            <span className="text-white/90 font-medium">{article.size}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-white/60 text-sm">Prix</label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-lg blur opacity-50"></div>
                          <div className="relative bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-lg p-3">
                            <span className="text-white/90 font-bold">{article.price}€</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Generated Content */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-600/10 rounded-2xl blur"></div>
              <Card className="relative bg-black/40 backdrop-blur-xl border border-white/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white/90 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-3"></div>
                    Contenu généré par IA
                  </h2>
                  
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
                        <p className="text-white/80">Analyse quantique en cours...</p>
                        <p className="text-white/50 text-sm">L'IA analyse votre article</p>
                      </div>
                    </div>
                  ) : generatedContent ? (
                    <div className="space-y-6">
                      {/* Titre */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-white/60 text-sm">Titre optimisé</label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedContent.title, "Titre")}
                            className="bg-black/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg blur opacity-50"></div>
                          <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg p-4">
                            <p className="text-white/90 font-medium">{generatedContent.title}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-white/60 text-sm">Description détaillée</label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(generatedContent.description, "Description")}
                            className="bg-black/40 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg blur opacity-50"></div>
                          <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                            <p className="text-white/90 leading-relaxed whitespace-pre-wrap">{generatedContent.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-3 pt-4 border-t border-white/10">
                        <div className="relative group/action flex-1">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-xl blur opacity-0 group-hover/action:opacity-100 transition-all duration-300"></div>
                          <Button
                            onClick={() => copyToClipboard(`${generatedContent.title}\n\n${generatedContent.description}`, "Contenu complet")}
                            className="relative w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border border-white/20 backdrop-blur-xl"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Tout copier
                          </Button>
                        </div>
                        
                        <div className="relative group/action">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover/action:opacity-100 transition-all duration-300"></div>
                          <Button
                            onClick={() => {
                              const text = `${generatedContent.title}\n\n${generatedContent.description}`;
                              if (navigator.share) {
                                navigator.share({
                                  title: "Description générée par IA",
                                  text: text,
                                });
                              } else {
                                copyToClipboard(text, "Contenu");
                              }
                            }}
                            className="relative bg-black/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 backdrop-blur-xl"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-white/60">
                      <Sparkles className="w-16 h-16 mx-auto mb-4 text-white/20" />
                      <p>Aucun contenu généré</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}