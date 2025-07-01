
import { Badge } from "@/components/ui/badge";

interface RequestStatusBadgeProps {
  status: string;
}

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  switch (status) {
    case "pending_review":
      return <Badge className="bg-yellow-100 text-yellow-800">In Revisione</Badge>;
    case "documentation_required":
      return <Badge className="bg-orange-100 text-orange-800">Documentazione Richiesta</Badge>;
    case "ready_for_setup":
      return <Badge className="bg-green-100 text-green-800">Pronto per Setup</Badge>;
    default:
      return <Badge variant="outline">Sconosciuto</Badge>;
  }
};
