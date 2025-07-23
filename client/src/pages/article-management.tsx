import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, ChevronLeft, ChevronRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import ArticleCard from "@/components/articles/ArticleCard";
import AddArticleModal from "@/components/articles/AddArticleModal";
import { createArticle, deleteArticle, type Article } from "@/lib/api";

export default function ArticleManagement() {
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
    // For now, just show a message
    toast({
      title: "Fonction en développement",
      description: "La modification d'article sera bientôt disponible",
    });
  };

  const handleGenerateDescription = (article: Article) => {
    toast({
      title: "Fonction en développement",
      description: "La génération de description depuis l'article sera bientôt disponible",
    });
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
    <>
      <Card className="shadow-material-1">
        <CardContent className="p-6">
          {/* Header with Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-medium flex items-center">
              <Package className="w-6 h-6 mr-3 text-primary" />
              Gestion des articles
            </h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-secondary hover:bg-green-600 text-white shadow-material-1"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel article
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
                <Input
                  placeholder="Rechercher par nom d'article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
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

            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
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

          {/* Articles Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-4 font-medium text-text-secondary">Image</th>
                  <th className="text-left py-4 px-4 font-medium text-text-secondary">Article</th>
                  <th className="text-left py-4 px-4 font-medium text-text-secondary">Marque</th>
                  <th className="text-left py-4 px-4 font-medium text-text-secondary">Taille</th>
                  <th className="text-left py-4 px-4 font-medium text-text-secondary">Prix</th>
                  <th className="text-left py-4 px-4 font-medium text-text-secondary">Statut</th>
                  <th className="text-left py-4 px-4 font-medium text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-secondary">
                      {articles.length === 0 ? "Aucun article trouvé. Commencez par en ajouter un !" : "Aucun article ne correspond à vos critères de recherche."}
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

          {/* Pagination */}
          {filteredArticles.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-text-secondary">
                Affichage de <span className="font-medium">1</span> à{" "}
                <span className="font-medium">{filteredArticles.length}</span> sur{" "}
                <span className="font-medium">{articles.length}</span> articles
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="bg-primary text-white">
                  1
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Floating Action Button */}
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 bg-accent hover:bg-orange-600 text-white p-4 rounded-full shadow-material-3 transform hover:scale-110 transition-all z-40"
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Article Modal */}
      <AddArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateArticle}
      />
    </>
  );
}
