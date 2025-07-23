import { Edit, Trash2, Sparkles, CheckCircle, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: number;
  name: string;
  brand: string;
  size: string;
  price: string;
  status: "vendu" | "non-vendu" | "en-attente";
  imageUrl?: string;
  comment?: string;
  generatedTitle?: string;
  generatedDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleCardProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (id: number) => void;
  onGenerateDescription: (article: Article) => void;
  onMarkAsSold: (id: number) => void;
}

export default function ArticleCard({ article, onEdit, onDelete, onGenerateDescription, onMarkAsSold }: ArticleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "vendu":
        return "bg-emerald-500/80 text-white border-emerald-500/30";
      case "en-attente":
        return "bg-amber-500/80 text-white border-amber-500/30";
      default:
        return "bg-blue-500/80 text-white border-blue-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vendu":
        return "Vendu";
      case "en-attente":
        return "En attente";
      default:
        return "Non vendu";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "vendu":
        return <CheckCircle className="w-4 h-4" />;
      case "en-attente":
        return <Clock className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <>
      {/* Desktop Table Row */}
      <tr className="hidden sm:table-row border-b border-white/10 hover:bg-white/5 transition-all duration-300 group">
        <td className="py-6 px-6">
          <div className="relative group/image">
            {article.imageUrl ? (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-xl blur opacity-0 group-hover/image:opacity-100 transition-all duration-300"></div>
                <img
                  src={article.imageUrl}
                  alt={article.name}
                  className="relative w-16 h-16 object-cover rounded-xl border border-white/20 backdrop-blur-xl"
                />
              </>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-slate-600/20 rounded-xl blur"></div>
                <div className="relative w-16 h-16 bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-white/40" />
                </div>
              </div>
          )}
        </div>
      </td>
      
      <td className="py-6 px-6">
        <div className="space-y-1">
          <p className="font-medium text-white/90 group-hover:text-cyan-400 transition-colors">{article.name}</p>
          <p className="text-sm text-white/50">
            Ajouté le {new Date(article.createdAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </td>
      
      <td className="py-6 px-6">
        <span className="text-white/80 font-medium">{article.brand}</span>
      </td>
      
      <td className="py-6 px-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg blur"></div>
          <span className="relative bg-black/40 backdrop-blur-xl border border-purple-500/30 text-purple-400 px-3 py-1 rounded-lg text-sm font-medium">
            {article.size}
          </span>
        </div>
      </td>
      
      <td className="py-6 px-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-lg blur"></div>
          <span className="relative bg-black/40 backdrop-blur-xl border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-lg font-bold">
            {article.price}€
          </span>
        </div>
      </td>
      
      <td className="py-6 px-6">
        <Badge className={`${getStatusColor(article.status)} backdrop-blur-sm flex items-center space-x-2 w-fit`}>
          {getStatusIcon(article.status)}
          <span>{getStatusLabel(article.status)}</span>
        </Badge>
      </td>
      
      <td className="py-6 px-6">
        <div className="flex items-center space-x-2">
          {/* Bouton Générer Description */}
          <div className="relative group/action">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-lg blur opacity-0 group-hover/action:opacity-100 transition-all duration-300"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onGenerateDescription(article)}
              className="relative bg-black/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 p-2"
              title="Générer description IA"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>

          {/* Bouton Marquer comme vendu */}
          {article.status !== "vendu" && (
            <div className="relative group/action">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-600/20 rounded-lg blur opacity-0 group-hover/action:opacity-100 transition-all duration-300"></div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMarkAsSold(article.id)}
                className="relative bg-black/40 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 p-2"
                title="Marquer comme vendu"
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Bouton Modifier */}
          <div className="relative group/action">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-lg blur opacity-0 group-hover/action:opacity-100 transition-all duration-300"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(article)}
              className="relative bg-black/40 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 p-2"
              title="Modifier l'article"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          {/* Bouton Supprimer */}
          <div className="relative group/action">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-rose-600/20 rounded-lg blur opacity-0 group-hover/action:opacity-100 transition-all duration-300"></div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(article.id)}
              className="relative bg-black/40 hover:bg-red-500/20 text-red-400 border border-red-500/30 p-2"
              title="Supprimer l'article"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </td>
    </tr>

    {/* Mobile Card Layout */}
    <tr className="sm:hidden">
      <td colSpan={7} className="p-0">
        <div className="relative group m-2">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur"></div>
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              {/* Image Mobile */}
              <div className="relative group/image flex-shrink-0">
                {article.imageUrl ? (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-lg blur opacity-0 group-hover/image:opacity-100 transition-all duration-300"></div>
                    <img
                      src={article.imageUrl}
                      alt={article.name}
                      className="relative w-12 h-12 object-cover rounded-lg border border-white/20"
                    />
                  </>
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center border border-white/20">
                    <Package className="w-6 h-6 text-white/60" />
                  </div>
                )}
              </div>

              {/* Content Mobile */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white/90 font-medium text-sm truncate">{article.name}</h3>
                    <p className="text-white/60 text-xs">{article.brand} • {article.size}</p>
                  </div>
                  <div className="text-right ml-2">
                    <div className="text-emerald-400 font-bold text-sm">{article.price}€</div>
                    <Badge className={`text-xs ${getStatusColor(article.status)}`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(article.status)}
                        <span>{getStatusLabel(article.status)}</span>
                      </span>
                    </Badge>
                  </div>
                </div>

                {/* Actions Mobile */}
                <div className="flex space-x-2">
                  <Button
                    onClick={() => onGenerateDescription(article)}
                    size="sm"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border border-white/20 text-xs"
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    IA
                  </Button>
                  
                  {article.status !== "vendu" && (
                    <Button
                      onClick={() => onMarkAsSold(article.id)}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white border border-white/20 text-xs"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => onEdit(article)}
                    size="sm"
                    variant="outline"
                    className="bg-black/40 border-white/20 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    onClick={() => onDelete(article.id)}
                    size="sm"
                    variant="outline"
                    className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30 text-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
    </>
  );
}