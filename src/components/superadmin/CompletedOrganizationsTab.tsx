
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export const CompletedOrganizationsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup Completati</CardTitle>
        <CardDescription>
          Organizzazioni con setup completato di recente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">AlidaSoft Aviation</div>
                <div className="text-sm text-gray-500">Setup completato - Licenza Demo</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Attivo</Badge>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">Alidaunia</div>
                <div className="text-sm text-gray-500">Setup completato - Licenza Attiva</div>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">Attivo</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
