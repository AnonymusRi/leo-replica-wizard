
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, AlertCircle, Building } from "lucide-react";

export const OrganizationStatistics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Richieste Pendenti</p>
              <p className="text-2xl font-bold text-blue-600">2</p>
            </div>
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pronte per Setup</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Documentazione Richiesta</p>
              <p className="text-2xl font-bold text-orange-600">1</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Setup Questa Settimana</p>
              <p className="text-2xl font-bold text-purple-600">3</p>
            </div>
            <Building className="w-8 h-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
