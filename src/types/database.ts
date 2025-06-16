// Re-export all types from domain-specific files
export * from './aircraft';
export * from './client';
export * from './crew';
export * from './flight';
export * from './quote';
export * from './schedule';
export * from './airport';
export * from './certification';

// Keep legacy exports for backward compatibility
export type {
  Aircraft,
  Client,
  CrewMember,
  Flight,
  Quote,
  MaintenanceRecord,
  PilotFlightHour,
  PilotSchedule,
  FlightTimeLimit,
  Airport,
  ScheduleVersion,
  PublishedSchedule,
  CrewQualification,
  FlightAssignment,
  ScheduleChange,
  MaintenanceType,
  FlightLeg,
  CrewCertification,
  AircraftCertificationRequirement,
  EnacNotification,
  CrewValidationResult
} from './index';
