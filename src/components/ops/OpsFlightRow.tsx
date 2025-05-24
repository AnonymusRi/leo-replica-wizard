
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Settings } from "lucide-react";
import { DetailedFlight } from "./types";

interface OpsFlightRowProps {
  flight: DetailedFlight;
  index: number;
  isSelected: boolean;
  onSelect: (flightId: string, checked: boolean) => void;
}

export const OpsFlightRow = ({ flight, index, isSelected, onSelect }: OpsFlightRowProps) => {
  const getTagColor = (tag: string) => {
    switch (tag) {
      case "DOMESTIC": return "bg-orange-500 text-white";
      case "66666": return "bg-red-500 text-white";
      default: return "bg-blue-500 text-white";
    }
  };

  return (
    <TableRow 
      className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}
    >
      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(flight.id, checked as boolean)}
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
  );
};
