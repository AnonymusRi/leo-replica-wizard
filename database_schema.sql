-- ============================================
-- LEO REPLICA WIZARD - PostgreSQL Schema
-- Converted from Supabase to PostgreSQL
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE aircraft_status AS ENUM ('available', 'maintenance', 'aog', 'retired');
CREATE TYPE crew_position AS ENUM ('captain', 'first_officer', 'cabin_crew', 'mechanic');
CREATE TYPE flight_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled', 'delayed');
CREATE TYPE maintenance_status AS ENUM ('scheduled', 'in_progress', 'completed', 'overdue');
CREATE TYPE user_role AS ENUM ('super_admin', 'organization_admin', 'module_admin', 'user', 'crew_member', 'admin');

-- ============================================
-- TABLES
-- ============================================

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    subscription_status VARCHAR(50) NOT NULL DEFAULT 'active',
    subscription_end_date TIMESTAMP,
    active_modules JSONB,
    settings JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Profiles (users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY,
    email VARCHAR(255),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Roles
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    module_permissions JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, organization_id)
);

-- Super Admins
CREATE TABLE super_admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    user_id UUID,
    phone_number VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Super Admin Sessions
CREATE TABLE super_admin_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_at TIMESTAMP,
    logout_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Aircraft
CREATE TABLE aircraft (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    tail_number VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    aircraft_type VARCHAR(50) NOT NULL,
    year_manufactured INTEGER,
    max_passengers INTEGER,
    home_base VARCHAR(10),
    status aircraft_status NOT NULL DEFAULT 'available',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Aircraft Technical Data
CREATE TABLE aircraft_technical_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    airframe_tac INTEGER,
    airframe_tah_hours INTEGER,
    airframe_tah_minutes INTEGER,
    engine_1_serial_number VARCHAR(100),
    engine_1_start_date DATE,
    engine_1_tac INTEGER,
    engine_1_tah_hours INTEGER,
    engine_1_tah_minutes INTEGER,
    engine_2_serial_number VARCHAR(100),
    engine_2_start_date DATE,
    engine_2_tac INTEGER,
    engine_2_tah_hours INTEGER,
    engine_2_tah_minutes INTEGER,
    apu_serial_number VARCHAR(100),
    apu_start_date DATE,
    apu_tac INTEGER,
    apu_tah_hours INTEGER,
    apu_tah_minutes INTEGER,
    last_updated TIMESTAMP,
    updated_by UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aircraft Documents
CREATE TABLE aircraft_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    issuing_authority VARCHAR(255),
    file_path TEXT,
    status VARCHAR(50),
    is_required_for_dispatch BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aircraft Certification Requirements
CREATE TABLE aircraft_certification_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    required_certification_type VARCHAR(100) NOT NULL,
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aircraft Hold Items
CREATE TABLE aircraft_hold_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    item_reference VARCHAR(100) NOT NULL,
    item_description TEXT NOT NULL,
    mel_reference VARCHAR(100),
    limitation_description TEXT,
    status VARCHAR(50),
    date_applied DATE,
    applied_by UUID,
    resolution_date DATE,
    resolution_description TEXT,
    ata_chapter VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aircraft Maintenance Limits
CREATE TABLE aircraft_maintenance_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    inspection_type VARCHAR(100),
    flight_hours_limit INTEGER,
    flight_cycles_limit INTEGER,
    calendar_limit_date DATE,
    next_inspection_hours INTEGER,
    next_inspection_cycles INTEGER,
    next_inspection_date DATE,
    warning_threshold_days INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Aircraft Fees
CREATE TABLE aircraft_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_type VARCHAR(50) NOT NULL,
    fee_name VARCHAR(255) NOT NULL,
    fee_type VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    calculation_method VARCHAR(50),
    valid_from DATE,
    valid_until DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Airports
CREATE TABLE airports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    icao_code VARCHAR(4) NOT NULL UNIQUE,
    iata_code VARCHAR(3),
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    elevation INTEGER,
    timezone VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Airport Directory
CREATE TABLE airport_directory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    airport_code VARCHAR(10) NOT NULL,
    airport_name VARCHAR(255) NOT NULL,
    contact_info JSONB,
    opening_hours JSONB,
    customs_hours JSONB,
    immigration_hours JSONB,
    fuel_suppliers JSONB,
    handling_companies JSONB,
    catering_suppliers JSONB,
    available_services JSONB,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Airport Fees
CREATE TABLE airport_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    airport_code VARCHAR(10) NOT NULL,
    fee_name VARCHAR(255) NOT NULL,
    fee_type VARCHAR(100) NOT NULL,
    aircraft_category VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
    valid_from DATE,
    valid_until DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crew Members
CREATE TABLE crew_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position crew_position NOT NULL,
    license_number VARCHAR(100),
    license_expiry DATE,
    medical_expiry DATE,
    base_location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crew Profiles
CREATE TABLE crew_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE UNIQUE,
    avatar_url TEXT,
    bio TEXT,
    personal_notes TEXT,
    preferences JSONB,
    notification_settings JSONB,
    social_links JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crew Certifications
CREATE TABLE crew_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    certification_type VARCHAR(100) NOT NULL,
    aircraft_type VARCHAR(50),
    certificate_number VARCHAR(100),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    issuing_authority VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crew Qualifications
CREATE TABLE crew_qualifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    qualification_type VARCHAR(100) NOT NULL,
    aircraft_type VARCHAR(50) NOT NULL,
    certificate_number VARCHAR(100),
    issue_date DATE NOT NULL,
    expiry_date DATE,
    authority VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crew Statistics
CREATE TABLE crew_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    month_year VARCHAR(7) NOT NULL,
    total_flights INTEGER DEFAULT 0,
    total_sectors INTEGER DEFAULT 0,
    total_flight_hours DECIMAL(10,2) DEFAULT 0,
    total_duty_hours DECIMAL(10,2) DEFAULT 0,
    night_hours DECIMAL(10,2) DEFAULT 0,
    simulator_hours DECIMAL(10,2) DEFAULT 0,
    training_hours DECIMAL(10,2) DEFAULT 0,
    days_off INTEGER DEFAULT 0,
    ftl_violations INTEGER DEFAULT 0,
    performance_rating DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(crew_member_id, month_year)
);

