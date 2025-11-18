
-- Create table for crew certifications
CREATE TABLE public.crew_certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crew_member_id UUID REFERENCES public.crew_members(id) ON DELETE CASCADE,
  certification_type TEXT NOT NULL,
  aircraft_type TEXT,
  certificate_number TEXT,
  issue_date DATE NOT NULL,
  expiry_date DATE,
  issuing_authority TEXT DEFAULT 'ENAC',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for aircraft certification requirements
CREATE TABLE public.aircraft_certification_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  required_certification_type TEXT NOT NULL,
  is_mandatory BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for ENAC notifications when forcing assignments with expired certifications
CREATE TABLE public.enac_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crew_member_id UUID REFERENCES public.crew_members(id),
  flight_id UUID REFERENCES public.flights(id),
  expired_certification_type TEXT NOT NULL,
  justification TEXT NOT NULL,
  notification_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  sent_by TEXT,
  status TEXT DEFAULT 'pending',
  enac_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create RLS policies
ALTER TABLE public.crew_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aircraft_certification_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enac_notifications ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (you can restrict these later based on user roles)
CREATE POLICY "Allow all operations on crew_certifications" ON public.crew_certifications FOR ALL USING (true);
CREATE POLICY "Allow all operations on aircraft_certification_requirements" ON public.aircraft_certification_requirements FOR ALL USING (true);
CREATE POLICY "Allow all operations on enac_notifications" ON public.enac_notifications FOR ALL USING (true);

-- Add indexes for better performance
CREATE INDEX idx_crew_certifications_crew_member_id ON public.crew_certifications(crew_member_id);
CREATE INDEX idx_crew_certifications_aircraft_type ON public.crew_certifications(aircraft_type);
CREATE INDEX idx_aircraft_certification_requirements_aircraft_id ON public.aircraft_certification_requirements(aircraft_id);

-- Add trigger for updated_at
CREATE TRIGGER update_crew_certifications_updated_at
  BEFORE UPDATE ON public.crew_certifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
