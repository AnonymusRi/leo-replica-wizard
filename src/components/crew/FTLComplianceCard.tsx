
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Calendar, BarChart3, TrendingUp } from "lucide-react";
import type { FlightTimeLimit } from '@/types/crew';

interface FTLComplianceCardProps {
  pilotName: string;
  compliance: {
    compliant: boolean;
    warnings: string[];
    hours?: {
      dailyHours: number;
      weeklyHours: number;
      monthlyHours: number;
      yearlyHours: number;
    };
  };
  limits: FlightTimeLimit;
}

export const FTLComplianceCard = ({ pilotName, compliance, limits }: FTLComplianceCardProps) => {
  if (compliance.compliant) return null;

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-red-800">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Avviso Compliance FTL - {pilotName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {compliance.warnings.map((warning, index) => (
            <div key={index} className="flex items-center text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              {warning}
            </div>
          ))}
        </div>

        {compliance.hours && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Clock className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Giornaliere</span>
              </div>
              <div className={`text-lg font-bold ${compliance.hours.dailyHours > limits.daily_limit ? 'text-red-600' : 'text-green-600'}`}>
                {compliance.hours.dailyHours.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-500">
                Limite: {limits.daily_limit}h
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Settimanali</span>
              </div>
              <div className={`text-lg font-bold ${compliance.hours.weeklyHours > limits.weekly_limit ? 'text-red-600' : 'text-green-600'}`}>
                {compliance.hours.weeklyHours.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-500">
                Limite: {limits.weekly_limit}h
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <BarChart3 className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Mensili</span>
              </div>
              <div className={`text-lg font-bold ${compliance.hours.monthlyHours > limits.monthly_limit ? 'text-red-600' : 'text-green-600'}`}>
                {compliance.hours.monthlyHours.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-500">
                Limite: {limits.monthly_limit}h
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-4 h-4 mr-1 text-gray-500" />
                <span className="text-xs font-medium text-gray-600">Annuali</span>
              </div>
              <div className={`text-lg font-bold ${compliance.hours.yearlyHours > limits.yearly_limit ? 'text-red-600' : 'text-green-600'}`}>
                {compliance.hours.yearlyHours.toFixed(1)}h
              </div>
              <div className="text-xs text-gray-500">
                Limite: {limits.yearly_limit}h
              </div>
            </div>
          </div>
        )}

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
          <div className="flex items-start">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800">
              <div className="font-medium mb-1">Azione Richiesta</div>
              <div>Il pilota ha superato i limiti FTL regolamentari. Verificare immediatamente la pianificazione e assicurarsi del rispetto dei periodi di riposo minimi.</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
