
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { AircraftDocument, AircraftHoldItem } from "@/types/aircraft";

interface CriticalItemsCardProps {
  expiringDocuments: AircraftDocument[];
  holdItems: AircraftHoldItem[];
}

export const CriticalItemsCard = ({ expiringDocuments, holdItems }: CriticalItemsCardProps) => {
  const activeHoldItems = holdItems.filter(item => item.status === 'active');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Critical Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {expiringDocuments.slice(0, 3).map((doc) => (
          <div key={doc.id} className="flex justify-between items-center p-2 bg-orange-50 rounded">
            <div>
              <div className="font-medium text-sm">{doc.document_name}</div>
              <div className="text-xs text-gray-500">{doc.aircraft?.tail_number}</div>
            </div>
            <div className="text-right">
              <Badge variant={doc.status === 'expired' ? 'destructive' : 'secondary'}>
                {doc.status === 'expired' ? 'Expired' : 'Expiring Soon'}
              </Badge>
              {doc.expiry_date && (
                <div className="text-xs text-gray-500 mt-1">
                  {format(new Date(doc.expiry_date), 'dd/MM/yyyy')}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {activeHoldItems.slice(0, 2).map((item) => (
          <div key={item.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
            <div>
              <div className="font-medium text-sm">{item.item_reference}</div>
              <div className="text-xs text-gray-500">{item.aircraft?.tail_number}</div>
            </div>
            <Badge variant="outline" className="bg-yellow-100">
              {item.status}
            </Badge>
          </div>
        ))}
        
        {expiringDocuments.length === 0 && activeHoldItems.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
            No critical items found
          </div>
        )}
      </CardContent>
    </Card>
  );
};
