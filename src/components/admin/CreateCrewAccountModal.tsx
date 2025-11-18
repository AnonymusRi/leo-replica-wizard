
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCrewMemberWithAuth } from "@/hooks/useCreateCrewMemberWithAuth";
import { Loader2, Users } from "lucide-react";

interface CreateCrewAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateCrewAccountModal = ({ open, onOpenChange }: CreateCrewAccountModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "Vincenzo",
    lastName: "Pucillo",
    email: "vincenzo.pucillo@alidaunia.com",
    password: "password123",
    position: "captain" as const,
    organizationName: "Alidaunia"
  });

  const createCrewMutation = useCreateCrewMemberWithAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCrewMutation.mutateAsync(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating crew account:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Crea Account Crew
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Cognome</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              required
              minLength={6}
            />
          </div>

          <div>
            <Label htmlFor="position">Posizione</Label>
            <Select 
              value={formData.position}
              onValueChange={(value: any) => setFormData(prev => ({ ...prev, position: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="captain">Comandante</SelectItem>
                <SelectItem value="first_officer">Primo Ufficiale</SelectItem>
                <SelectItem value="cabin_crew">Assistente di Volo</SelectItem>
                <SelectItem value="mechanic">Meccanico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="organizationName">Organizzazione</Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button 
              type="submit" 
              disabled={createCrewMutation.isPending}
            >
              {createCrewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creazione...
                </>
              ) : (
                "Crea Account"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
