
-- Enable RLS policies for crew_flight_assignments table
CREATE POLICY "Allow insert crew flight assignments" ON public.crew_flight_assignments
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select crew flight assignments" ON public.crew_flight_assignments
FOR SELECT USING (true);

CREATE POLICY "Allow update crew flight assignments" ON public.crew_flight_assignments
FOR UPDATE USING (true);

CREATE POLICY "Allow delete crew flight assignments" ON public.crew_flight_assignments
FOR DELETE USING (true);

-- Enable RLS policies for pilot_schedule table  
CREATE POLICY "Allow insert pilot schedules" ON public.pilot_schedule
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow select pilot schedules" ON public.pilot_schedule
FOR SELECT USING (true);

CREATE POLICY "Allow update pilot schedules" ON public.pilot_schedule
FOR UPDATE USING (true);

CREATE POLICY "Allow delete pilot schedules" ON public.pilot_schedule
FOR DELETE USING (true);

-- Also ensure training_records has proper policies for FTL training hours
CREATE POLICY "Allow select training records" ON public.training_records
FOR SELECT USING (true);

CREATE POLICY "Allow insert training records" ON public.training_records
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update training records" ON public.training_records
FOR UPDATE USING (true);

CREATE POLICY "Allow delete training records" ON public.training_records
FOR DELETE USING (true);