-- Crew Fatigue Records
CREATE TABLE crew_fatigue_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    sleep_hours DECIMAL(4,2),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 10),
    workload_rating INTEGER CHECK (workload_rating >= 1 AND workload_rating <= 10),
    fatigue_level INTEGER CHECK (fatigue_level >= 1 AND fatigue_level <= 10),
    auto_calculated BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crew Messages
CREATE TABLE crew_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    sender_name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50),
    priority VARCHAR(20),
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crew Auth Sessions
CREATE TABLE crew_auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    is_mobile BOOLEAN,
    last_activity TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flights
CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE SET NULL,
    flight_number VARCHAR(20) NOT NULL,
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    passenger_count INTEGER,
    status flight_status NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Flight Legs
CREATE TABLE flight_legs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    leg_number INTEGER NOT NULL,
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    distance DECIMAL(10,2),
    fuel_required DECIMAL(10,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Flight Crew
CREATE TABLE flight_crew (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    position crew_position NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Flight Assignments
CREATE TABLE flight_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    position VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crew Flight Assignments
CREATE TABLE crew_flight_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    position VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID,
    reporting_time TIMESTAMP,
    duty_start_time TIMESTAMP,
    duty_end_time TIMESTAMP,
    duty_time_hours DECIMAL(5,2),
    flight_time_hours DECIMAL(5,2),
    rest_time_hours DECIMAL(5,2),
    certificates_valid BOOLEAN,
    passport_valid BOOLEAN,
    visa_valid BOOLEAN,
    airport_recency_valid BOOLEAN,
    currency_valid BOOLEAN,
    ftl_compliant BOOLEAN,
    ftl_notes TEXT,
    notes TEXT
);

-- Flight Documents
CREATE TABLE flight_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    document_name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    template_content TEXT,
    generated_content TEXT,
    file_path TEXT,
    is_generated BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    generated_at TIMESTAMP,
    generated_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Flight Checklist Progress
CREATE TABLE flight_checklist_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    checklist_item_id UUID REFERENCES ops_checklist_items(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(50) NOT NULL,
    completed_at TIMESTAMP,
    completed_by UUID,
    notes TEXT,
    color_code VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Flight Changes Log
CREATE TABLE flight_changes_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL,
    field_changed VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID NOT NULL,
    change_reason TEXT,
    requires_attention BOOLEAN NOT NULL DEFAULT false,
    color_code VARCHAR(20)
);

-- Flight Passengers
CREATE TABLE flight_passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    passenger_id UUID REFERENCES passengers(id) ON DELETE CASCADE,
    seat_number VARCHAR(10),
    is_vip BOOLEAN NOT NULL DEFAULT false,
    special_requests TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Passengers
CREATE TABLE passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    date_of_birth DATE,
    nationality VARCHAR(100),
    passport_number VARCHAR(100),
    passport_expiry DATE,
    special_requirements TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pilot Flight Hours
CREATE TABLE pilot_flight_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID NOT NULL REFERENCES crew_members(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES flights(id) ON DELETE SET NULL,
    flight_date DATE NOT NULL,
    flight_type VARCHAR(50) NOT NULL,
    flight_hours DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Pilot Schedule
CREATE TABLE pilot_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID NOT NULL REFERENCES crew_members(id) ON DELETE CASCADE,
    schedule_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Training Records
CREATE TABLE training_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pilot_id UUID NOT NULL REFERENCES crew_members(id) ON DELETE CASCADE,
    instructor_id UUID REFERENCES crew_members(id) ON DELETE SET NULL,
    training_type VARCHAR(100) NOT NULL,
    training_description TEXT NOT NULL,
    training_organization VARCHAR(255) NOT NULL,
    training_date DATE NOT NULL,
    duration_hours DECIMAL(5,2) NOT NULL,
    expiry_date DATE,
    certification_achieved VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    counts_as_flight_time BOOLEAN NOT NULL DEFAULT false,
    counts_as_duty_time BOOLEAN NOT NULL DEFAULT false,
    ftl_applicable BOOLEAN NOT NULL DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Records
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    technician_id UUID REFERENCES crew_members(id) ON DELETE SET NULL,
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    scheduled_date DATE NOT NULL,
    completed_date DATE,
    status maintenance_status NOT NULL DEFAULT 'scheduled',
    cost DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Maintenance Types
CREATE TABLE maintenance_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    is_mandatory BOOLEAN NOT NULL DEFAULT false,
    required_hours INTEGER,
    required_cycles INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Oil Consumption Records
CREATE TABLE oil_consumption_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    aircraft_id UUID REFERENCES aircraft(id) ON DELETE CASCADE,
    engine_position VARCHAR(50) NOT NULL,
    flight_date DATE NOT NULL,
    flight_hours DECIMAL(5,2),
    oil_level_before DECIMAL(5,2),
    oil_level_after DECIMAL(5,2),
    oil_added_liters DECIMAL(5,2),
    consumption_rate DECIMAL(5,2),
    recorded_by UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Flight Time Limits
CREATE TABLE flight_time_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    regulation_name VARCHAR(255) NOT NULL,
    daily_limit INTEGER NOT NULL,
    weekly_limit INTEGER NOT NULL,
    monthly_limit INTEGER NOT NULL,
    yearly_limit INTEGER NOT NULL,
    min_rest_between_duties INTEGER NOT NULL,
    min_weekly_rest INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Quotes
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    quote_number VARCHAR(50) NOT NULL UNIQUE,
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE,
    aircraft_type VARCHAR(50),
    passenger_count INTEGER NOT NULL,
    base_cost DECIMAL(10,2),
    fuel_cost DECIMAL(10,2),
    handling_cost DECIMAL(10,2),
    crew_cost DECIMAL(10,2),
    other_costs DECIMAL(10,2),
    margin_percentage DECIMAL(5,2),
    vat_rate DECIMAL(5,2),
    vat_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    pricing_method VARCHAR(50),
    marketplace_source VARCHAR(100),
    status VARCHAR(50),
    valid_until DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Quote Checklist Progress
CREATE TABLE quote_checklist_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    checklist_item_id UUID REFERENCES checklist_items(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMP,
    completed_by UUID,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Quote Flight Links
CREATE TABLE quote_flight_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    linked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    linked_by UUID,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sales Checklists
CREATE TABLE sales_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    checklist_type VARCHAR(50) NOT NULL,
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Checklist Items
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID REFERENCES sales_checklists(id) ON DELETE CASCADE,
    item_text TEXT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ops Checklist Items
CREATE TABLE ops_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID REFERENCES sales_checklists(id) ON DELETE CASCADE,
    item_text TEXT NOT NULL,
    checklist_section VARCHAR(100) NOT NULL,
    sales_ops VARCHAR(50) NOT NULL,
    attach_to VARCHAR(50) NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT false,
    visible_on_crew_app BOOLEAN NOT NULL DEFAULT false,
    auto_add_to_log BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    cql_condition TEXT,
    due_dates TEXT,
    email_template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Email Templates
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Checklist Email Templates
CREATE TABLE checklist_email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_item_id UUID REFERENCES ops_checklist_items(id) ON DELETE CASCADE,
    email_template_id UUID REFERENCES email_templates(id) ON DELETE CASCADE,
    trigger_condition TEXT,
    auto_send BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sales Documents
CREATE TABLE sales_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    template_content TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_email VARCHAR(255),
    recipient_name VARCHAR(255),
    recipient_email VARCHAR(255),
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT false,
    avinode_reference VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Handling Requests
CREATE TABLE handling_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    airport_code VARCHAR(10) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    request_details TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    requested_by UUID,
    response_received_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Versions
CREATE TABLE schedule_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    version_number INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT false,
    created_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Published Schedules
CREATE TABLE published_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    schedule_version_id UUID REFERENCES schedule_versions(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    trip_type VARCHAR(50),
    is_commercial BOOLEAN,
    is_option BOOLEAN,
    published_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Changes
CREATE TABLE schedule_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    change_type VARCHAR(50) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    reason TEXT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    changed_by UUID,
    approved_by UUID,
    approved_at TIMESTAMP
);

-- Schedule Exports
CREATE TABLE schedule_exports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    export_name VARCHAR(255) NOT NULL,
    export_format VARCHAR(50) NOT NULL,
    date_range_start DATE NOT NULL,
    date_range_end DATE NOT NULL,
    exported_by UUID NOT NULL,
    file_path TEXT,
    filters JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- VAT Rates
CREATE TABLE vat_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(2) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    vat_rate DECIMAL(5,2) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ENAC Notifications
CREATE TABLE enac_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member_id UUID REFERENCES crew_members(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES flights(id) ON DELETE CASCADE,
    expired_certification_type VARCHAR(100) NOT NULL,
    justification TEXT NOT NULL,
    notification_date TIMESTAMP,
    sent_by UUID,
    enac_response TEXT,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Links
CREATE TABLE document_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    document_id UUID,
    link_type VARCHAR(50) NOT NULL,
    created_by UUID,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- User Permissions
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_email VARCHAR(255) NOT NULL,
    module VARCHAR(100) NOT NULL,
    permission_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    is_active BOOLEAN NOT NULL DEFAULT true,
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID,
    expires_at TIMESTAMP
);

-- SaaS Licenses
CREATE TABLE saas_licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    license_type VARCHAR(50) NOT NULL,
    max_users INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP,
    active_modules JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support Tickets
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    target_organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    user_id UUID,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    assigned_to UUID,
    is_general_announcement BOOLEAN DEFAULT false,
    created_by_super_admin BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    attachments JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ticket Comments
CREATE TABLE ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachments JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Ticket Organization Targets
CREATE TABLE ticket_organization_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(ticket_id, organization_id)
);

-- System Notifications
CREATE TABLE system_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL,
    module_source VARCHAR(100) NOT NULL,
    module_target VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Sync Status
CREATE TABLE sync_status (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    source_module VARCHAR(100) NOT NULL,
    target_module VARCHAR(100) NOT NULL,
    sync_status VARCHAR(50) NOT NULL,
    last_sync_at TIMESTAMP,
    sync_data JSONB,
    error_details TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Rules
CREATE TABLE workflow_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_module VARCHAR(100) NOT NULL,
    trigger_event VARCHAR(100) NOT NULL,
    target_module VARCHAR(100) NOT NULL,
    target_action VARCHAR(100) NOT NULL,
    conditions JSONB,
    parameters JSONB,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_rule_id UUID REFERENCES workflow_rules(id) ON DELETE SET NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    result JSONB,
    error_message TEXT
);

-- OTP Codes
CREATE TABLE otp_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(50) NOT NULL,
    code VARCHAR(10) NOT NULL,
    user_id UUID,
    verified BOOLEAN DEFAULT false,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);

-- User Roles
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_organization_id ON user_roles(organization_id);

-- Clients
CREATE INDEX idx_clients_organization_id ON clients(organization_id);

-- Aircraft
CREATE INDEX idx_aircraft_organization_id ON aircraft(organization_id);
CREATE INDEX idx_aircraft_tail_number ON aircraft(tail_number);

-- Crew Members
CREATE INDEX idx_crew_members_organization_id ON crew_members(organization_id);
CREATE INDEX idx_crew_members_email ON crew_members(email);

-- Flights
CREATE INDEX idx_flights_organization_id ON flights(organization_id);
CREATE INDEX idx_flights_client_id ON flights(client_id);
CREATE INDEX idx_flights_aircraft_id ON flights(aircraft_id);
CREATE INDEX idx_flights_departure_time ON flights(departure_time);

-- Quotes
CREATE INDEX idx_quotes_organization_id ON quotes(organization_id);
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to generate OTP code
CREATE OR REPLACE FUNCTION generate_otp_code()
RETURNS VARCHAR(10) AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS VARCHAR(50) AS $$
DECLARE
    new_ticket_number VARCHAR(50);
BEGIN
    new_ticket_number := 'TKT-' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDD') || '-' || LPAD(NEXTVAL('ticket_number_seq')::TEXT, 6, '0');
    RETURN new_ticket_number;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- Function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin(user_email VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM super_admins 
        WHERE super_admins.email = user_email 
        AND super_admins.is_active = true
    );
END;
$$ LANGUAGE plpgsql;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid UUID, org_uuid UUID)
RETURNS VARCHAR AS $$
DECLARE
    user_role_val VARCHAR;
