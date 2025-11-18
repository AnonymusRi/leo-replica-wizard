
import { Badge } from "@/components/ui/badge";

export const getStatusBadge = (status: string) => {
  switch (status) {
    case "open":
      return <Badge className="bg-red-100 text-red-800">Aperto</Badge>;
    case "in_progress":
      return <Badge className="bg-yellow-100 text-yellow-800">In Lavorazione</Badge>;
    case "resolved":
      return <Badge className="bg-green-100 text-green-800">Risolto</Badge>;
    case "closed":
      return <Badge variant="secondary">Chiuso</Badge>;
    default:
      return <Badge variant="outline">Sconosciuto</Badge>;
  }
};

export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "critical":
      return <Badge variant="destructive">Critica</Badge>;
    case "high":
      return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
    case "medium":
      return <Badge className="bg-blue-100 text-blue-800">Media</Badge>;
    case "low":
      return <Badge className="bg-gray-100 text-gray-800">Bassa</Badge>;
    default:
      return <Badge variant="outline">Non definita</Badge>;
  }
};

export const getCategoryLabel = (category: string) => {
  switch (category) {
    case "bug_report": return "Bug Report";
    case "feature_request": return "Richiesta Funzionalità";
    case "technical_support": return "Supporto Tecnico";
    case "billing": return "Fatturazione";
    default: return category;
  }
};
