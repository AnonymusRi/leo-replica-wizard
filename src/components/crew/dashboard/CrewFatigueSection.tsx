
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  Moon, 
  Sun, 
  Brain, 
  Activity, 
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useCrewFatigueRecords, useTodayFatigueRecord, useCreateFatigueRecord } from "@/hooks/useCrewFatigue";
import { format } from "date-fns";
import { it } from "date-fns/locale";

interface CrewFatigueSectionProps {
  crewMemberId: string;
}

export const CrewFatigueSection = ({ crewMemberId }: CrewFatigueSectionProps) => {
  const [showNewAssessment, setShowNewAssessment] = useState(false);
  const [assessmentData, setAssessmentData] = useState({
    fatigue_level: 5,
    sleep_hours: 8,
    stress_level: 3,
    workload_rating: 5,
    notes: ''
  });

  const { data: fatigueRecords = [] } = useCrewFatigueRecords(crewMemberId, 30);
  const { data: todayRecord } = useTodayFatigueRecord(crewMemberId);
  const createFatigueRecord = useCreateFatigueRecord();

  const handleSubmitAssessment = async () => {
    await createFatigueRecord.mutateAsync({
      crew_member_id: crewMemberId,
      assessment_date: format(new Date(), 'yyyy-MM-dd'),
      auto_calculated: false,
      ...assessmentData
    });
    
    setShowNewAssessment(false);
    setAssessmentData({
      fatigue_level: 5,
      sleep_hours: 8,
      stress_level: 3,
      workload_rating: 5,
      notes: ''
    });
  };

  const getFatigueLevel = (level?: number) => {
    if (!level) return { label: 'N/A', color: 'gray' };
    if (level <= 3) return { label: 'Riposato', color: 'green' };
    if (level <= 6) return { label: 'Normale', color: 'yellow' };
    if (level <= 8) return { label: 'Stanco', color: 'orange' };
    return { label: 'Molto Stanco', color: 'red' };
  };

  const getStressLevel = (level?: number) => {
    if (!level) return { label: 'N/A', color: 'gray' };
    if (level <= 3) return { label: 'Basso', color: 'green' };
    if (level <= 6) return { label: 'Normale', color: 'yellow' };
    if (level <= 8) return { label: 'Alto', color: 'orange' };
    return { label: 'Molto Alto', color: 'red' };
  };

  const averageFatigue = fatigueRecords.length > 0 
    ? fatigueRecords.reduce((sum, record) => sum + (record.fatigue_level || 0), 0) / fatigueRecords.length
    : 0;

  const averageSleep = fatigueRecords.length > 0
    ? fatigueRecords.reduce((sum, record) => sum + (record.sleep_hours || 0), 0) / fatigueRecords.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Today's Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Moon className="w-4 h-4 mr-2" />
              Livello Fatica Oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayRecord ? (
              <div>
                <div className="text-2xl font-bold mb-1">
                  {todayRecord.fatigue_level}/10
                </div>
                <Badge variant="secondary" className={`bg-${getFatigueLevel(todayRecord.fatigue_level).color}-100 text-${getFatigueLevel(todayRecord.fatigue_level).color}-800`}>
                  {getFatigueLevel(todayRecord.fatigue_level).label}
                </Badge>
              </div>
            ) : (
              <div className="text-gray-500">
                <div className="text-2xl font-bold mb-1">-</div>
                <p className="text-sm">Non valutato</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Sun className="w-4 h-4 mr-2" />
              Ore di Sonno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {todayRecord?.sleep_hours || '-'}h
            </div>
            <p className="text-sm text-gray-500">
              Media: {averageSleep.toFixed(1)}h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Stress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {todayRecord?.stress_level || '-'}/10
            </div>
            {todayRecord?.stress_level && (
              <Badge variant="secondary" className={`bg-${getStressLevel(todayRecord.stress_level).color}-100 text-${getStressLevel(todayRecord.stress_level).color}-800`}>
                {getStressLevel(todayRecord.stress_level).label}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Carico di Lavoro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {todayRecord?.workload_rating || '-'}/10
            </div>
            <p className="text-sm text-gray-500">
              Valutazione soggettiva
            </p>
          </CardContent>
        </Card>
      </div>

      {/* New Assessment */}
      {!todayRecord && !showNewAssessment && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Moon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium mb-2">Valutazione Fatica di Oggi</h3>
              <p className="text-gray-600 mb-4">
                Non hai ancora completato la valutazione della fatica per oggi.
              </p>
              <Button onClick={() => setShowNewAssessment(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Compila Valutazione
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {showNewAssessment && (
        <Card>
          <CardHeader>
            <CardTitle>Nuova Valutazione Fatica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Livello di Fatica (1 = molto riposato, 10 = estremamente stanco)
              </Label>
              <Slider
                value={[assessmentData.fatigue_level]}
                onValueChange={(value) => setAssessmentData({ ...assessmentData, fatigue_level: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Molto riposato</span>
                <span className="font-medium">{assessmentData.fatigue_level}/10</span>
                <span>Estremamente stanco</span>
              </div>
            </div>

            <div>
              <Label htmlFor="sleep-hours">Ore di Sonno (ultima notte)</Label>
              <Input
                id="sleep-hours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={assessmentData.sleep_hours}
                onChange={(e) => setAssessmentData({ ...assessmentData, sleep_hours: parseFloat(e.target.value) })}
              />
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Livello di Stress (1 = molto rilassato, 10 = molto stressato)
              </Label>
              <Slider
                value={[assessmentData.stress_level]}
                onValueChange={(value) => setAssessmentData({ ...assessmentData, stress_level: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Molto rilassato</span>
                <span className="font-medium">{assessmentData.stress_level}/10</span>
                <span>Molto stressato</span>
              </div>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">
                Carico di Lavoro Percepito (1 = molto leggero, 10 = eccessivo)
              </Label>
              <Slider
                value={[assessmentData.workload_rating]}
                onValueChange={(value) => setAssessmentData({ ...assessmentData, workload_rating: value[0] })}
                max={10}
                min={1}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Molto leggero</span>
                <span className="font-medium">{assessmentData.workload_rating}/10</span>
                <span>Eccessivo</span>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Note (opzionale)</Label>
              <Textarea
                id="notes"
                value={assessmentData.notes}
                onChange={(e) => setAssessmentData({ ...assessmentData, notes: e.target.value })}
                placeholder="Eventuali note sulla tua condizione oggi..."
                rows={3}
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={handleSubmitAssessment} disabled={createFatigueRecord.isPending}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {createFatigueRecord.isPending ? 'Salvando...' : 'Salva Valutazione'}
              </Button>
              <Button variant="outline" onClick={() => setShowNewAssessment(false)}>
                Annulla
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Assessments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Storico Valutazioni</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {fatigueRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {format(new Date(record.assessment_date), "dd MMMM yyyy", { locale: it })}
                  </div>
                  <div className="text-sm text-gray-600">
                    Fatica: {record.fatigue_level}/10 • 
                    Sonno: {record.sleep_hours}h • 
                    Stress: {record.stress_level}/10
                  </div>
                  {record.notes && (
                    <div className="text-sm text-gray-500 mt-1">{record.notes}</div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`bg-${getFatigueLevel(record.fatigue_level).color}-100 text-${getFatigueLevel(record.fatigue_level).color}-800`}
                  >
                    {getFatigueLevel(record.fatigue_level).label}
                  </Badge>
                  {record.auto_calculated && (
                    <Badge variant="outline">Auto</Badge>
                  )}
                </div>
              </div>
            ))}
            
            {fatigueRecords.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Moon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>Nessuna valutazione della fatica registrata</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
