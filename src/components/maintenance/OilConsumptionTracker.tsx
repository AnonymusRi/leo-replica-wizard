
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

export const OilConsumptionTracker = () => {
  const [selectedAircraft, setSelectedAircraft] = useState("D-JANF");
  const [selectedEngine, setSelectedEngine] = useState("Engine 1");

  // Mock oil consumption data
  const oilConsumptionData = [
    {
      id: "1",
      date: "2023-08-01",
      flightHours: 8.5,
      oilAdded: 2.1,
      oilConsumption: 0.25,
      engine: "Engine 1",
      aircraft: "D-JANF",
      notes: "Normal consumption"
    },
    {
      id: "2",
      date: "2023-08-15",
      flightHours: 12.3,
      oilAdded: 3.2,
      oilConsumption: 0.26,
      engine: "Engine 1",
      aircraft: "D-JANF",
      notes: ""
    },
    {
      id: "3",
      date: "2023-09-01",
      flightHours: 15.7,
      oilAdded: 4.1,
      oilConsumption: 0.28,
      engine: "Engine 1",
      aircraft: "D-JANF",
      notes: "Slight increase"
    }
  ];

  // Chart data
  const chartData = oilConsumptionData.map(item => ({
    date: item.date,
    consumption: item.oilConsumption,
    hours: item.flightHours
  }));

  const averageConsumption = oilConsumptionData.reduce((sum, item) => sum + item.oilConsumption, 0) / oilConsumptionData.length;
  const totalOilAdded = oilConsumptionData.reduce((sum, item) => sum + item.oilAdded, 0);
  const totalFlightHours = oilConsumptionData.reduce((sum, item) => sum + item.flightHours, 0);

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
            <option value="D-JANF">D-JANF</option>
            <option value="D-JANA">D-JANA</option>
            <option value="D-JANB">D-JANB</option>
          </select>
          
          <select 
            className="border rounded p-2"
            value={selectedEngine}
            onChange={(e) => setSelectedEngine(e.target.value)}
          >
            <option value="Engine 1">Engine 1</option>
            <option value="Engine 2">Engine 2</option>
          </select>

          <Dialog>
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
                  <select id="aircraft" className="w-full border rounded p-2">
                    <option value="D-JANF">D-JANF</option>
                    <option value="D-JANA">D-JANA</option>
                    <option value="D-JANB">D-JANB</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="engine">Engine</Label>
                  <select id="engine" className="w-full border rounded p-2">
                    <option value="Engine 1">Engine 1</option>
                    <option value="Engine 2">Engine 2</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
                <div>
                  <Label htmlFor="flightHours">Flight Hours</Label>
                  <Input id="flightHours" type="number" step="0.1" placeholder="8.5" />
                </div>
                <div>
                  <Label htmlFor="oilAdded">Oil Added (L)</Label>
                  <Input id="oilAdded" type="number" step="0.1" placeholder="2.1" />
                </div>
                <div>
                  <Label htmlFor="oilConsumption">Oil Consumption (L/Hr)</Label>
                  <Input id="oilConsumption" type="number" step="0.01" placeholder="0.25" />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input id="notes" placeholder="Enter any notes about oil consumption" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Record</Button>
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
            <div className="text-2xl font-bold">{averageConsumption.toFixed(3)} L/Hr</div>
            <p className="text-xs text-gray-500">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Oil Added</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalOilAdded.toFixed(1)} L</div>
            <p className="text-xs text-gray-500">Current period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Flight Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalFlightHours.toFixed(1)} Hrs</div>
            <p className="text-xs text-gray-500">Total monitored</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-2xl font-bold text-yellow-600">+12%</span>
            </div>
            <p className="text-xs text-gray-500">vs previous period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
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
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
                {oilConsumptionData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell className="font-mono">{record.aircraft}</TableCell>
                    <TableCell>{record.engine}</TableCell>
                    <TableCell>{record.flightHours}</TableCell>
                    <TableCell>{record.oilAdded}</TableCell>
                    <TableCell className="font-mono">
                      <span className={record.oilConsumption > 0.3 ? 'text-yellow-600 font-semibold' : ''}>
                        {record.oilConsumption}
                      </span>
                    </TableCell>
                    <TableCell>{record.notes || "-"}</TableCell>
                    <TableCell>
                      {record.oilConsumption > 0.3 ? (
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
