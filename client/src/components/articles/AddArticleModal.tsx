import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Ajouter un nouvel article
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom de l'article *</Label>
              <Input
                id="name"
                placeholder="ex: T-shirt Nike..."
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="brand">Marque *</Label>
              <Input
                id="brand"
                placeholder="ex: Nike, Zara..."
                {...form.register("brand")}
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-destructive">{form.formState.errors.brand.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="size">Taille *</Label>
              <Select onValueChange={(value) => form.setValue("size", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.size && (
                <p className="text-sm text-destructive">{form.formState.errors.size.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="25"
                {...form.register("price")}
              />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              placeholder="ex: petite tache sous la manche..."
              {...form.register("comment")}
            />
          </div>

          <div>
            <Label htmlFor="image">Photo de l'article</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-text-secondary">
                  {selectedImage ? selectedImage.name : "Cliquez pour sélectionner une image"}
                </p>
              </label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-secondary hover:bg-green-600">
              {isSubmitting ? "Ajout..." : "Ajouter l'article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
