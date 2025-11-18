
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Clock, Users, Loader2 } from "lucide-react";
import { useScheduleVersions, useCreateScheduleVersion, useActivateScheduleVersion } from "@/hooks/useScheduleVersions";
import { useClients } from "@/hooks/useClients";
import { toast } from "sonner";
import { format } from "date-fns";

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionModal = ({ isOpen, onClose }: VersionModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client_id: "",
    created_by: "Current User" // In a real app, this would be the authenticated user
  });

  const { data: versions = [], isLoading: versionsLoading } = useScheduleVersions();
  const { data: clients = [] } = useClients();
  const createVersion = useCreateScheduleVersion();
  const activateVersion = useActivateScheduleVersion();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please provide a version name");
      return;
    }

    try {
      // Calculate next version number
      const maxVersion = Math.max(...versions.map(v => v.version_number), 0);
      
      await createVersion.mutateAsync({
        ...formData,
        version_number: maxVersion + 1,
        is_active: false
      });

      toast.success("Schedule version created successfully");
      setFormData({
        name: "",
        description: "",
        client_id: "",
        created_by: "Current User"
      });
    } catch (error) {
      console.error("Error creating version:", error);
    }
  };

  const handleActivate = async (versionId: string) => {
    try {
      await activateVersion.mutateAsync(versionId);
    } catch (error) {
      console.error("Error activating version:", error);
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Schedule Version Management</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-y-auto">
          {/* Create New Version */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Create New Version
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label htmlFor="name">Version Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Formula 1 Europe v2.1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="client">Client</Label>
                  <Select 
                    value={formData.client_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, client_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select client (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.company_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the changes in this version..."
                    rows={3}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={createVersion.isPending}
                >
                  {createVersion.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Version"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Version Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Version Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{versions.length}</div>
                  <div className="text-sm text-gray-600">Total Versions</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {versions.filter(v => v.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Version</div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">
                    {versions.filter(v => !v.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Draft Versions</div>
                </div>

                {versions.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600">Latest Version</div>
                    <div className="font-medium">
                      {Math.max(...versions.map(v => v.version_number)).toFixed(1)}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Version List */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Versions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {versionsLoading ? (
                <div className="p-4 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </div>
              ) : versions.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No versions created yet
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {versions.slice(0, 5).map((version) => (
                    <div key={version.id} className="p-3 border-b last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">{version.name}</div>
                        <Badge className={getStatusColor(version.is_active)}>
                          {version.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            "Draft"
                          )}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>v{version.version_number}</div>
                        <div>{format(new Date(version.created_at), 'dd/MM/yyyy HH:mm')}</div>
                        {version.client && (
                          <div>Client: {version.client.company_name}</div>
                        )}
                      </div>

                      {!version.is_active && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => handleActivate(version.id)}
                          disabled={activateVersion.isPending}
                        >
                          {activateVersion.isPending ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            "Activate"
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full Version Table */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>All Schedule Versions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Version</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {versions.map((version) => (
                  <TableRow key={version.id}>
                    <TableCell className="font-medium">v{version.version_number}</TableCell>
                    <TableCell>{version.name}</TableCell>
                    <TableCell>{version.client?.company_name || "-"}</TableCell>
                    <TableCell>{format(new Date(version.created_at), 'dd/MM/yyyy HH:mm')}</TableCell>
                    <TableCell>{version.created_by || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(version.is_active)}>
                        {version.is_active ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {!version.is_active && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivate(version.id)}
                          disabled={activateVersion.isPending}
                        >
                          Activate
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
