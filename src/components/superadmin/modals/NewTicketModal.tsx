
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateTicket, SupportTicket } from "@/hooks/useSupportTickets";

interface NewTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewTicketModal = ({ open, onOpenChange }: NewTicketModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "bug_report" as SupportTicket['category'],
    priority: "medium" as SupportTicket['priority']
  });

  const createTicketMutation = useCreateTicket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTicketMutation.mutateAsync({
        ...formData,
        user_id: undefined // Sarà impostato automaticamente dal backend
      });
      
      setFormData({
        title: "",
        description: "",
        category: "bug_report",
        priority: "medium"
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Errore creazione ticket:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuovo Ticket di Supporto</DialogTitle>
          <DialogDescription>
            Crea un nuovo ticket per segnalare problemi o richiedere funzionalità
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Descrivi brevemente il problema o la richiesta"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: SupportTicket['category']) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug_report">Bug Report</SelectItem>
                  <SelectItem value="feature_request">Richiesta Funzionalità</SelectItem>
                  <SelectItem value="technical_support">Supporto Tecnico</SelectItem>
                  <SelectItem value="billing">Fatturazione</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priorità</Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: SupportTicket['priority']) => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bassa</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="critical">Critica</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrizione</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrivi dettagliatamente il problema o la richiesta..."
              rows={6}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={createTicketMutation.isPending}
            >
              {createTicketMutation.isPending ? "Creazione..." : "Crea Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
