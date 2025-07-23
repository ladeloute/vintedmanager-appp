import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const articleSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  brand: z.string().min(1, "La marque est requise"),
  size: z.string().min(1, "La taille est requise"),
  price: z.string().min(1, "Le prix est requis"),
  comment: z.string().optional(),
  status: z.enum(["vendu", "non-vendu", "en-attente"]).default("non-vendu"),
});

type ArticleForm = z.infer<typeof articleSchema>;

interface AddArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ArticleForm, image?: File) => Promise<void>;
}

export default function AddArticleModal({ isOpen, onClose, onSubmit }: AddArticleModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      name: "",
      brand: "",
      size: "",
      price: "",
      comment: "",
      status: "non-vendu",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = async (data: ArticleForm) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data, selectedImage || undefined);
      form.reset();
      setSelectedImage(null);
      onClose();
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl sm:max-w-4xl max-w-[95vw] max-h-[90vh] bg-transparent border-0 p-0 mx-2 sm:mx-auto overflow-hidden">
        <div className="relative">
          {/* Effets de fond futuristes */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-600/10 to-pink-500/10 rounded-2xl sm:rounded-3xl blur-xl"></div>
          
          {/* Conteneur principal */}
          <div className="relative bg-black/60 backdrop-blur-2xl border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(14,165,233,0.1),transparent)] opacity-50"></div>
            
            {/* Header holographique - Mobile/Desktop */}
            <div className="relative p-4 sm:p-8 bg-gradient-to-r from-black/80 via-gray-900/60 to-black/80 border-b border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.1),transparent)]"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl sm:rounded-2xl blur opacity-60 animate-pulse"></div>
                    <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl p-2 sm:p-3">
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <DialogTitle className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      <span className="sm:hidden">IA Quantique</span>
                      <span className="hidden sm:inline">Module de Création Quantique</span>
                    </DialogTitle>
                    <DialogDescription className="text-white/60 mt-1 text-xs sm:text-base">
                      <span className="sm:hidden">IA intégrée</span>
                      <span className="hidden sm:inline">Synthèse avancée d'articles avec IA intégrée</span>
                    </DialogDescription>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/10 rounded-lg sm:rounded-xl p-2"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </Button>
              </div>
            </div>

            <div className="relative z-10 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={form.handleSubmit(handleSubmit)} className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                
                {/* Section Image */}
                <div className="space-y-3 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-white/80 text-sm sm:text-lg font-medium">Image du produit</Label>
                    <div className="relative group/upload">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-lg sm:rounded-2xl blur group-hover/upload:blur-none transition-all duration-500"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-lg sm:rounded-2xl p-3 sm:p-8">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center space-y-4 text-center"
                        >
                          {selectedImage ? (
                            <div className="space-y-3">
                              <img
                                src={URL.createObjectURL(selectedImage)}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-xl border border-white/20"
                              />
                              <p className="text-emerald-400 text-sm">{selectedImage.name}</p>
                            </div>
                          ) : (
                            <div className="space-y-3 sm:space-y-4">
                              <div className="w-12 h-12 sm:w-16 sm:h-16 border-2 border-emerald-500/30 border-dashed rounded-lg sm:rounded-xl flex items-center justify-center mx-auto">
                                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                              </div>
                              <div className="text-center">
                                <p className="text-white/80 font-medium text-sm sm:text-base">
                                  <span className="sm:hidden">Scanner image</span>
                                  <span className="hidden sm:inline">Cliquez pour scanner une image</span>
                                </p>
                                <p className="text-white/40 text-xs sm:text-sm">PNG, JPG jusqu'à 10MB</p>
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section Détails */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-3 sm:space-y-4">
                    <Label htmlFor="name" className="text-white/80 text-sm sm:text-lg font-medium">Nom de l'article</Label>
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl blur"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl">
                        <Input
                          id="name"
                          placeholder="Ex: T-shirt Nike Sport..."
                          {...form.register("name")}
                          className="bg-transparent border-0 text-white placeholder:text-white/40 h-12"
                        />
                      </div>
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-red-400 text-sm">{form.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="brand" className="text-white/80 text-sm sm:text-base">Marque</Label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl blur"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
                          <Input
                            id="brand"
                            placeholder="Nike, Zara..."
                            {...form.register("brand")}
                            className="bg-transparent border-0 text-white placeholder:text-white/40 h-12"
                          />
                        </div>
                      </div>
                      {form.formState.errors.brand && (
                        <p className="text-red-400 text-sm">{form.formState.errors.brand.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="size" className="text-white/80 text-sm sm:text-base">Taille</Label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-yellow-600/20 rounded-xl blur"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-xl">
                          <Input
                            id="size"
                            placeholder="S, M, L, XL..."
                            {...form.register("size")}
                            className="bg-transparent border-0 text-white placeholder:text-white/40 h-12"
                          />
                        </div>
                      </div>
                      {form.formState.errors.size && (
                        <p className="text-red-400 text-sm">{form.formState.errors.size.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="price" className="text-white/80 text-sm sm:text-base">Prix (€)</Label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl blur"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-xl">
                          <Input
                            id="price"
                            type="number"
                            placeholder="25"
                            {...form.register("price")}
                            className="bg-transparent border-0 text-white placeholder:text-white/40 h-12"
                          />
                        </div>
                      </div>
                      {form.formState.errors.price && (
                        <p className="text-red-400 text-sm">{form.formState.errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-4">
                      <Label htmlFor="status" className="text-white/80 text-sm sm:text-base">Statut</Label>
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 rounded-xl blur"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-indigo-500/30 rounded-xl">
                          <Select onValueChange={(value) => form.setValue("status", value as any)}>
                            <SelectTrigger className="bg-transparent border-0 text-white h-12">
                              <SelectValue placeholder="Non vendu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="non-vendu">Non vendu</SelectItem>
                              <SelectItem value="en-attente">En attente</SelectItem>
                              <SelectItem value="vendu">Vendu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-4">
                    <Label htmlFor="comment" className="text-white/80 text-sm sm:text-base">Commentaires</Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-600/20 rounded-xl blur"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-rose-500/30 rounded-xl">
                        <Textarea
                          id="comment"
                          placeholder="Défauts, particularités..."
                          {...form.register("comment")}
                          className="bg-transparent border-0 text-white placeholder:text-white/40 min-h-24"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Boutons d'action futuristes - Mobile/Desktop */}
              <div className="flex flex-col items-center space-y-3 sm:space-y-4 lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-6 pt-4 sm:pt-6 border-t border-white/10">
                <div className="flex items-center space-x-2 sm:space-x-3 text-white/60 text-xs sm:text-sm order-2 lg:order-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="hidden sm:inline">Interface quantique synchronisée</span>
                  <span className="sm:hidden">Synchronisé</span>
                </div>
                
                <div className="flex space-x-3 sm:space-x-4 order-1 lg:order-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="bg-black/40 border-white/20 text-white/80 hover:bg-white/10 px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  >
                    Annuler
                  </Button>
                  
                  <div className="relative group/submit">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-lg sm:rounded-xl blur opacity-60 group-hover/submit:opacity-80 transition-all duration-500"></div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="relative bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-4 sm:px-12 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-white/20 backdrop-blur-xl font-medium transition-all duration-500 group-hover/submit:scale-105 text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs sm:text-base">Création...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="text-xs sm:text-base">Créer l'article</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}