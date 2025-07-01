
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface AddCommentFormProps {
  onAddComment: (comment: string) => Promise<void>;
  isLoading: boolean;
}

export const AddCommentForm = ({ onAddComment, isLoading }: AddCommentFormProps) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async () => {
    if (newComment.trim()) {
      await onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold">Aggiungi Commento</h4>
      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Scrivi un commento..."
        rows={3}
      />
      <Button 
        onClick={handleSubmit}
        disabled={!newComment.trim() || isLoading}
      >
        {isLoading ? "Invio..." : "Aggiungi Commento"}
      </Button>
    </div>
  );
};
