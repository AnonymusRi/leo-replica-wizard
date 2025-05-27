
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeTableView } from "./TimeTableView";
import { FTLComplianceCard } from "./FTLComplianceCard";
import { TrainingModule } from "./TrainingModule";
import { FlightHoursModule } from "./FlightHoursModule";
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
          <FlightHoursModule />
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingModule />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <FTLComplianceCard 
            pilotName="Tutti i Piloti" 
            compliance={{
              compliant: true,
              warnings: [],
              hours: {
                dailyHours: 0,
                weeklyHours: 0,
                monthlyHours: 0,
                yearlyHours: 0
              }
            }}
            limits={{
              id: "default-limit",
              regulation_name: "EASA FTL",
              daily_limit: 8,
              weekly_limit: 40,
              monthly_limit: 100,
              yearly_limit: 1000,
              min_rest_between_duties: 12,
              min_weekly_rest: 36,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
