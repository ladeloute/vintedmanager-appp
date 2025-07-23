import { Edit, Trash2, Sparkles, CheckCircle, Clock } from "lucide-react";
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
        return "bg-green-100 text-green-800";
      case "en-attente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-blue-100 text-blue-800";
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

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-4">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-400 text-xs">No img</span>
          </div>
        )}
      </td>
      <td className="py-4 px-4">
        <p className="font-medium">{article.name}</p>
        <p className="text-sm text-text-secondary">
          Ajouté le {new Date(article.createdAt).toLocaleDateString('fr-FR')}
        </p>
      </td>
      <td className="py-4 px-4">{article.brand}</td>
      <td className="py-4 px-4">{article.size}</td>
      <td className="py-4 px-4">
        <span className="font-medium">{article.price}€</span>
      </td>
      <td className="py-4 px-4">
        <Badge className={getStatusColor(article.status)}>
          {getStatusLabel(article.status)}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <div className="flex space-x-2">
          {article.status !== "vendu" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsSold(article.id)}
              className="text-green-600 hover:text-green-700"
              title="Marquer comme vendu"
            >
              <CheckCircle className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onGenerateDescription(article)}
            className="text-accent hover:text-orange-600"
            title="Générer description"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(article)}
            className="text-primary hover:text-blue-600"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(article.id)}
            className="text-destructive hover:text-red-600"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
