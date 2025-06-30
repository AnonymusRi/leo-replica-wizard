
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Clock, 
  AlertTriangle,
  Settings,
  LogOut,
  Plane,
  Moon,
  Sun
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CrewProfileSection } from "@/components/crew/dashboard/CrewProfileSection";
import { CrewScheduleSection } from "@/components/crew/dashboard/CrewScheduleSection";
import { CrewStatisticsSection } from "@/components/crew/dashboard/CrewStatisticsSection";
import { CrewMessagesSection } from "@/components/crew/dashboard/CrewMessagesSection";
import { CrewFTLSection } from "@/components/crew/dashboard/CrewFTLSection";
import { CrewFatigueSection } from "@/components/crew/dashboard/CrewFatigueSection";

export default function CrewDashboard() {
  const [user, setUser] = useState<any>(null);
  const [crewMember, setCrewMember] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setUser(user);
      
      // Get crew member data
      const { data: crewData, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('email', user.email)
        .single();
      
      if (error || !crewData) {
        toast.error('Profilo crew non trovato');
        navigate('/auth');
        return;
      }
      
      setCrewMember(crewData);
    };

    getUser();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
    toast.success('Logout effettuato con successo');
  };

  if (!user || !crewMember) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento dashboard...</p>
        </div>
      </div>
    );
  }

  const getPositionLabel = (position: string) => {
    switch (position) {
      case "captain": return "Comandante";
      case "first_officer": return "Primo Ufficiale";
      case "cabin_crew": return "Assistente di Volo";
      case "mechanic": return "Meccanico";
      default: return position;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Plane className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Crew Dashboard</h1>
                <p className="text-sm text-gray-500">
                  {crewMember.first_name} {crewMember.last_name} - {getPositionLabel(crewMember.position)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>On Duty</span>
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profilo</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Statistiche</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Messaggi</span>
            </TabsTrigger>
            <TabsTrigger value="ftl" className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="hidden sm:inline">FTL</span>
            </TabsTrigger>
            <TabsTrigger value="fatigue" className="flex items-center space-x-2">
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Fatica</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <CrewProfileSection crewMember={crewMember} />
          </TabsContent>

          <TabsContent value="schedule">
            <CrewScheduleSection crewMemberId={crewMember.id} />
          </TabsContent>

          <TabsContent value="statistics">
            <CrewStatisticsSection crewMemberId={crewMember.id} />
          </TabsContent>

          <TabsContent value="messages">
            <CrewMessagesSection crewMemberId={crewMember.id} />
          </TabsContent>

          <TabsContent value="ftl">
            <CrewFTLSection crewMemberId={crewMember.id} />
          </TabsContent>

          <TabsContent value="fatigue">
            <CrewFatigueSection crewMemberId={crewMember.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
