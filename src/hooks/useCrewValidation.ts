
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CrewValidationResult } from '@/types/certification';
import { format, isAfter, startOfDay, endOfDay } from 'date-fns';

export const useCrewValidation = (crewMemberId: string, aircraftId: string, flightDate: string) => {
  return useQuery({
    queryKey: ['crew-validation', crewMemberId, aircraftId, flightDate],
    queryFn: async (): Promise<CrewValidationResult> => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const expiredCertifications: any[] = [];
      
      // Get aircraft certification requirements
      const { data: requirements, error: reqError } = await supabase
        .from('aircraft_certification_requirements')
        .select('*')
        .eq('aircraft_id', aircraftId);
      
      if (reqError) throw reqError;
      
      // Get crew certifications
      const { data: certifications, error: certError } = await supabase
        .from('crew_certifications')
        .select('*')
        .eq('crew_member_id', crewMemberId)
        .eq('is_active', true);
      
      if (certError) throw certError;
      
      // Check aircraft-specific certifications
      const aircraftInfo = await supabase
        .from('aircraft')
        .select('aircraft_type')
        .eq('id', aircraftId)
        .single();
      
      if (aircraftInfo.error) throw aircraftInfo.error;
      
      // Validate required certifications
      for (const requirement of requirements || []) {
        const relevantCerts = certifications?.filter(cert => 
          cert.certification_type === requirement.required_certification_type &&
          (cert.aircraft_type === aircraftInfo.data.aircraft_type || !cert.aircraft_type)
        ) || [];
        
        if (relevantCerts.length === 0) {
          if (requirement.is_mandatory) {
            errors.push(`Certificazione mancante: ${requirement.required_certification_type}`);
          } else {
            warnings.push(`Certificazione consigliata mancante: ${requirement.required_certification_type}`);
          }
          continue;
        }
        
        // Check if certifications are expired
        const today = new Date();
        for (const cert of relevantCerts) {
          if (cert.expiry_date && isAfter(today, new Date(cert.expiry_date))) {
            expiredCertifications.push(cert);
            if (requirement.is_mandatory) {
              errors.push(`Certificazione scaduta: ${cert.certification_type} (scaduta il ${format(new Date(cert.expiry_date), 'dd/MM/yyyy')})`);
            } else {
              warnings.push(`Certificazione consigliata scaduta: ${cert.certification_type}`);
            }
          }
        }
      }
      
      // Check daily flight time limits
      const flightDateStart = startOfDay(new Date(flightDate));
      const flightDateEnd = endOfDay(new Date(flightDate));
      
      const { data: dailyFlights, error: flightError } = await supabase
        .from('crew_flight_assignments')
        .select(`
          *,
          flight:flights(departure_time, arrival_time)
        `)
        .eq('crew_member_id', crewMemberId)
        .gte('duty_start_time', flightDateStart.toISOString())
        .lte('duty_start_time', flightDateEnd.toISOString());
      
      if (flightError) throw flightError;
      
      // Calculate total daily flight hours
      let totalDailyHours = 0;
      dailyFlights?.forEach(assignment => {
        if (assignment.duty_time_hours) {
          totalDailyHours += Number(assignment.duty_time_hours);
        }
      });
      
      // Check against daily limits (assuming 14 hours max daily duty time as per EASA regulations)
      const maxDailyHours = 14;
      if (totalDailyHours >= maxDailyHours) {
        errors.push(`Limite ore giornaliere raggiunto: ${totalDailyHours}/${maxDailyHours} ore`);
      } else if (totalDailyHours > maxDailyHours * 0.8) {
        warnings.push(`Vicino al limite ore giornaliere: ${totalDailyHours}/${maxDailyHours} ore`);
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        expiredCertifications,
        canForce: expiredCertifications.length > 0 && errors.some(e => e.includes('scaduta'))
      };
    },
    enabled: !!crewMemberId && !!aircraftId && !!flightDate
  });
};
