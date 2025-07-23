import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ArticleCard from "@/components/articles/ArticleCard";
import AddArticleModal from "@/components/articles/AddArticleModal";
import { createArticle, deleteArticle, updateArticle, type Article } from "@/lib/api";

interface ArticleManagementProps {
  onNavigateToDescriptionGenerator?: () => void;
}

export default function ArticleManagement({ onNavigateToDescriptionGenerator }: ArticleManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const createMutation = useMutation({
    mutationFn: async ({ data, image }: { data: any; image?: File }) => {
      console.log("Frontend data before FormData:", data);
      const formData = new FormData();
      
      // Always add all required fields, even if empty
      formData.append("name", data.name || "");
      formData.append("brand", data.brand || "");
      formData.append("size", data.size || "");
      formData.append("price", data.price || "");
      formData.append("status", data.status || "non-vendu");
      formData.append("comment", data.comment || "");
      
      // Only append image if it exists
      if (image) {
        formData.append("image", image);
      }
      
      // Log FormData contents
      console.log("FormData entries:");
      const entries = Array.from(formData.entries());
      entries.forEach(([key, value]) => {
        console.log(`FormData ${key}:`, value);
      });
      
      return createArticle(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
      toast({
        title: "Article créé",
        description: "L'article a été ajouté avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la suppression",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Article> }) => {
      return updateArticle(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
      toast({
        title: "Article mis à jour",
        description: "L'article a été mis à jour avec succès",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    },
  });

  const handleCreateArticle = async (data: any, image?: File) => {
    await createMutation.mutateAsync({ data, image });
  };

  const handleMarkAsSold = async (id: number) => {
    if (confirm("Marquer cet article comme vendu ?")) {
      await updateMutation.mutateAsync({ id, data: { status: "vendu" } });
    }
  };

  const handleDeleteArticle = (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEditArticle = (article: Article) => {
    // Créer un formulaire d'édition rapide
    const newName = prompt("Nouveau nom de l'article:", article.name);
    if (newName && newName !== article.name) {
      updateMutation.mutate({ id: article.id, data: { name: newName } });
    }
  };

  const handleGenerateDescription = async (article: Article) => {
    if (!article.imageUrl) {
      toast({
        title: "Image requise",
        description: "Cet article n'a pas d'image pour générer une description",
        variant: "destructive",
      });
      return;
    }

    // Stocker l'article dans sessionStorage pour la page de génération
    sessionStorage.setItem("selectedArticle", JSON.stringify(article));
    
    // Naviguer vers la page de génération
    if (onNavigateToDescriptionGenerator) {
      onNavigateToDescriptionGenerator();
    } else {
      toast({
        title: "Navigation non disponible",
        description: "Impossible d'ouvrir la page de génération",
        variant: "destructive",
      });
    }
  };

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !brandFilter || brandFilter === "all" || article.brand.toLowerCase() === brandFilter.toLowerCase();
    const matchesStatus = !statusFilter || statusFilter === "all" || article.status === statusFilter;
    return matchesSearch && matchesBrand && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card className="shadow-material-1">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-8 p-4 sm:p-6">
      {/* Header Futuriste - Mobile/Desktop */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 rounded-2xl sm:rounded-3xl blur-xl"></div>
        <div className="relative bg-black/20 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl blur opacity-60 animate-pulse"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <Package className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent mb-2 sm:mb-4">
            <span className="sm:hidden">Inventaire</span>
            <span className="hidden sm:inline">Gestionnaire d'Inventaire</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm sm:text-base">
            <span className="sm:hidden">Interface quantique de gestion d'articles</span>
            <span className="hidden sm:inline">Contrôlez votre stock avec une interface quantique avancée et des outils de gestion intelligents</span>
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full animate-ping"></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      {/* Interface Principale */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-700"></div>
        <Card className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden">
          <CardContent className="p-4 sm:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent)]"></div>
            <div className="relative z-10 space-y-4 sm:space-y-8">

              {/* En-tête avec bouton d'ajout - Mobile/Desktop */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white/90">
                    <span className="sm:hidden">Base quantique</span>
                    <span className="hidden sm:inline">Base de données quantique</span>
                  </h2>
                </div>
                <div className="relative group/add w-full sm:w-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl blur opacity-60 group-hover/add:opacity-80 transition-all duration-500"></div>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    className="relative w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/20 backdrop-blur-xl font-medium transition-all duration-500 group-hover/add:scale-105 text-sm sm:text-base"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    <span className="sm:hidden">Ajouter</span>
                    <span className="hidden sm:inline">Ajouter un article</span>
                  </Button>
                </div>
              </div>

              {/* Panneau de contrôle quantique - Mobile/Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-white/80 text-sm sm:text-base">
                    <span className="sm:hidden">Recherche</span>
                    <span className="hidden sm:inline">Scanner d'articles</span>
                  </Label>
                  <div className="relative group/search">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg sm:rounded-xl blur"></div>
                    <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-lg sm:rounded-xl">
                      <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-3 sm:top-4 text-cyan-400" />
                      <Input
                        placeholder="Rechercher dans la base..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-transparent border-0 text-white placeholder:text-white/40 h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Marques</Label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl blur"></div>
                    <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
                      <Select value={brandFilter} onValueChange={setBrandFilter}>
                        <SelectTrigger className="bg-transparent border-0 text-white h-12">
                          <SelectValue placeholder="Toutes les marques" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les marques</SelectItem>
                          <SelectItem value="zara">Zara</SelectItem>
                          <SelectItem value="hm">H&M</SelectItem>
                          <SelectItem value="nike">Nike</SelectItem>
                          <SelectItem value="adidas">Adidas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white/80">Statut</Label>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-xl blur"></div>
                    <div className="relative bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-xl">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="bg-transparent border-0 text-white h-12">
                          <SelectValue placeholder="Tous les statuts" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous les statuts</SelectItem>
                          <SelectItem value="vendu">Vendu</SelectItem>
                          <SelectItem value="non-vendu">Non vendu</SelectItem>
                          <SelectItem value="en-attente">En attente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Holographic Data Grid */}
              <div className="mt-8 space-y-4">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
                
                <h3 className="text-xl font-bold text-white/90 flex items-center">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse mr-3"></div>
                  Articles en base ({filteredArticles.length})
                </h3>

                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-600/10 rounded-2xl blur"></div>
                  <div className="relative bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10 bg-black/20">
                            <th className="text-left py-4 px-6 font-medium text-amber-400">Image</th>
                            <th className="text-left py-4 px-6 font-medium text-amber-400">Article</th>
                            <th className="text-left py-4 px-6 font-medium text-amber-400">Marque</th>
                            <th className="text-left py-4 px-6 font-medium text-amber-400">Taille</th>
                            <th className="text-left py-4 px-6 font-medium text-amber-400">Prix</th>
                            <th className="text-left py-4 px-6 font-medium text-amber-400">Statut</th>
                            <th className="text-left py-4 px-6 font-medium text-amber-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredArticles.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="py-12 text-center text-white/60">
                                <div className="flex flex-col items-center space-y-4">
                                  <div className="w-16 h-16 border-2 border-amber-500/30 rounded-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-amber-400/50" />
                                  </div>
                                  <div>
                                    {articles.length === 0 ? 
                                      "Base de données vide. Initialisez votre premier article !" : 
                                      "Aucun article ne correspond aux paramètres quantiques."}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            filteredArticles.map((article) => (
                              <ArticleCard
                                key={article.id}
                                article={article}
                                onEdit={handleEditArticle}
                                onDelete={handleDeleteArticle}
                                onGenerateDescription={handleGenerateDescription}
                                onMarkAsSold={handleMarkAsSold}
                              />
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pagination quantique */}
              {filteredArticles.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-white/60">
                    <span className="text-amber-400 font-medium">{filteredArticles.length}</span> articles détectés sur{" "}
                    <span className="text-amber-400 font-medium">{articles.length}</span> total
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" disabled className="bg-black/40 border-white/20 text-white/60">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="bg-amber-500/80 border-amber-500 text-white">
                      1
                    </Button>
                    <Button variant="outline" size="sm" disabled className="bg-black/40 border-white/20 text-white/60">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bouton d'action flottant futuriste */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="relative group/fab">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full blur-xl opacity-60 group-hover/fab:opacity-80 transition-all duration-500"></div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="relative bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white p-6 rounded-full border border-white/20 backdrop-blur-xl transition-all duration-500 group-hover/fab:scale-110"
          >
            <Plus className="w-8 h-8" />
          </Button>
        </div>
      </div>

      {/* Modal d'ajout d'article */}
      <AddArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateArticle}
      />
    </div>
  );
}
