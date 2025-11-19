
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Download,
  Calendar
} from "lucide-react";
import { useAircraft } from "@/hooks/useAircraft";
import { useOilConsumptionRecords, useCreateOilConsumptionRecord } from "@/hooks/useOilConsumption";
import { format } from "date-fns";

export const OilConsumptionTracker = () => {
  const [selectedAircraft, setSelectedAircraft] = useState<string>("");
  const [selectedEngine, setSelectedEngine] = useState("Engine 1");
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    aircraft_id: "",
    engine_position: "Engine 1" as "Engine 1" | "Engine 2" | "APU",
    flight_date: "",
    flight_hours: 0,
    oil_added_liters: 0,
    oil_level_before: 0,
    oil_level_after: 0,
    consumption_rate: 0,
    notes: "",
    recorded_by: ""
  });

  const { data: aircraft = [] } = useAircraft();
  const { data: oilData } = useOilConsumptionRecords(50, 0);
  const oilRecords = oilData?.data || [];
  const createRecord = useCreateOilConsumptionRecord();

  // Filter records by selected aircraft and engine
  const filteredRecords = oilRecords.filter(record => {
    const aircraftMatch = !selectedAircraft || record.aircraft_id === selectedAircraft;
    const engineMatch = record.engine_position === selectedEngine;
    return aircraftMatch && engineMatch;
  });

  // Chart data
  const chartData = filteredRecords.map(item => ({
    date: format(new Date(item.flight_date), 'MM/dd'),
    consumption: item.consumption_rate || 0,
    hours: item.flight_hours || 0,
    oilAdded: item.oil_added_liters || 0
  }));

  // Statistics - ensure values are numbers
  const averageConsumption = filteredRecords.length > 0 
    ? filteredRecords.reduce((sum, item) => sum + (Number(item.consumption_rate) || 0), 0) / filteredRecords.length 
    : 0;
  const totalOilAdded = filteredRecords.reduce((sum, item) => sum + (Number(item.oil_added_liters) || 0), 0);
  const totalFlightHours = filteredRecords.reduce((sum, item) => sum + (Number(item.flight_hours) || 0), 0);

  const handleCreateRecord = async () => {
    if (!newRecord.aircraft_id || !newRecord.flight_date) {
      return;
    }

    await createRecord.mutateAsync({
      ...newRecord,
      flight_hours: Number(newRecord.flight_hours),
      oil_added_liters: Number(newRecord.oil_added_liters),
      oil_level_before: Number(newRecord.oil_level_before),
      oil_level_after: Number(newRecord.oil_level_after),
      consumption_rate: Number(newRecord.consumption_rate)
    });

    setIsAddingRecord(false);
    setNewRecord({
      aircraft_id: "",
      engine_position: "Engine 1",
      flight_date: "",
      flight_hours: 0,
      oil_added_liters: 0,
      oil_level_before: 0,
      oil_level_after: 0,
      consumption_rate: 0,
      notes: "",
      recorded_by: ""
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Oil Consumption Tracker</h2>
          <p className="text-gray-600">Monitor and analyze engine oil consumption</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            className="border rounded p-2"
            value={selectedAircraft}
            onChange={(e) => setSelectedAircraft(e.target.value)}
          >
            <option value="">All Aircraft</option>
            {aircraft.map(plane => (
              <option key={plane.id} value={plane.id}>{plane.tail_number}</option>
            ))}
          </select>
          
          <select 
            className="border rounded p-2"
            value={selectedEngine}
            onChange={(e) => setSelectedEngine(e.target.value)}
          >
            <option value="Engine 1">Engine 1</option>
            <option value="Engine 2">Engine 2</option>
            <option value="APU">APU</option>
          </select>

          <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Oil Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Oil Consumption Record</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aircraft">Aircraft</Label>
                  <select 
                    id="aircraft" 
                    className="w-full border rounded p-2"
                    value={newRecord.aircraft_id}
                    onChange={(e) => setNewRecord({...newRecord, aircraft_id: e.target.value})}
                  >
                    <option value="">Select Aircraft</option>
                    {aircraft.map(plane => (
                      <option key={plane.id} value={plane.id}>{plane.tail_number}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="engine">Engine</Label>
                  <select 
                    id="engine" 
                    className="w-full border rounded p-2"
                    value={newRecord.engine_position}
                    onChange={(e) => setNewRecord({...newRecord, engine_position: e.target.value as any})}
                  >
                    <option value="Engine 1">Engine 1</option>
                    <option value="Engine 2">Engine 2</option>
                    <option value="APU">APU</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newRecord.flight_date}
                    onChange={(e) => setNewRecord({...newRecord, flight_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="flightHours">Flight Hours</Label>
                  <Input 
                    id="flightHours" 
                    type="number" 
                    step="0.1" 
                    placeholder="8.5"
                    value={newRecord.flight_hours}
                    onChange={(e) => setNewRecord({...newRecord, flight_hours: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="oilAdded">Oil Added (L)</Label>
                  <Input 
                    id="oilAdded" 
                    type="number" 
                    step="0.1" 
                    placeholder="2.1"
                    value={newRecord.oil_added_liters}
                    onChange={(e) => setNewRecord({...newRecord, oil_added_liters: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="oilConsumption">Oil Consumption (L/Hr)</Label>
                  <Input 
                    id="oilConsumption" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.25"
                    value={newRecord.consumption_rate}
                    onChange={(e) => setNewRecord({...newRecord, consumption_rate: Number(e.target.value)})}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes" 
                    placeholder="Enter any notes about oil consumption"
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingRecord(false)}>Cancel</Button>
                <Button onClick={handleCreateRecord} disabled={createRecord.isPending}>
                  {createRecord.isPending ? 'Saving...' : 'Save Record'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(Number(averageConsumption) || 0).toFixed(3)} L/Hr</div>
            <p className="text-xs text-gray-500">Current selection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Oil Added</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{(Number(totalOilAdded) || 0).toFixed(1)} L</div>
            <p className="text-xs text-gray-500">Current selection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Flight Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(Number(totalFlightHours) || 0).toFixed(1)} Hrs</div>
            <p className="text-xs text-gray-500">Total monitored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{filteredRecords.length}</div>
            <p className="text-xs text-gray-500">Total entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Oil Consumption Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="consumption" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Oil Consumption (L/Hr)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Flight Hours vs Oil Added
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#82ca9d" name="Flight Hours" />
                  <Bar dataKey="oilAdded" fill="#8884d8" name="Oil Added (L)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Oil Consumption Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Oil Consumption Records</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Aircraft</TableHead>
                  <TableHead>Engine</TableHead>
                  <TableHead>Flight Hours</TableHead>
                  <TableHead>Oil Added (L)</TableHead>
                  <TableHead>Consumption (L/Hr)</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.flight_date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="font-mono">{record.aircraft?.tail_number}</TableCell>
                    <TableCell>{record.engine_position}</TableCell>
                    <TableCell>{record.flight_hours}</TableCell>
                    <TableCell>{record.oil_added_liters}</TableCell>
                    <TableCell className="font-mono">
                      <span className={(record.consumption_rate || 0) > 0.3 ? 'text-yellow-600 font-semibold' : ''}>
                        {record.consumption_rate?.toFixed(3)}
                      </span>
                    </TableCell>
                    <TableCell>{record.notes || "-"}</TableCell>
                    <TableCell>
                      {(record.consumption_rate || 0) > 0.3 ? (
                        <span className="flex items-center text-yellow-600">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          High
                        </span>
                      ) : (
                        <span className="text-green-600">Normal</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
