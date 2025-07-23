import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Upload, Copy, RefreshCw, Heading, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { generateDescription, type GeneratedContent } from "@/lib/api";

const generatorSchema = z.object({
  price: z.string().min(1, "Le prix est requis"),
  size: z.string().min(1, "La taille est requise"),
  brand: z.string().min(1, "La marque est requise"),
  comment: z.string().optional(),
});

type GeneratorForm = z.infer<typeof generatorSchema>;

export default function AIGenerator() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { toast } = useToast();

  const form = useForm<GeneratorForm>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      price: "",
      size: "",
      brand: "",
      comment: "",
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (data: GeneratorForm) => {
      if (!selectedImage) {
        throw new Error("Veuillez sélectionner une image");
      }

      const formData = new FormData();
      formData.append("image", selectedImage);
      formData.append("price", data.price);
      formData.append("size", data.size);
      formData.append("brand", data.brand);
      if (data.comment) {
        formData.append("comment", data.comment);
      }

      return generateDescription(formData);
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      toast({
        title: "Description générée avec succès",
        description: "Votre description Vinted est prête !",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (data: GeneratorForm) => {
    generateMutation.mutate(data);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `${type} copié`,
        description: "Le contenu a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le contenu",
        variant: "destructive",
      });
    }
  };

  const regenerate = () => {
    const formData = form.getValues();
    if (formData.price && formData.size && formData.brand && selectedImage) {
      generateMutation.mutate(formData);
    }
  };

  return (
    <Card className="shadow-material-1 max-w-4xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-medium mb-6 flex items-center">
          <Sparkles className="w-6 h-6 mr-3 text-accent" />
          Générateur de descriptions Vinted avec IA
        </h2>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <Label htmlFor="image">Photo de l'article *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="image" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-text-secondary">
                  Cliquez pour sélectionner une image ou glissez-déposez
                </p>
                <p className="text-sm text-text-secondary mt-1">PNG, JPG jusqu'à 10MB</p>
              </label>
            </div>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="rounded-lg shadow-material-1 max-w-xs max-h-64 object-cover"
                />
              </div>
            )}
          </div>

          {/* Manual Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="price">Prix (€) *</Label>
              <div className="relative">
                <Input
                  id="price"
                  type="number"
                  placeholder="ex: 25"
                  {...form.register("price")}
                />
                <span className="absolute right-3 top-3 text-text-secondary">€</span>
              </div>
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="size">Taille *</Label>
              <Select onValueChange={(value) => form.setValue("size", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une taille" />
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
              <Label htmlFor="brand">Marque *</Label>
              <Input
                id="brand"
                placeholder="ex: Zara, H&M, Nike..."
                {...form.register("brand")}
              />
              {form.formState.errors.brand && (
                <p className="text-sm text-destructive">{form.formState.errors.brand.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="comment">Commentaire (optionnel)</Label>
              <Input
                id="comment"
                placeholder="ex: petite tache sous la manche"
                {...form.register("comment")}
              />
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center">
            <Button
              type="submit"
              disabled={generateMutation.isPending}
              className="bg-accent hover:bg-orange-600 text-white px-8 py-3 shadow-material-1 transform hover:scale-105 transition-all"
            >
              {generateMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Générer avec Gemini IA
                </>
              )}
            </Button>
          </div>
        </form>

        {/* AI Generated Results */}
        {generatedContent && (
          <div className="mt-8 space-y-6 border-t pt-6">
            {/* Generated Heading */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center">
                  <Heading className="w-4 h-4 mr-2 text-primary" />
                  Titre généré
                </h3>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedContent.title, "Titre")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={regenerate}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-surface p-3 rounded border">
                {generatedContent.title}
              </div>
            </div>

            {/* Generated Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-primary" />
                  Description complète
                </h3>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => copyToClipboard(generatedContent.description, "Description")}
                    className="bg-primary hover:bg-blue-600"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                  <Button
                    onClick={regenerate}
                    className="bg-accent hover:bg-orange-600"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Régénérer
                  </Button>
                </div>
              </div>
              <div className="bg-surface p-4 rounded border min-h-32 whitespace-pre-wrap">
                {generatedContent.description}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
