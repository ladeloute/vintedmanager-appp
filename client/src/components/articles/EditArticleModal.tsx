import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, X, Upload, Image as ImageIcon, Sparkles, Save, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { updateArticleWithImage, type Article } from "@/lib/api";

const editArticleSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  brand: z.string().min(1, "La marque est requise"),
  size: z.string().min(1, "La taille est requise"),
  price: z.string().min(1, "Le prix est requis"),
  purchasePrice: z.string().min(1, "Le prix d'achat est requis"),
  status: z.enum(["non-vendu", "vendu", "en-attente"]),
  comment: z.string().optional(),
});

type EditArticleForm = z.infer<typeof editArticleSchema>;

interface EditArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditArticleModal({ article, isOpen, onClose }: EditArticleModalProps) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<EditArticleForm>({
    resolver: zodResolver(editArticleSchema),
    defaultValues: {
      name: "",
      brand: "",
      size: "",
      price: "",
      purchasePrice: "",
      status: "non-vendu",
      comment: "",
    },
  });

  // Reset form when article changes
  useEffect(() => {
    if (article) {
      form.reset({
        name: article.name,
        brand: article.brand,
        size: article.size,
        price: article.price.toString(),
        purchasePrice: article.purchasePrice?.toString() || "0",
        status: article.status,
        comment: article.comment || "",
      });
      setPreviewUrl(article.imageUrl || null);
      setSelectedImage(null);
    }
  }, [article, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: EditArticleForm) => {
      if (!article) throw new Error("Article non trouvé");

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("brand", data.brand);
      formData.append("size", data.size);
      formData.append("price", data.price);
      formData.append("purchasePrice", data.purchasePrice);
      formData.append("status", data.status);
      formData.append("comment", data.comment || "");

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      return updateArticleWithImage(article.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard-stats"] });
      toast({
        title: "✨ Article mis à jour",
        description: "Les modifications ont été sauvegardées avec succès",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "❌ Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsImageDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleImageChange(file);
      }
    }
  };

  const resetForm = () => {
    if (article) {
      form.reset({
        name: article.name,
        brand: article.brand,
        size: article.size,
        price: article.price.toString(),
        purchasePrice: article.purchasePrice?.toString() || "0",
        status: article.status,
        comment: article.comment || "",
      });
      setPreviewUrl(article.imageUrl || null);
      setSelectedImage(null);
    }
  };

  const onSubmit = (data: EditArticleForm) => {
    updateMutation.mutate(data);
  };

  if (!article) return null;

  const isSubmitting = updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden bg-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl">
        {/* Header Premium */}
        <DialogHeader className="relative p-8 pb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 rounded-t-3xl"></div>
          <div className="relative flex items-center justify-between">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent flex items-center">
              <div className="relative mr-4">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-60 animate-pulse"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-3">
                  <Edit className="w-8 h-8 text-purple-400" />
                </div>
              </div>
              <span className="hidden sm:inline">Modification d'Article</span>
              <span className="sm:hidden">Modifier</span>
            </DialogTitle>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-8 pb-8">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Zone d'image premium avec drag & drop */}
            <div className="space-y-4">
              <Label className="text-white/90 text-lg font-medium flex items-center">
                <ImageIcon className="w-5 h-5 mr-2 text-purple-400" />
                Image de l'article
              </Label>
              
              {previewUrl && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
                  <div className="relative bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-4 group-hover:scale-[1.02] transition-all duration-500">
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="w-full h-64 object-cover rounded-xl shadow-2xl"
                    />
                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-xl border border-white/20 rounded-xl px-3 py-1">
                      <span className="text-xs text-white/80 font-medium">Aperçu</span>
                    </div>
                  </div>
                </div>
              )}

              <div 
                className={`relative transition-all duration-500 ${isImageDragOver ? 'scale-105' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${isImageDragOver ? 'from-cyan-500/30 to-purple-600/30' : 'from-purple-500/20 to-cyan-600/20'} rounded-2xl blur-xl transition-all duration-500`}></div>
                <div className={`relative bg-black/30 backdrop-blur-xl border-2 ${isImageDragOver ? 'border-cyan-400/60 border-solid' : 'border-white/20 border-dashed'} rounded-2xl p-8 transition-all duration-500`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center space-y-4 cursor-pointer group/upload"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur opacity-60 group-hover/upload:opacity-80 transition-all duration-300"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4 group-hover/upload:scale-110 transition-all duration-300">
                        <Upload className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                    <div className="text-center">
                      <span className="text-white/80 text-lg font-medium block mb-2">
                        {selectedImage ? "Changer l'image" : "Nouvelle image (optionnel)"}
                      </span>
                      <span className="text-white/50 text-sm">
                        Glissez-déposez ou cliquez pour sélectionner
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Champs du formulaire avec mise en page premium */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-6">
                {/* Nom de l'article */}
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-white/90 text-base font-medium">Nom de l'article</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-cyan-500/30 rounded-xl group-hover:border-cyan-400/50 transition-all duration-300">
                      <Input
                        id="name"
                        {...form.register("name")}
                        className="bg-transparent border-0 text-white placeholder:text-white/40 h-12 text-base"
                        placeholder="Ex: T-shirt vintage Nike..."
                      />
                    </div>
                  </div>
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                {/* Marque */}
                <div className="space-y-3">
                  <Label htmlFor="brand" className="text-white/90 text-base font-medium">Marque</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-purple-500/30 rounded-xl group-hover:border-purple-400/50 transition-all duration-300">
                      <Input
                        id="brand"
                        {...form.register("brand")}
                        className="bg-transparent border-0 text-white placeholder:text-white/40 h-12 text-base"
                        placeholder="Zara, H&M, Nike..."
                      />
                    </div>
                  </div>
                  {form.formState.errors.brand && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {form.formState.errors.brand.message}
                    </p>
                  )}
                </div>

                {/* Taille */}
                <div className="space-y-3">
                  <Label htmlFor="size" className="text-white/90 text-base font-medium">Taille</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-green-500/30 rounded-xl group-hover:border-green-400/50 transition-all duration-300">
                      <Select value={form.watch("size")} onValueChange={(value) => form.setValue("size", value)}>
                        <SelectTrigger className="bg-transparent border-0 text-white h-12">
                          <SelectValue placeholder="Sélectionner une taille" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-xl border border-white/20">
                          {["XS", "S", "M", "L", "XL", "XXL", "34", "36", "38", "40", "42", "44", "46"].map(size => (
                            <SelectItem key={size} value={size} className="text-white hover:bg-white/10">
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {form.formState.errors.size && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {form.formState.errors.size.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-6">
                {/* Prix de vente */}
                <div className="space-y-3">
                  <Label htmlFor="price" className="text-white/90 text-base font-medium">Prix de vente (€)</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-amber-500/30 rounded-xl group-hover:border-amber-400/50 transition-all duration-300">
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        {...form.register("price")}
                        className="bg-transparent border-0 text-white placeholder:text-white/40 h-12 text-base"
                        placeholder="25.00"
                      />
                    </div>
                  </div>
                  {form.formState.errors.price && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {form.formState.errors.price.message}
                    </p>
                  )}
                </div>

                {/* Prix d'achat */}
                <div className="space-y-3">
                  <Label htmlFor="purchasePrice" className="text-white/90 text-base font-medium">Prix d'achat (€)</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-red-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-rose-500/30 rounded-xl group-hover:border-rose-400/50 transition-all duration-300">
                      <Input
                        id="purchasePrice"
                        type="number"
                        step="0.01"
                        {...form.register("purchasePrice")}
                        className="bg-transparent border-0 text-white placeholder:text-white/40 h-12 text-base"
                        placeholder="10.00"
                      />
                    </div>
                  </div>
                  {form.formState.errors.purchasePrice && (
                    <p className="text-sm text-red-400 flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {form.formState.errors.purchasePrice.message}
                    </p>
                  )}
                </div>

                {/* Statut */}
                <div className="space-y-3">
                  <Label htmlFor="status" className="text-white/90 text-base font-medium">Statut</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    <div className="relative bg-black/30 backdrop-blur-xl border border-indigo-500/30 rounded-xl group-hover:border-indigo-400/50 transition-all duration-300">
                      <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as any)}>
                        <SelectTrigger className="bg-transparent border-0 text-white h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 backdrop-blur-xl border border-white/20">
                          <SelectItem value="non-vendu" className="text-white hover:bg-white/10">Non vendu</SelectItem>
                          <SelectItem value="en-attente" className="text-white hover:bg-white/10">En attente</SelectItem>
                          <SelectItem value="vendu" className="text-white hover:bg-white/10">Vendu</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Commentaires sur toute la largeur */}
            <div className="space-y-3">
              <Label htmlFor="comment" className="text-white/90 text-base font-medium">Commentaires</Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <div className="relative bg-black/30 backdrop-blur-xl border border-teal-500/30 rounded-xl group-hover:border-teal-400/50 transition-all duration-300">
                  <Textarea
                    id="comment"
                    {...form.register("comment")}
                    className="bg-transparent border-0 text-white placeholder:text-white/40 min-h-24 resize-none"
                    placeholder="Informations supplémentaires, défauts, particularités..."
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action premium */}
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-6 pt-6 border-t border-white/10">
              <div className="flex items-center space-x-2 text-white/60 text-sm order-2 sm:order-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline">Interface premium synchronisée</span>
                <span className="sm:hidden">Synchronisé</span>
              </div>
              
              <div className="flex space-x-4 order-1 sm:order-2">
                {/* Bouton Reset */}
                <div className="relative group/reset">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl blur opacity-60 group-hover/reset:opacity-80 transition-all duration-500"></div>
                  <Button
                    type="button"
                    onClick={resetForm}
                    className="relative bg-black/40 border-white/20 text-white/80 hover:bg-white/10 px-6 py-3 rounded-xl border backdrop-blur-xl font-medium transition-all duration-500 group-hover/reset:scale-105"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Réinitialiser</span>
                    <span className="sm:hidden">Reset</span>
                  </Button>
                </div>

                {/* Bouton Annuler */}
                <div className="relative group/cancel">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl blur opacity-60 group-hover/cancel:opacity-80 transition-all duration-500"></div>
                  <Button
                    type="button"
                    onClick={onClose}
                    className="relative bg-black/40 border-red-500/20 text-red-400/80 hover:bg-red-500/10 px-6 py-3 rounded-xl border backdrop-blur-xl font-medium transition-all duration-500 group-hover/cancel:scale-105"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Annuler
                  </Button>
                </div>
                
                {/* Bouton Sauvegarder */}
                <div className="relative group/save">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500 rounded-xl blur opacity-60 group-hover/save:opacity-80 transition-all duration-500"></div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative bg-gradient-to-r from-purple-600 via-cyan-600 to-pink-600 hover:from-purple-500 hover:via-cyan-500 hover:to-pink-500 text-white px-8 py-3 rounded-xl border border-white/20 backdrop-blur-xl font-medium transition-all duration-500 group-hover/save:scale-105 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Sauvegarde...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Sauvegarder</span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}