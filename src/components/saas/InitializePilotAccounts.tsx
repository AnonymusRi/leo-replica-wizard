
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCreateCrewAuth } from "@/hooks/useCreateCrewAuth";
import { Plane, User, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const InitializePilotAccounts = () => {
  const createCrewAuth = useCreateCrewAuth();
  const [processedAccounts, setProcessedAccounts] = useState<Set<string>>(new Set());

  const { data: crewMembers, refetch } = useQuery({
    queryKey: ['crew-members-no-auth'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('is_active', true)
        .order('first_name');
      
      if (error) {
        console.error('Error fetching crew members:', error);
        throw error;
      }
      return data || [];
    }
  });

  const handleCreateAccount = async (crewMember: any) => {
    const password = 'Pilot123!'; // Password standard per demo
    
    try {
      console.log('Creating account for:', crewMember.email);
      
      await createCrewAuth.mutateAsync({
        email: crewMember.email,
        password: password,
        crewMemberId: crewMember.id
      });
      
      setProcessedAccounts(prev => new Set([...prev, crewMember.id]));
      
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  const handleCreateAllAccounts = async () => {
    if (!crewMembers) return;
    
    toast.info('Inizializzazione accounts in corso...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const member of crewMembers) {
      if (processedAccounts.has(member.id)) {
        console.log(`Skipping ${member.email} - already processed`);
        continue;
      }
      
      try {
        await handleCreateAccount(member);
        successCount++;
        // Piccolo delay tra le creazioni
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error creating account for ${member.email}:`, error);
        errorCount++;
      }
    }
    
    toast.success(`Inizializzazione completata! ${successCount} account creati, ${errorCount} errori`);
  };

  const isAccountProcessed = (memberId: string) => {
    return processedAccounts.has(memberId);
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
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Crea gli account di autenticazione per tutti i piloti con password standard: <code className="bg-gray-100 px-2 py-1 rounded">Pilot123!</code>
            </p>
            <p className="text-xs text-gray-500">
              Trovati {crewMembers?.length || 0} membri dell'equipaggio
            </p>
          </div>
          <Button 
            onClick={handleCreateAllAccounts}
            disabled={createCrewAuth.isPending || !crewMembers?.length}
            className="flex items-center space-x-2"
          >
            <User className="w-4 h-4" />
            <span>
              {createCrewAuth.isPending ? 'Creazione...' : 'Crea Tutti gli Account'}
            </span>
          </Button>
        </div>

        {crewMembers && crewMembers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {crewMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium">{member.first_name} {member.last_name}</p>
                    {isAccountProcessed(member.id) && (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{member.email}</p>
                  <p className="text-xs text-gray-400">
                    {member.position === 'captain' ? 'Comandante' : 'Primo Ufficiale'}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={isAccountProcessed(member.id) ? "outline" : "default"}
                  onClick={() => handleCreateAccount(member)}
                  disabled={createCrewAuth.isPending || isAccountProcessed(member.id)}
                >
                  {isAccountProcessed(member.id) ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Creato
                    </>
                  ) : (
                    'Crea Account'
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}

        {(!crewMembers || crewMembers.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p>Nessun membro dell'equipaggio trovato</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
