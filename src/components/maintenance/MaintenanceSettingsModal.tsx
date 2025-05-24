
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Settings, 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Save,
  TestTube
} from "lucide-react";

interface MaintenanceSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MaintenanceSettingsModal = ({ open, onOpenChange }: MaintenanceSettingsModalProps) => {
  const [apiSettings, setApiSettings] = useState({
    baseUrl: '',
    apiKey: '',
    clientId: '',
    clientSecret: '',
    environment: 'production'
  });

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    // Simulate API test
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.5 ? 'success' : 'error');
    }, 2000);
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving API settings:', apiSettings);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Maintenance API Integration Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="api-config" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="api-config">API Configuration</TabsTrigger>
            <TabsTrigger value="sync-settings">Sync Settings</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="api-config" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="w-4 h-4 mr-2" />
                  API Credentials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="baseUrl">API Base URL</Label>
                    <Input
                      id="baseUrl"
                      placeholder="https://api.maintenance-software.com/v1"
                      value={apiSettings.baseUrl}
                      onChange={(e) => setApiSettings({...apiSettings, baseUrl: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <select 
                      className="w-full p-2 border rounded"
                      value={apiSettings.environment}
                      onChange={(e) => setApiSettings({...apiSettings, environment: e.target.value})}
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your API key"
                      value={apiSettings.apiKey}
                      onChange={(e) => setApiSettings({...apiSettings, apiKey: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="clientId">Client ID</Label>
                    <Input
                      id="clientId"
                      placeholder="Client ID"
                      value={apiSettings.clientId}
                      onChange={(e) => setApiSettings({...apiSettings, clientId: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="clientSecret">Client Secret</Label>
                  <Input
                    id="clientSecret"
                    type="password"
                    placeholder="Client Secret"
                    value={apiSettings.clientSecret}
                    onChange={(e) => setApiSettings({...apiSettings, clientSecret: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <Button 
                    onClick={handleTestConnection}
                    disabled={connectionStatus === 'testing'}
                    variant="outline"
                  >
                    <TestTube className="w-4 h-4 mr-2" />
                    {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                  </Button>

                  {connectionStatus === 'success' && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}

                  {connectionStatus === 'error' && (
                    <Badge className="bg-red-100 text-red-800">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Connection Failed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync-settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Synchronization Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Auto Sync Interval</Label>
                    <select className="w-full p-2 border rounded">
                      <option value="15">Every 15 minutes</option>
                      <option value="30">Every 30 minutes</option>
                      <option value="60">Every hour</option>
                      <option value="360">Every 6 hours</option>
                      <option value="1440">Daily</option>
                    </select>
                  </div>
                  <div>
                    <Label>Notification Days Before Expiry</Label>
                    <Input type="number" defaultValue="30" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sync Data Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Aircraft Details',
                      'TAH/TAC Hours',
                      'Engine Hours',
                      'Maintenance Records',
                      'Document Expiry',
                      'Hold Item Lists',
                      'Oil Consumption',
                      'Compliance Reports'
                    ].map((item) => (
                      <label key={item} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Integration Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Follow these steps to integrate with your maintenance management software
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">1. API Endpoints Required</h4>
                    <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                      <div>GET /aircraft - Fleet details</div>
                      <div>GET /aircraft/{'{id}'}/hours - TAH/TAC data</div>
                      <div>GET /maintenance/records - Maintenance history</div>
                      <div>GET /documents/expiry - Document status</div>
                      <div>GET /hold-items - Aircraft limitations</div>
                      <div>POST /oil-consumption - Oil consumption reports</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold">2. Authentication</h4>
                    <p className="text-sm text-gray-600">
                      Use API Key in header: Authorization: Bearer {'{your-api-key}'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">3. Data Format</h4>
                    <p className="text-sm text-gray-600">
                      All requests and responses should be in JSON format with UTC timestamps
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold">4. Webhook Support</h4>
                    <p className="text-sm text-gray-600">
                      Configure webhooks for real-time updates on document expiry and maintenance due dates
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
