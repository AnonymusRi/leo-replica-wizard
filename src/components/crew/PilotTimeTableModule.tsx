
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeTableView } from "./TimeTableView";
import { FTLComplianceCard } from "./FTLComplianceCard";
import { TrainingModule } from "./TrainingModule";
import { Calendar, Clock, Shield, GraduationCap } from "lucide-react";

export const PilotTimeTableModule = () => {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="hours" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Ore di Volo</span>
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center space-x-2">
            <GraduationCap className="w-4 h-4" />
            <span>Training</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Compliance FTL</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="mt-6">
          <TimeTableView />
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <div className="text-center py-8">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">Modulo Ore di Volo</h3>
            <p className="text-gray-500">Gestione del registro ore di volo piloti</p>
          </div>
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingModule />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <FTLComplianceCard 
            pilotName="Tutti i Piloti" 
            compliance={{
              daily: { current: 0, limit: 8, status: 'ok' },
              weekly: { current: 0, limit: 40, status: 'ok' },
              monthly: { current: 0, limit: 100, status: 'ok' }
            }}
            limits={{
              daily_limit: 8,
              weekly_limit: 40,
              monthly_limit: 100,
              yearly_limit: 1000,
              min_rest_between_duties: 12,
              min_weekly_rest: 36
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
