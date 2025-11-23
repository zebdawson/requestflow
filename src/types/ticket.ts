/**
 * Type definitions for PFC Ticketing System
 * These interfaces define the data structures used throughout the application
 */

// Job types available in the system
export type JobType =
  | 'Event Staffing'
  | 'ESOC Assessment'
  | 'Driver Detail'
  | 'Operational Support'
  | 'Emergency Response'
  | 'Other';

// Priority levels for tickets
export type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';

// Ticket status in the workflow
export type TicketStatus =
  | 'New Request'
  | 'Under Review'
  | 'In Progress'
  | 'Pending Info'
  | 'Completed'
  | 'Cancelled';

// Billing types for finance department
export type BillingType = 'Hourly' | 'Fixed' | 'Per Person' | 'Per Event';

// Department tags for routing tickets
export interface DepartmentFlags {
  staffing: boolean;
  logistics: boolean;
  finance: boolean;
  scheduling: boolean;
}

// Complete ticket interface - represents a full ticket in the system
export interface Ticket {
  // System fields
  id: string;                          // GoHighLevel Opportunity ID
  ticketNumber: string;                // Human-readable ticket number (PFC-2024-0001)
  status: TicketStatus;
  createdAt: string;                   // ISO date string
  updatedAt: string;                   // ISO date string

  // Client information
  clientName: string;
  clientContact: string;
  clientEmail: string;
  clientPhone: string;

  // Job details
  jobType: JobType;
  jobDescription: string;
  priority: Priority;

  // Optional event details
  eventDate?: string;                  // ISO date string
  eventLocation?: string;

  // Department routing
  departments: DepartmentFlags;

  // Conditional fields (appear based on department selection)
  personnelCount?: number;             // Shows if staffing department selected
  personnelType?: string;              // Shows if staffing department selected
  budgetAmount?: number;               // Shows if finance department selected
  billingType?: BillingType;           // Shows if finance department selected
  specialInstructions?: string;
}

// Form data for creating a new ticket (omits system-generated fields)
export interface CreateTicketRequest {
  // Client information
  clientName: string;
  clientContact: string;
  clientEmail: string;
  clientPhone: string;

  // Job details
  jobType: JobType;
  jobDescription: string;
  priority: Priority;

  // Optional event details
  eventDate?: string;
  eventLocation?: string;

  // Department routing
  departments: DepartmentFlags;

  // Conditional fields
  personnelCount?: number;
  personnelType?: string;
  budgetAmount?: number;
  billingType?: BillingType;
  specialInstructions?: string;
}

// Response from creating a ticket
export interface CreateTicketResponse {
  success: boolean;
  ticketNumber: string;
  ticketId: string;
  message?: string;
  error?: string;
}

// Filters for the dashboard view
export interface TicketFilters {
  department?: keyof DepartmentFlags;  // Filter by single department
  status?: TicketStatus;
  priority?: Priority;
  searchTerm?: string;                 // Search across multiple fields
  dateFrom?: string;                   // ISO date string
  dateTo?: string;                     // ISO date string
}

// Dashboard summary statistics
export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  overdueTickets: number;
  averageCompletionTime: number;       // In hours
}

// Generic API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Sort configuration for ticket table
export interface SortConfig {
  field: keyof Ticket;
  direction: 'asc' | 'desc';
}

// GoHighLevel opportunity data structure (for API integration)
export interface GHLOpportunity {
  id?: string;
  name: string;                        // Ticket number + client name
  pipelineId: string;
  pipelineStageId: string;
  status: string;
  contactId?: string;
  monetaryValue?: number;
  assignedTo?: string;
  customFields?: Record<string, any>;  // Our ticket data goes here
}
