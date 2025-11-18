
import { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { OpsToolbar } from "./OpsToolbar";
import { OpsActionButtons } from "./OpsActionButtons";
import { OpsTableHeader } from "./OpsTableHeader";
import { OpsFlightRow } from "./OpsFlightRow";
import { DetailedFlight, OpsDetailedTableViewProps } from "./types";

export const OpsDetailedTableView = ({ flights, onFlightSelect }: OpsDetailedTableViewProps) => {
  const [selectedFlights, setSelectedFlights] = useState<string[]>([]);

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
      <OpsToolbar />
      <OpsActionButtons />

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <OpsTableHeader 
            selectedCount={selectedFlights.length}
            totalCount={mockDetailedFlights.length}
            onSelectAll={handleSelectAll}
          />
          <TableBody>
            {mockDetailedFlights.map((flight, index) => (
              <OpsFlightRow
                key={flight.id}
                flight={flight}
                index={index}
                isSelected={selectedFlights.includes(flight.id)}
                onSelect={handleSelectFlight}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-slate-50 p-2 rounded text-sm text-gray-600">
        Showing {mockDetailedFlights.length} flights | Selected: {selectedFlights.length}
      </div>
    </div>
  );
};
