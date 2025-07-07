
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCreateCrewAuth } from "@/hooks/useCreateCrewAuth";
import { Plane, User } from "lucide-react";
import { toast } from "sonner";

export const InitializePilotAccounts = () => {
  const createCrewAuth = useCreateCrewAuth();

  const { data: crewMembers } = useQuery({
    queryKey: ['crew-members-no-auth'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('is_active', true)
        .order('first_name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateAccount = async (crewMember: any) => {
    const password = 'Pilot123!'; // Password standard per demo
    
    try {
      await createCrewAuth.mutateAsync({
        email: crewMember.email,
        password: password,
        crewMemberId: crewMember.id
      });
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleCreateAllAccounts = async () => {
    if (!crewMembers) return;
    
    for (const member of crewMembers) {
      try {
        await handleCreateAccount(member);
        // Piccolo delay tra le creazioni
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error creating account for ${member.email}:`, error);
      }
    }
    
    toast.success('Inizializzazione accounts completata!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plane className="w-5 h-5" />
          <span>Inizializzazione Account Piloti</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Crea gli account di autenticazione per tutti i piloti con password standard: <code>Pilot123!</code>
          </p>
          <Button 
            onClick={handleCreateAllAccounts}
            disabled={createCrewAuth.isPending}
            className="flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>Crea Tutti gli Account</span>
          </Button>
        </div>

        {crewMembers && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {crewMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{member.first_name} {member.last_name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-400">{member.position === 'captain' ? 'Comandante' : 'Primo Ufficiale'}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateAccount(member)}
                  disabled={createCrewAuth.isPending}
                >
                  Crea Account
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
