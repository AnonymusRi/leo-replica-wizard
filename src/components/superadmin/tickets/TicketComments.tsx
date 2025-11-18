
import { TicketComment } from "@/hooks/useSupportTickets";

interface TicketCommentsProps {
  comments: TicketComment[];
}

export const TicketComments = ({ comments }: TicketCommentsProps) => {
  return (
    <div>
      <h4 className="font-semibold mb-3">Commenti ({comments.length})</h4>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border rounded-md p-3">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-sm">Utente</span>
              <span className="text-xs text-gray-500">
                {new Date(comment.created_at).toLocaleString('it-IT')}
              </span>
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
