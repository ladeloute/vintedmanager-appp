import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, ExternalLink, Import } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VintedImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportArticles: (articles: any[]) => void;
}

interface ManualArticle {
  name: string;
  brand: string;
  size: string;
  price: string;
  imageUrl: string;
}

export default function VintedImportModal({ isOpen, onClose, onImportArticles }: VintedImportModalProps) {
  const [articles, setArticles] = useState<ManualArticle[]>([
    { name: "", brand: "", size: "", price: "", imageUrl: "" }
  ]);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const addArticle = () => {
    setArticles([...articles, { name: "", brand: "", size: "", price: "", imageUrl: "" }]);
  };

  const removeArticle = (index: number) => {
    const newArticles = articles.filter((_, i) => i !== index);
    setArticles(newArticles.length === 0 ? [{ name: "", brand: "", size: "", price: "", imageUrl: "" }] : newArticles);
  };

  const updateArticle = (index: number, field: keyof ManualArticle, value: string) => {
    const newArticles = [...articles];
    newArticles[index][field] = value;
    setArticles(newArticles);
  };

  const handleImport = async () => {
    const validArticles = articles.filter(article => 
      article.name.trim() && article.price.trim()
    );

    if (validArticles.length === 0) {
      toast({
        title: "Aucun article valide",
        description: "Veuillez remplir au moins le nom et le prix pour chaque article",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    
    try {
      const articlesWithDefaults = validArticles.map(article => ({
        name: article.name.trim(),
        brand: article.brand.trim() || "À définir",
        size: article.size.trim() || "Taille unique",
        price: article.price.trim(),
        status: "non-vendu",
        comment: "Importé manuellement depuis Vinted",
        imageUrl: article.imageUrl.trim() || null
      }));

      await onImportArticles(articlesWithDefaults);
      
      toast({
        title: "Import réussi",
        description: `${articlesWithDefaults.length} articles importés avec succès`,
      });
      
      // Reset form
      setArticles([{ name: "", brand: "", size: "", price: "", imageUrl: "" }]);
      onClose();
      
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: error instanceof Error ? error.message : "Erreur lors de l'import",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent flex items-center">
            <Import className="w-6 h-6 mr-2 text-orange-400" />
            Import Manuel Vinted
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Copiez les informations depuis votre profil Vinted et ajoutez-les rapidement ici.
            <a 
              href="https://www.vinted.fr/member/270400658" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center ml-2 text-orange-400 hover:text-orange-300 transition-colors"
            >
              Ouvrir le profil Vinted <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {articles.map((article, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-xl blur opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
              
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-semibold text-white/90">Article {index + 1}</h4>
                  {articles.length > 1 && (
                    <Button
                      onClick={() => removeArticle(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      Supprimer
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`} className="text-white/90">
                      Nom de l'article *
                    </Label>
                    <Input
                      id={`name-${index}`}
                      value={article.name}
                      onChange={(e) => updateArticle(index, 'name', e.target.value)}
                      placeholder="Ex: T-shirt Nike vintage..."
                      className="bg-black/50 border-white/20 text-white placeholder-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`price-${index}`} className="text-white/90">
                      Prix (€) *
                    </Label>
                    <Input
                      id={`price-${index}`}
                      value={article.price}
                      onChange={(e) => updateArticle(index, 'price', e.target.value)}
                      placeholder="Ex: 15.00"
                      type="number"
                      step="0.01"
                      className="bg-black/50 border-white/20 text-white placeholder-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`brand-${index}`} className="text-white/90">
                      Marque
                    </Label>
                    <Input
                      id={`brand-${index}`}
                      value={article.brand}
                      onChange={(e) => updateArticle(index, 'brand', e.target.value)}
                      placeholder="Ex: Nike, Adidas..."
                      className="bg-black/50 border-white/20 text-white placeholder-white/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`size-${index}`} className="text-white/90">
                      Taille
                    </Label>
                    <Input
                      id={`size-${index}`}
                      value={article.size}
                      onChange={(e) => updateArticle(index, 'size', e.target.value)}
                      placeholder="Ex: M, L, 42..."
                      className="bg-black/50 border-white/20 text-white placeholder-white/50"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor={`imageUrl-${index}`} className="text-white/90">
                    URL de l'image (optionnel)
                  </Label>
                  <Input
                    id={`imageUrl-${index}`}
                    value={article.imageUrl}
                    onChange={(e) => updateArticle(index, 'imageUrl', e.target.value)}
                    placeholder="Collez l'URL de l'image depuis Vinted..."
                    className="bg-black/50 border-white/20 text-white placeholder-white/50"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <Button
              onClick={addArticle}
              variant="outline"
              className="bg-black/40 border-white/20 text-white hover:bg-white/10"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un autre article
            </Button>
          </div>
        </div>

        <DialogFooter className="space-x-4">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="bg-black/40 border-white/20 text-white hover:bg-white/10"
          >
            Annuler
          </Button>
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg blur opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="relative bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-medium disabled:opacity-50"
            >
              {isImporting ? "Import en cours..." : "Importer les articles"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}