
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const OpsActionButtons = () => {
  return (
    <div className="flex items-center space-x-2">
      <Button size="sm" className="bg-green-600 hover:bg-green-700">
        <Plus className="w-4 h-4 mr-1" />
        NEW TRIP
      </Button>
      <Button variant="outline" size="sm">
        <Plus className="w-4 h-4 mr-1" />
        NEW POSITIONING
      </Button>
      <Button variant="outline" size="sm">
        <Plus className="w-4 h-4 mr-1" />
        NEW RESERVATION
      </Button>
      <Button variant="outline" size="sm">
        <Plus className="w-4 h-4 mr-1" />
        NEW SIMULATOR
      </Button>
      <Button variant="outline" size="sm">
        SERVICE REQUESTS
      </Button>
    </div>
  );
};
