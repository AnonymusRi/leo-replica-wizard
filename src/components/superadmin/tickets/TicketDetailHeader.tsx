
import { MessageSquare } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface TicketDetailHeaderProps {
  ticketNumber: string;
  title: string;
}

export const TicketDetailHeader = ({ ticketNumber, title }: TicketDetailHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        {ticketNumber}: {title}
      </DialogTitle>
      <DialogDescription>
        Gestisci il ticket e aggiungi commenti
      </DialogDescription>
    </DialogHeader>
  );
};
