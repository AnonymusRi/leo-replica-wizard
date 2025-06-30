
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SystemModule } from "@/types/user-roles";

interface Organization {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  subscription_status: string;
  active_modules: string[];
}

interface OrganizationModalProps {
  organization: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_MODULES: SystemModule[] = [
  'SCHED', 'SALES', 'OPS', 'AIRCRAFT', 'CREW', 'CREW-TIME', 
  'MX', 'REPORTS', 'PHONEBOOK', 'OWNER BOARD'
];

const SUBSCRIPTION_STATUSES = ['trial', 'active', 'expired', 'suspended'];

export const OrganizationModal = ({ organization, isOpen, onClose, onSuccess }: OrganizationModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    subscription_status: 'trial',
    active_modules: [] as string[]
  });

  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        slug: organization.slug || '',
        email: organization.email || '',
        phone: organization.phone || '',
        city: organization.city || '',
        country: organization.country || '',
        subscription_status: organization.subscription_status || 'trial',
        active_modules: organization.active_modules || []
      });
    } else {
      setFormData({
        name: '',
        slug: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        subscription_status: 'trial',
        active_modules: []
      });
    }
  }, [organization]);

  const handleModuleChange = (module: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      active_modules: checked
        ? [...prev.active_modules, module]
        : prev.active_modules.filter(m => m !== module)
    }));
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: organization ? prev.slug : generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const orgData = {
        name: formData.name,
        slug: formData.slug,
        email: formData.email || null,
        phone: formData.phone || null,
        city: formData.city || null,
        country: formData.country || null,
        subscription_status: formData.subscription_status,
        active_modules: formData.active_modules
      };

      if (organization) {
        const { error } = await supabase
          .from('organizations')
          .update(orgData)
          .eq('id', organization.id);

        if (error) throw error;
        toast.success('Organizzazione aggiornata con successo');
      } else {
        const { error } = await supabase
          .from('organizations')
          .insert([orgData]);

        if (error) throw error;
        toast.success('Organizzazione creata con successo');
      }

      onSuccess();
    } catch (error: any) {
      toast.error('Errore: ' + error.message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {organization ? 'Modifica Organizzazione' : 'Nuova Organizzazione'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Organizzazione *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              required
              placeholder="organizzazione-esempio"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Città</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="country">Paese</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subscription_status">Stato Abbonamento</Label>
            <Select 
              value={formData.subscription_status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona stato" />
              </SelectTrigger>
              <SelectContent>
                {SUBSCRIPTION_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Moduli Attivi</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {AVAILABLE_MODULES.map((module) => (
                <div key={module} className="flex items-center space-x-2">
                  <Checkbox
                    id={module}
                    checked={formData.active_modules.includes(module)}
                    onCheckedChange={(checked) => handleModuleChange(module, checked as boolean)}
                  />
                  <Label htmlFor={module} className="text-sm">
                    {module}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit">
              {organization ? 'Aggiorna' : 'Crea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