BEGIN
    SELECT role::VARCHAR INTO user_role_val
    FROM user_roles
    WHERE user_id = user_uuid AND organization_id = org_uuid
    LIMIT 1;
    
    RETURN COALESCE(user_role_val, 'user');
END;
$$ LANGUAGE plpgsql;

-- Function to get user role safe
CREATE OR REPLACE FUNCTION get_user_role_safe(user_uuid UUID, org_uuid UUID)
RETURNS VARCHAR AS $$
BEGIN
    RETURN get_user_role(user_uuid, org_uuid);
EXCEPTION
    WHEN OTHERS THEN
        RETURN 'user';
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is organization admin
CREATE OR REPLACE FUNCTION is_organization_admin(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = user_uuid 
        AND organization_id = org_uuid
        AND role IN ('organization_admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql;

-- Function to check if user is org admin
CREATE OR REPLACE FUNCTION is_user_org_admin(user_uuid UUID, org_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN is_organization_admin(user_uuid, org_uuid);
END;
$$ LANGUAGE plpgsql;

-- Function to get user organization
CREATE OR REPLACE FUNCTION get_user_organization()
RETURNS UUID AS $$
DECLARE
    org_id UUID;
BEGIN
    -- This function would need to be called with context
    -- For now, returns NULL - should be implemented based on auth context
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to create user role
CREATE OR REPLACE FUNCTION create_user_role(
    p_user_id UUID,
    p_organization_id UUID,
    p_role user_role,
    p_module_permissions JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    new_role_id UUID;
BEGIN
    INSERT INTO user_roles (user_id, organization_id, role, module_permissions)
    VALUES (p_user_id, p_organization_id, p_role, p_module_permissions)
    ON CONFLICT (user_id, organization_id) 
    DO UPDATE SET 
        role = p_role,
        module_permissions = p_module_permissions,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO new_role_id;
    
    RETURN new_role_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aircraft_updated_at BEFORE UPDATE ON aircraft
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_members_updated_at BEFORE UPDATE ON crew_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flights_updated_at BEFORE UPDATE ON flights
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add more triggers as needed for other tables with updated_at columns

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON DATABASE current_database() IS 'LEO Replica Wizard - PostgreSQL Database Schema';
COMMENT ON TABLE organizations IS 'Organizations/Companies using the system';
COMMENT ON TABLE profiles IS 'User profiles linked to auth system';
COMMENT ON TABLE crew_members IS 'Crew members (pilots, cabin crew, mechanics)';
COMMENT ON TABLE flights IS 'Flight records';
COMMENT ON TABLE quotes IS 'Flight quotes for clients';

