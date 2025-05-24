
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Filter,
  Calendar,
  Clock,
  Plane,
  Users,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  Circle,
  MoreVertical,
  Plus,
  Copy,
  Settings
} from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface DetailedFlight {
  id: string;
  fw_jl: string;
  flight_no: string;
  icao_type: string;
  day: string;
  date: string;
  std: string;
  adep: string;
  ades: string;
  status: string;
  captain: string;
  cpt2: string;
  fo: string;
  fa1: string;
  trip_no: string;
  pax_cargo: string;
  properties: string;
  tags: string[];
  cautions?: string;
  rescue_category?: string;
  phone?: string;
  pax_capacity?: number;
  mtow?: number;
  wifi?: boolean;
}

interface OpsDetailedTableViewProps {
  flights: any[];
  onFlightSelect: (flight: any) => void;
}

export const OpsDetailedTableView = ({ flights, onFlightSelect }: OpsDetailedTableViewProps) => {
  const [selectedFlights, setSelectedFlights] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterDate, setFilterDate] = useState("");
  const [filterAircraft, setFilterAircraft] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Mock data simile a quella nell'immagine
  const mockDetailedFlights: DetailedFlight[] = [
    {
      id: "1",
      fw_jl: "FW & JL",
      flight_no: "ABC001",
      icao_type: "N",
      day: "Wed",
      date: "16 Aug",
      std: "07:00",
      adep: "EDDF",
      ades: "GVAC",
      status: "confirmed",
      captain: "-",
      cpt2: "-",
      fo: "-",
      fa1: "-",
      trip_no: "08-2023/62",
      pax_cargo: "— / —",
      properties: "",
      tags: [],
      cautions: "Rotation time too short. Please check surrounding flights"
    },
    {
      id: "2",
      fw_jl: "FW & JL",
      flight_no: "GHI002",
      icao_type: "S",
      day: "Wed",
      date: "16 Aug",
      std: "08:45",
      adep: "LEMG",
      ades: "EGGW",
      status: "confirmed",
      captain: "-",
      cpt2: "-",
      fo: "-",
      fa1: "-",
      trip_no: "08-2023/263",
      pax_cargo: "— / —",
      properties: "",
      tags: []
    },
    {
      id: "3",
      fw_jl: "FW & JL",
      flight_no: "123",
      icao_type: "S",
      day: "Wed",
      date: "16 Aug",
      std: "10:00",
      adep: "VGHS",
      ades: "VGEG",
      status: "confirmed",
      captain: "-",
      cpt2: "-",
      fo: "-",
      fa1: "-",
      trip_no: "08-2023/187",
      pax_cargo: "— / —",
      properties: "",
      tags: ["DOMESTIC"]
    },
    {
      id: "4",
      fw_jl: "FW & JL",
      flight_no: "TESTFPS",
      icao_type: "S",
      day: "Thu",
      date: "17 Aug",
      std: "08:00",
      adep: "LOWW",
      ades: "EBBR",
      status: "active",
      captain: "MAN",
      cpt2: "-",
      fo: "-",
      fa1: "-",
      trip_no: "08-2023/38",
      pax_cargo: "— / —",
      properties: "",
      tags: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "active": return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "delayed": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag) {
      case "DOMESTIC": return "bg-orange-500 text-white";
      case "66666": return "bg-red-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFlights(mockDetailedFlights.map(f => f.id));
    } else {
      setSelectedFlights([]);
    }
  };

  const handleSelectFlight = (flightId: string, checked: boolean) => {
    if (checked) {
      setSelectedFlights([...selectedFlights, flightId]);
    } else {
      setSelectedFlights(selectedFlights.filter(id => id !== flightId));
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
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

      {/* Action Buttons */}
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

      {/* Main Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedFlights.length === mockDetailedFlights.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-20">FW & JL</TableHead>
              <TableHead>Flight No.</TableHead>
              <TableHead className="w-16">ICAO type</TableHead>
              <TableHead className="w-16">Day</TableHead>
              <TableHead className="w-20">Date</TableHead>
              <TableHead className="w-16">STD</TableHead>
              <TableHead className="w-20">ADEP</TableHead>
              <TableHead className="w-20">ADES</TableHead>
              <TableHead>COM</TableHead>
              <TableHead className="w-16">Crew</TableHead>
              <TableHead className="w-16">CPT</TableHead>
              <TableHead className="w-16">CPT2</TableHead>
              <TableHead className="w-16">FO</TableHead>
              <TableHead className="w-16">FA1</TableHead>
              <TableHead>Trip No.</TableHead>
              <TableHead>PAX / Cargo</TableHead>
              <TableHead>Show Properties</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDetailedFlights.map((flight, index) => (
              <TableRow 
                key={flight.id} 
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
              >
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                    <Checkbox 
                      checked={selectedFlights.includes(flight.id)}
                      onCheckedChange={(checked) => handleSelectFlight(flight.id, checked as boolean)}
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-xs">{flight.fw_jl}</TableCell>
                <TableCell className="font-bold text-blue-600">{flight.flight_no}</TableCell>
                <TableCell className="text-center">{flight.icao_type}</TableCell>
                <TableCell>{flight.day}</TableCell>
                <TableCell>{flight.date}</TableCell>
                <TableCell className="font-mono">{flight.std}</TableCell>
                <TableCell className="font-mono text-blue-600">{flight.adep}</TableCell>
                <TableCell className="font-mono text-blue-600">{flight.ades}</TableCell>
                <TableCell>
                  {flight.cautions && (
                    <div className="bg-yellow-100 p-1 rounded text-xs border border-yellow-300">
                      <div className="font-semibold text-yellow-800">Cautions:</div>
                      <div className="text-yellow-700">{flight.cautions}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">-</TableCell>
                <TableCell className="text-center">{flight.captain}</TableCell>
                <TableCell className="text-center">{flight.cpt2}</TableCell>
                <TableCell className="text-center">{flight.fo}</TableCell>
                <TableCell className="text-center">{flight.fa1}</TableCell>
                <TableCell className="font-mono text-sm">{flight.trip_no}</TableCell>
                <TableCell className="font-mono text-sm">{flight.pax_cargo}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {flight.tags.map((tag, i) => (
                      <Badge key={i} className={`text-xs ${getTagColor(tag)}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary Row */}
      <div className="bg-slate-50 p-2 rounded text-sm text-gray-600">
        Showing {mockDetailedFlights.length} flights | Selected: {selectedFlights.length}
      </div>
    </div>
  );
};
