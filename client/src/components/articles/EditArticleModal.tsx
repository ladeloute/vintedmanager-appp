import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, X, Upload, Image as ImageIcon } from "lucide-react";
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
        purchasePrice: article.purchasePrice.toString(),
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
        title: "Article mis à jour",
        description: "Les modifications ont été sauvegardées avec succès",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la mise à jour",
        variant: "destructive",
      });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: EditArticleForm) => {
    updateMutation.mutate(data);
  };

  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-black/90 backdrop-blur-xl border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center">
            <Edit className="w-6 h-6 mr-2 text-cyan-400" />
            Modifier l'article
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-white/80">Image de l'article</Label>
            
            {previewUrl && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-600/20 rounded-xl blur"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center space-x-2 cursor-pointer p-4 border-2 border-dashed border-white/20 rounded-lg hover:border-white/40 transition-colors"
                >
                  <Upload className="w-5 h-5 text-white/60" />
                  <span className="text-white/60">
                    {selectedImage ? "Changer l'image" : "Nouvelle image (optionnel)"}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white/80">Nom de l'article</Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-xl blur"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-xl">
                  <Input
                    id="name"
                    {...form.register("name")}
                    className="bg-transparent border-0 text-white placeholder:text-white/40"
                    placeholder="Ex: T-shirt vintage..."
                  />
                </div>
              </div>
              {form.formState.errors.name && (
                <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand" className="text-white/80">Marque</Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl blur"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
                  <Input
                    id="brand"
                    {...form.register("brand")}
                    className="bg-transparent border-0 text-white placeholder:text-white/40"
                    placeholder="Zara, H&M, Nike..."
                  />
                </div>
              </div>
              {form.formState.errors.brand && (
                <p className="text-sm text-red-400">{form.formState.errors.brand.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-white/80">Taille</Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-600/20 rounded-xl blur"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-xl">
                  <Select value={form.watch("size")} onValueChange={(value) => form.setValue("size", value)}>
                    <SelectTrigger className="bg-transparent border-0 text-white">
                      <SelectValue placeholder="Sélectionner une taille" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XS">XS</SelectItem>
                      <SelectItem value="S">S</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                      <SelectItem value="L">L</SelectItem>
                      <SelectItem value="XL">XL</SelectItem>
                      <SelectItem value="XXL">XXL</SelectItem>
                      <SelectItem value="36">36</SelectItem>
                      <SelectItem value="38">38</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="42">42</SelectItem>
                      <SelectItem value="44">44</SelectItem>
                      <SelectItem value="46">46</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {form.formState.errors.size && (
                <p className="text-sm text-red-400">{form.formState.errors.size.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-white/80">Prix de vente (€)</Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-600/20 rounded-xl blur"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-xl">
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...form.register("price")}
                    className="bg-transparent border-0 text-white placeholder:text-white/40"
                    placeholder="15.00"
                  />
                </div>
              </div>
              {form.formState.errors.price && (
                <p className="text-sm text-red-400">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice" className="text-white/80">Prix d'achat (€)</Label>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-xl blur"></div>
                <div className="relative bg-black/40 backdrop-blur-xl border border-amber-500/30 rounded-xl">
                  <Input
                    id="purchasePrice"
                    type="number"
                    step="0.01"
                    {...form.register("purchasePrice")}
                    className="bg-transparent border-0 text-white placeholder:text-white/40"
                    placeholder="10.00"
                  />
                </div>
              </div>
              {form.formState.errors.purchasePrice && (
                <p className="text-sm text-red-400">{form.formState.errors.purchasePrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-white/80">Statut</Label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-600/20 rounded-xl blur"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-indigo-500/30 rounded-xl">
                <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as any)}>
                  <SelectTrigger className="bg-transparent border-0 text-white">
                    <SelectValue />
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

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-white/80">Commentaires</Label>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-xl blur"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-amber-500/30 rounded-xl">
                <Textarea
                  id="comment"
                  {...form.register("comment")}
                  className="bg-transparent border-0 text-white placeholder:text-white/40"
                  placeholder="Notes, défauts, particularités..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
            >
              Annuler
            </Button>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl blur opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="relative bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border border-white/20 backdrop-blur-xl"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sauvegarde...
                  </>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}