
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

export const SetupInProgressTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Setup in Corso</CardTitle>
        <CardDescription>
          Organizzazioni attualmente in fase di setup
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nessun setup in corso al momento</p>
        </div>
      </CardContent>
    </Card>
  );
};
