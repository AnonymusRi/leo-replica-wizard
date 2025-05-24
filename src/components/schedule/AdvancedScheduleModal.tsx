
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Trash } from "lucide-react";

interface AdvancedScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdvancedScheduleModal = ({ isOpen, onClose }: AdvancedScheduleModalProps) => {
  const [formData, setFormData] = useState({
    fromDate: "20 Aug 2023",
    toDate: "",
    blockHours: "250.00",
    aircraft: "SP-OCT",
    rotation: "weekly",
    icaoType: "Non-scheduled",
    tags: ""
  });

  const [repeatDays, setRepeatDays] = useState({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: true,
    Sun: true
  });

  const [scheduleEntries, setScheduleEntries] = useState([
    {
      dayShift: "N/A",
      flightNo: "TEST03",
      arcid: "",
      std: "04:00",
      adep: "EDDS",
      ades: "LEMG",
      sta: "06:15",
      altn: "",
      distance: "939",
      codeShareFlightNo: "",
      ferry: false
    },
    {
      dayShift: "+0",
      flightNo: "TEST04",
      arcid: "",
      std: "07:15",
      adep: "LEMG",
      ades: "EDDF",
      sta: "09:30",
      altn: "",
      distance: "982",
      codeShareFlightNo: "",
      ferry: false
    }
  ]);

  const tags = [
    { name: "TEST_TAG", color: "bg-cyan-500" },
    { name: "TEST_TAG2", color: "bg-red-500" },
    { name: "TEST_TAG3", color: "bg-yellow-500" }
  ];

  const addScheduleEntry = () => {
    setScheduleEntries([...scheduleEntries, {
      dayShift: "+0",
      flightNo: "",
      arcid: "",
      std: "",
      adep: "",
      ades: "",
      sta: "",
      altn: "",
      distance: "",
      codeShareFlightNo: "",
      ferry: false
    }]);
  };

  const removeScheduleEntry = (index: number) => {
    setScheduleEntries(scheduleEntries.filter((_, i) => i !== index));
  };

  const updateScheduleEntry = (index: number, field: string, value: any) => {
    const updated = [...scheduleEntries];
    updated[index] = { ...updated[index], [field]: value };
    setScheduleEntries(updated);
  };

  const handleSubmit = () => {
    console.log("Creating schedule with data:", formData, scheduleEntries);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>New Schedule</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Form Fields */}
          <div className="grid grid-cols-6 gap-4">
            <div>
              <Label>From</Label>
              <Input
                value={formData.fromDate}
                onChange={(e) => setFormData(prev => ({ ...prev, fromDate: e.target.value }))}
              />
            </div>
            <div>
              <Label>To date | Block hours</Label>
              <Input
                placeholder="250.00"
                value={formData.blockHours}
                onChange={(e) => setFormData(prev => ({ ...prev, blockHours: e.target.value }))}
              />
            </div>
            <div>
              <Label>Aircraft</Label>
              <Select value={formData.aircraft} onValueChange={(value) => setFormData(prev => ({ ...prev, aircraft: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP-OCT">SP-OCT</SelectItem>
                  <SelectItem value="SP-APR">SP-APR</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rotation</Label>
              <Select value={formData.rotation} onValueChange={(value) => setFormData(prev => ({ ...prev, rotation: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">weekly</SelectItem>
                  <SelectItem value="daily">daily</SelectItem>
                  <SelectItem value="monthly">monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>ICAO Type</Label>
              <Select value={formData.icaoType} onValueChange={(value) => setFormData(prev => ({ ...prev, icaoType: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Non-scheduled">Non-scheduled</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tags</Label>
              <Input
                placeholder="—"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex items-center space-x-2">
            {tags.map((tag) => (
              <Badge key={tag.name} className={`${tag.color} text-white`}>
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Repeat Schedule */}
          <div>
            <Label className="text-base font-medium">Repeat schedule on</Label>
            <div className="flex items-center space-x-4 mt-2">
              {Object.entries(repeatDays).map(([day, checked]) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(checked) => setRepeatDays(prev => ({ ...prev, [day]: !!checked }))}
                  />
                  <span className="text-sm">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule Table */}
          <div>
            <Label className="text-base font-medium">Schedule</Label>
            <div className="border rounded-lg mt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day Shift</TableHead>
                    <TableHead>Flight No</TableHead>
                    <TableHead>ARCID</TableHead>
                    <TableHead>STD</TableHead>
                    <TableHead>ADEP</TableHead>
                    <TableHead>ADES</TableHead>
                    <TableHead>STA</TableHead>
                    <TableHead>ALTN</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Code Share Flight No.</TableHead>
                    <TableHead>Ferry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleEntries.map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Select
                          value={entry.dayShift}
                          onValueChange={(value) => updateScheduleEntry(index, "dayShift", value)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="N/A">N/A</SelectItem>
                            <SelectItem value="+0">+0</SelectItem>
                            <SelectItem value="+1">+1</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.flightNo}
                          onChange={(e) => updateScheduleEntry(index, "flightNo", e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.arcid}
                          onChange={(e) => updateScheduleEntry(index, "arcid", e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="time"
                          value={entry.std}
                          onChange={(e) => updateScheduleEntry(index, "std", e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.adep}
                          onChange={(e) => updateScheduleEntry(index, "adep", e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.ades}
                          onChange={(e) => updateScheduleEntry(index, "ades", e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="time"
                          value={entry.sta}
                          onChange={(e) => updateScheduleEntry(index, "sta", e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.altn}
                          onChange={(e) => updateScheduleEntry(index, "altn", e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.distance}
                          onChange={(e) => updateScheduleEntry(index, "distance", e.target.value)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={entry.codeShareFlightNo}
                          onChange={(e) => updateScheduleEntry(index, "codeShareFlightNo", e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={entry.ferry}
                          onCheckedChange={(checked) => updateScheduleEntry(index, "ferry", !!checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={addScheduleEntry}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeScheduleEntry(index)}
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              CANCEL
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700"
            >
              ADD SCHEDULE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
