
import { Badge } from "@/components/ui/badge";
import { getStatusBadge, getPriorityBadge } from "./TicketBadges";

interface TicketDetailInfoProps {
  status: string;
  priority: string;
  category: string;
  createdAt: string;
}

export const TicketDetailInfo = ({ status, priority, category, createdAt }: TicketDetailInfoProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-semibold mb-2">Stato</h4>
        {getStatusBadge(status)}
      </div>
      <div>
        <h4 className="font-semibold mb-2">Priorità</h4>
        {getPriorityBadge(priority)}
      </div>
      <div>
        <h4 className="font-semibold mb-2">Categoria</h4>
        <Badge variant="outline">{category}</Badge>
      </div>
      <div>
        <h4 className="font-semibold mb-2">Creato</h4>
        <p className="text-sm text-gray-600">
          {new Date(createdAt).toLocaleString('it-IT')}
        </p>
      </div>
    </div>
  );
};
