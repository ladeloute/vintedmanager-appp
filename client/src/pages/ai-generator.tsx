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
    <div className="space-y-8 p-6">
      {/* Header Futuriste */}
      <div className="text-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
        <div className="relative bg-black/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-60 animate-pulse"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-4">
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Générateur IA Quantique
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Transformez vos photos en descriptions hypnotiques grâce à l'intelligence artificielle avancée
          </p>
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>

      {/* Interface Principale */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-700"></div>
        <Card className="relative bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]"></div>
            <div className="relative z-10">

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Zone de téléchargement futuriste */}
              <div className="space-y-4">
                <Label htmlFor="image" className="text-white/80 text-lg font-medium">Scanner quantique d'image</Label>
                <div className="relative group/upload">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur group-hover/upload:blur-none transition-all duration-500"></div>
                  <div className="relative border-2 border-dashed border-cyan-500/30 rounded-2xl p-12 text-center hover:border-cyan-400/60 transition-all duration-500 bg-black/20 backdrop-blur-xl">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="image" className="cursor-pointer">
                      <div className="relative mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur opacity-40"></div>
                        <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4 mx-auto w-fit">
                          <Upload className="w-12 h-12 text-cyan-400" />
                        </div>
                      </div>
                      <p className="text-white/80 text-lg mb-2">
                        Déposez votre image dans la matrice quantique
                      </p>
                      <p className="text-white/60 text-sm">PNG, JPG jusqu'à 10MB • Résolution optimale</p>
                    </label>
                  </div>
                </div>

                {/* Aperçu holographique */}
                {previewUrl && (
                  <div className="mt-6 flex justify-center">
                    <div className="relative group/preview">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-purple-600/40 rounded-2xl blur"></div>
                      <div className="relative bg-black/20 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="rounded-xl max-w-xs max-h-64 object-cover group-hover/preview:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-green-500/80 backdrop-blur-sm rounded-full px-2 py-1">
                          <span className="text-xs text-white font-mono">ANALYSÉ</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Panneau de contrôle quantique */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-white/90 mb-6 flex items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse mr-3"></div>
                  Paramètres de l'IA
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-white/80">Prix quantique (€)</Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-xl blur"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-emerald-500/30 rounded-xl">
                        <Input
                          id="price"
                          type="number"
                          placeholder="25"
                          {...form.register("price")}
                          className="bg-transparent border-0 text-white placeholder:text-white/40"
                        />
                        <span className="absolute right-3 top-3 text-emerald-400 font-mono">€</span>
                      </div>
                    </div>
                    {form.formState.errors.price && (
                      <p className="text-sm text-red-400">{form.formState.errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-white/80">Dimension</Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 rounded-xl blur"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-blue-500/30 rounded-xl">
                        <Select onValueChange={(value) => form.setValue("size", value)}>
                          <SelectTrigger className="bg-transparent border-0 text-white">
                            <SelectValue placeholder="Scanner la taille" />
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
                      </div>
                    </div>
                    {form.formState.errors.size && (
                      <p className="text-sm text-red-400">{form.formState.errors.size.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-white/80">Marque quantique</Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-xl blur"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
                        <Input
                          id="brand"
                          placeholder="Zara, H&M, Nike..."
                          {...form.register("brand")}
                          className="bg-transparent border-0 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                    {form.formState.errors.brand && (
                      <p className="text-sm text-red-400">{form.formState.errors.brand.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comment" className="text-white/80">Notes spéciales</Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-600/20 rounded-xl blur"></div>
                      <div className="relative bg-black/40 backdrop-blur-xl border border-amber-500/30 rounded-xl">
                        <Input
                          id="comment"
                          placeholder="Défauts, particularités..."
                          {...form.register("comment")}
                          className="bg-transparent border-0 text-white placeholder:text-white/40"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton de lancement quantique */}
              <div className="text-center mt-12">
                <div className="relative group/button">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-60 group-hover/button:opacity-80 transition-all duration-500"></div>
                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="relative bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-6 sm:px-12 py-3 sm:py-6 rounded-xl sm:rounded-2xl border border-white/20 backdrop-blur-xl font-bold text-sm sm:text-lg transition-all duration-500 group-hover/button:scale-105"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="w-4 h-4 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-xs sm:text-base">Analyse quantique...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Sparkles className="w-4 h-4 sm:w-6 sm:h-6" />
                          <span className="text-xs sm:text-base">
                            <span className="sm:hidden">LANCER L'IA</span>
                            <span className="hidden sm:inline">LANCER L'IA QUANTIQUE</span>
                          </span>
                        </div>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>

            {/* Résultats IA holographiques */}
            {generatedContent && (
              <div className="mt-12 space-y-8">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
                
                {/* Titre généré */}
                <div className="relative group/result">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl blur"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white/90 flex items-center">
                        <Heading className="w-6 h-6 mr-3 text-cyan-400" />
                        Titre quantique généré
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedContent.title, "Titre")}
                          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={regenerate}
                          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-white/90">
                      {generatedContent.title}
                    </div>
                  </div>
                </div>

                {/* Description générée */}
                <div className="relative group/result">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-2xl blur"></div>
                  <div className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white/90 flex items-center">
                        <FileText className="w-6 h-6 mr-3 text-purple-400" />
                        Description complète
                      </h3>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => copyToClipboard(generatedContent.description, "Description")}
                          className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border border-white/20"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copier
                        </Button>
                        <Button
                          onClick={regenerate}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border border-white/20"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Régénérer
                        </Button>
                      </div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 min-h-32 whitespace-pre-wrap text-white/90">
                      {generatedContent.description}
                    </div>
                  </div>
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
