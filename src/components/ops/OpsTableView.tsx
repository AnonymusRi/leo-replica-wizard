
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  Edit, 
  Plane, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar
} from "lucide-react";
import { format } from "date-fns";

interface OpsTableViewProps {
  flights: any[];
  onFlightSelect: (flight: any) => void;
  getStatusColor: (status: string) => string;
}

export const OpsTableView = ({ flights, onFlightSelect, getStatusColor }: OpsTableViewProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Flight No.</TableHead>
            <TableHead>ICAO Type</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>STD</TableHead>
            <TableHead>ADEP</TableHead>
            <TableHead>ADES</TableHead>
            <TableHead>STA</TableHead>
            <TableHead>A/C Type</TableHead>
            <TableHead>ACFT</TableHead>
            <TableHead>AOC</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>COM</TableHead>
            <TableHead>Crew</TableHead>
            <TableHead>Trip No.</TableHead>
            <TableHead>PAX / Cargo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flights.map((flight) => (
            <TableRow key={flight.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div className="flex items-center">
                  {flight.status === 'delayed' && <AlertTriangle className="w-4 h-4 mr-1 text-orange-500" />}
                  {flight.status === 'completed' && <CheckCircle className="w-4 h-4 mr-1 text-green-500" />}
                  {flight.flight_number}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">N</Badge>
              </TableCell>
              <TableCell>
                {format(new Date(flight.departure_time), 'EEE')}
              </TableCell>
              <TableCell>
                {format(new Date(flight.departure_time), 'dd MMM')}
              </TableCell>
              <TableCell>
                {format(new Date(flight.departure_time), 'HH:mm')}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {flight.departure_airport}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {flight.arrival_airport}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(flight.arrival_time), 'HH:mm')}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{flight.aircraft?.aircraft_type || 'TBD'}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Plane className="w-4 h-4 mr-1 text-blue-500" />
                  {flight.aircraft?.tail_number || 'TBD'}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">MAN</Badge>
              </TableCell>
              <TableCell>
                {flight.client?.company_name || 'TBD'}
              </TableCell>
              <TableCell>
                <Badge variant="outline">DSE</Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  <span className="text-sm">CPT/FO</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-gray-600">
                  {format(new Date(flight.departure_time), 'MM-yyyy')}/001
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1 text-gray-400" />
                  {flight.passenger_count} PAX
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(flight.status)}>
                  {flight.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onFlightSelect(flight)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Calendar className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {flights.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nessun volo trovato con i criteri di ricerca attuali
        </div>
      )}
    </div>
  );
};
