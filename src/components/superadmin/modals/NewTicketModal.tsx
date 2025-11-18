
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateTicket, SupportTicket } from "@/hooks/useSupportTickets";
import { useOrganizations } from "@/hooks/useOrganizations";

interface NewTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewTicketModal = ({ open, onOpenChange }: NewTicketModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "bug_report" as SupportTicket['category'],
    priority: "medium" as SupportTicket['priority'],
    is_general_announcement: false
  });
  
  const [selectedOrganizations, setSelectedOrganizations] = useState<string[]>([]);

  const { data: organizations = [] } = useOrganizations();
  const createTicketMutation = useCreateTicket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createTicketMutation.mutateAsync({
        ticket: {
          ...formData,
          created_by_super_admin: true
        },
        targetOrganizations: formData.is_general_announcement ? undefined : selectedOrganizations
      });
      
      setFormData({
        title: "",
        description: "",
        category: "bug_report",
        priority: "medium",
        is_general_announcement: false
      });
      setSelectedOrganizations([]);
      
      onOpenChange(false);
    } catch (error) {
      console.error('Errore creazione ticket:', error);
    }
  };

  const handleOrganizationToggle = (organizationId: string) => {
    setSelectedOrganizations(prev => 
      prev.includes(organizationId)
        ? prev.filter(id => id !== organizationId)
        : [...prev, organizationId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuovo Ticket di Supporto</DialogTitle>
          <DialogDescription>
            Crea un nuovo ticket per segnalare problemi o inviare comunicazioni alle organizzazioni
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Descrivi brevemente il problema o la comunicazione"
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
              placeholder="Descrivi dettagliatamente il problema o la comunicazione..."
              rows={6}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="general_announcement"
                checked={formData.is_general_announcement}
                onCheckedChange={(checked) => setFormData(prev => ({ 
                  ...prev, 
                  is_general_announcement: !!checked 
                }))}
              />
              <Label htmlFor="general_announcement">
                Invio generale a tutte le organizzazioni
              </Label>
            </div>

            {!formData.is_general_announcement && (
              <div className="space-y-2">
                <Label>Seleziona Organizzazioni Target</Label>
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  {organizations.length === 0 ? (
                    <p className="text-sm text-gray-500">Nessuna organizzazione disponibile</p>
                  ) : (
                    <div className="space-y-2">
                      {organizations.map((org) => (
                        <div key={org.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`org-${org.id}`}
                            checked={selectedOrganizations.includes(org.id)}
                            onCheckedChange={() => handleOrganizationToggle(org.id)}
                          />
                          <Label htmlFor={`org-${org.id}`} className="text-sm">
                            {org.name}
                            {org.subscription_status && (
                              <span className="ml-2 text-xs text-gray-500">
                                ({org.subscription_status})
                              </span>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!formData.is_general_announcement && selectedOrganizations.length === 0 && (
                  <p className="text-sm text-orange-600">
                    Seleziona almeno un'organizzazione o abilita l'invio generale
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={
                createTicketMutation.isPending || 
                (!formData.is_general_announcement && selectedOrganizations.length === 0)
              }
            >
              {createTicketMutation.isPending ? "Creazione..." : "Crea Ticket"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
