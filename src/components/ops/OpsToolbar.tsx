
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter,
  Calendar,
  Clock,
  Plane,
  Settings
} from "lucide-react";

export const OpsToolbar = () => {
  return (
    <div className="flex items-center justify-between bg-slate-100 p-3 rounded-lg">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-1" />
          TABLE
        </Button>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-1" />
          CALENDAR
        </Button>
        <Button variant="outline" size="sm">
          <Clock className="w-4 h-4 mr-1" />
          TIMELINE
        </Button>
        <div className="border-l pl-2 ml-2">
          <Input type="date" className="w-32 h-8" />
        </div>
        <Select>
          <SelectTrigger className="w-24 h-8">
            <SelectValue placeholder="UTC" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="local">Local</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-32 h-8">
            <SelectValue placeholder="No Limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="no-limit">No Limit</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm">
          <Plane className="w-4 h-4 mr-1" />
          AIRCRAFT
        </Button>
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-1" />
          FILTER
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
