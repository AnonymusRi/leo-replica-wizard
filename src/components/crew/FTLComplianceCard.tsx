
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

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
  limits: {
    daily_limit: number;
    weekly_limit: number;
    monthly_limit: number;
    yearly_limit: number;
  };
}

export const FTLComplianceCard = ({ pilotName, compliance, limits }: FTLComplianceCardProps) => {
  const { hours } = compliance;
  
  if (!hours) return null;

  const getProgressColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 100) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const periods = [
    { label: 'Oggi', current: hours.dailyHours, limit: limits.daily_limit },
    { label: 'Settimana', current: hours.weeklyHours, limit: limits.weekly_limit },
    { label: 'Mese', current: hours.monthlyHours, limit: limits.monthly_limit },
    { label: 'Anno', current: hours.yearlyHours, limit: limits.yearly_limit }
  ];

  return (
    <Card className={`border-2 ${compliance.compliant ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
      <CardHeader className="pb-3">
        <CardTitle className={`text-lg flex items-center ${compliance.compliant ? 'text-green-800' : 'text-red-800'}`}>
          {compliance.compliant ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 mr-2" />
          )}
          Status FTL - {pilotName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress bars */}
        <div className="grid grid-cols-2 gap-4">
          {periods.map((period) => (
            <div key={period.label} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{period.label}</span>
                <Badge variant={period.current > period.limit ? "destructive" : "secondary"}>
                  {period.current.toFixed(1)}h / {period.limit}h
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${getProgressColor(period.current, period.limit)}`}
                  style={{ width: `${Math.min((period.current / period.limit) * 100, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Warnings */}
        {!compliance.compliant && (
          <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1" />
              Violazioni Rilevate
            </h4>
            <ul className="text-sm text-red-700 space-y-1">
              {compliance.warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Status summary */}
        <div className={`p-3 rounded-lg ${compliance.compliant ? 'bg-green-100 border border-green-200' : 'bg-red-100 border border-red-200'}`}>
          <div className={`font-semibold ${compliance.compliant ? 'text-green-800' : 'text-red-800'}`}>
            {compliance.compliant ? '✅ Compliance OK' : '❌ Intervento Richiesto'}
          </div>
          <div className={`text-sm mt-1 ${compliance.compliant ? 'text-green-700' : 'text-red-700'}`}>
            {compliance.compliant 
              ? 'Tutti i limiti rispettati'
              : 'Uno o più limiti FTL sono stati superati'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
