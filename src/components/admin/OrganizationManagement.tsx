
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, Settings, Plus } from "lucide-react";
import { OrganizationModal } from "./OrganizationModal";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OrganizationWithUserCount {
  id: string;
  name: string;
  slug: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  subscription_status: string;
  subscription_end_date?: string;
  active_modules: string[];
  user_count: number;
  created_at: string;
}

export const OrganizationManagement = () => {
  const [selectedOrg, setSelectedOrg] = useState<OrganizationWithUserCount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: organizationsData, isLoading: orgsLoading, refetch } = useOrganizations();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations-with-user-count'],
    queryFn: async () => {
      if (!organizationsData) return [];

      const orgsWithUserCount = await Promise.all(
        organizationsData.map(async (org) => {
          const { count } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('organization_id', org.id);
          
          return {
            ...org,
            active_modules: Array.isArray(org.active_modules) ? org.active_modules : [],
            user_count: count || 0
          } as OrganizationWithUserCount;
        })
      );

      return orgsWithUserCount;
    },
    enabled: !!organizationsData
  });

  const getSubscriptionBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Attivo</Badge>;
      case 'trial':
        return <Badge variant="outline">Prova</Badge>;
      case 'expired':
        return <Badge variant="destructive">Scaduto</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleCreateOrg = () => {
    setSelectedOrg(null);
    setIsModalOpen(true);
  };

  const handleEditOrg = (org: OrganizationWithUserCount) => {
    setSelectedOrg(org);
    setIsModalOpen(true);
  };

  if (isLoading || orgsLoading) {
    return <div>Caricamento organizzazioni...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Organizzazioni Registrate</h3>
        <Button onClick={handleCreateOrg}>
          <Plus className="w-4 h-4 mr-2" />
          Nuova Organizzazione
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {organizations?.map((org) => (
          <Card key={org.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-blue-500" />
                  <div>
                    <CardTitle className="text-lg">{org.name}</CardTitle>
                    <CardDescription>@{org.slug}</CardDescription>
                  </div>
                </div>
                {getSubscriptionBadge(org.subscription_status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{org.user_count} utenti</span>
                  </span>
                  <span className="text-gray-500">
                    {org.city && org.country ? `${org.city}, ${org.country}` : 'Ubicazione non specificata'}
                  </span>
                </div>

                {org.active_modules && org.active_modules.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-1">Moduli Attivi:</h5>
                    <div className="flex flex-wrap gap-1">
                      {org.active_modules.slice(0, 3).map((module, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                      {org.active_modules.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{org.active_modules.length - 3} altri
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEditOrg(org)}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Gestisci
                  </Button>
                  <span className="text-xs text-gray-500">
                    Creata: {new Date(org.created_at).toLocaleDateString('it-IT')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!organizations || organizations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessuna organizzazione trovata
            </h3>
            <p className="text-gray-500 mb-4">
              Crea la prima organizzazione per iniziare.
            </p>
            <Button onClick={handleCreateOrg}>
              <Plus className="w-4 h-4 mr-2" />
              Crea Organizzazione
            </Button>
          </CardContent>
        </Card>
      )}

      <OrganizationModal
        organization={selectedOrg}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          refetch();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
