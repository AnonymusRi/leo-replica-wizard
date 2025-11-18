
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TimeTableView } from "./TimeTableView";
import { TrainingModule } from "./TrainingModule";
import { FlightHoursModule } from "./FlightHoursModule";
import { FTLCompliancePage } from "./FTLCompliancePage";
import { CrewScheduleManager } from "./CrewScheduleManager";
import { Calendar, Clock, Shield, GraduationCap, Users } from "lucide-react";

export const PilotTimeTableModule = () => {
  const [activeTab, setActiveTab] = useState("schedule");

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="schedule" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="crew-schedules" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Orari Crew</span>
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

        <TabsContent value="crew-schedules" className="mt-6">
          <CrewScheduleManager />
        </TabsContent>

        <TabsContent value="hours" className="mt-6">
          <FlightHoursModule />
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingModule />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <FTLCompliancePage />
        </TabsContent>
      </Tabs>
    </div>
  );
};
