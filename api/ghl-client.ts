/**
 * GoHighLevel API Client
 * Handles authentication and API communication with GoHighLevel
 * Uses Access Token authentication (simpler than OAuth)
 */

import axios, { AxiosInstance } from 'axios';

interface GHLConfig {
  accessToken: string;
  locationId: string;
  apiUrl: string;
}

interface GHLOpportunity {
  id?: string;
  name: string;
  pipelineId: string;
  pipelineStageId: string;
  status: string;
  contactId?: string;
  monetaryValue?: number;
  assignedTo?: string;
  customFields: Record<string, any>;
}

class GoHighLevelClient {
  private config: GHLConfig;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.config = {
      accessToken: process.env.GHL_ACCESS_TOKEN || '',
      locationId: process.env.GHL_LOCATION_ID || '',
      apiUrl: process.env.GHL_API_URL || 'https://services.leadconnectorhq.com',
    };

    this.axiosInstance = axios.create({
      baseURL: this.config.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Validate required config
    if (!this.config.accessToken) {
      console.warn('[GHL] Warning: GHL_ACCESS_TOKEN not found in environment variables');
    }
    if (!this.config.locationId) {
      console.warn('[GHL] Warning: GHL_LOCATION_ID not found in environment variables');
    }
  }

  /**
   * Get access token from environment
   */
  private getAccessToken(): string {
    if (!this.config.accessToken) {
      throw new Error('GHL_ACCESS_TOKEN not configured. Please add it to your .env.local file.');
    }
    return this.config.accessToken;
  }

  /**
   * Generate unique ticket number
   */
  generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    return `PFC-${year}-${randomNum}`;
  }

  /**
   * Create a new opportunity (ticket) in GoHighLevel
   */
  async createOpportunity(data: any): Promise<GHLOpportunity> {
    const token = this.getAccessToken();

    const opportunityData = {
      name: `${data.ticketNumber} - ${data.clientName}`,
      pipelineId: 'oE36ZIt1Ow9UVkuGz2GN', // Job Request Management pipeline
      pipelineStageId: '8d15443d-5962-42d6-a6e2-6b83b29f72a6', // 📥 New Request (Blue)
      status: 'open',
      locationId: this.config.locationId,
      monetaryValue: data.budgetAmount || 0,
      customFields: {
        ticket_number: data.ticketNumber,
        client_name: data.clientName,
        client_contact: data.clientContact,
        client_email: data.clientEmail,
        client_phone: data.clientPhone,
        job_type: data.jobType,
        job_description: data.jobDescription,
        ticket_priority: data.priority,
        event_date: data.eventDate || '',
        event_location: data.eventLocation || '',
        requires_staffing: data.departments.staffing,
        requires_logistics: data.departments.logistics,
        requires_finance: data.departments.finance,
        requires_scheduling: data.departments.scheduling,
        personnel_count: data.personnelCount || '',
        personnel_type: data.personnelType || '',
        budget_amount: data.budgetAmount || '',
        billing_type: data.billingType || '',
        special_instructions: data.specialInstructions || '',
        ticket_status: 'New Request',
        submitted_date: new Date().toISOString(),
      },
    };

    try {
      const response = await this.axiosInstance.post('/opportunities/', opportunityData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('[GHL] Error creating opportunity:', error);
      throw new Error('Failed to create ticket in GoHighLevel');
    }
  }

  /**
   * Get all opportunities from a location
   */
  async getOpportunities(filters?: any): Promise<GHLOpportunity[]> {
    const token = this.getAccessToken();

    try {
      const params: any = {
        location_id: this.config.locationId,
      };

      // Add filters if provided
      if (filters?.status) params.status = filters.status;
      if (filters?.pipelineStageId) params.pipelineStageId = filters.pipelineStageId;

      const response = await this.axiosInstance.get('/opportunities/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      return response.data.opportunities || [];
    } catch (error) {
      console.error('[GHL] Error fetching opportunities:', error);
      throw new Error('Failed to fetch tickets from GoHighLevel');
    }
  }

  /**
   * Get a single opportunity by ID
   */
  async getOpportunity(id: string): Promise<GHLOpportunity> {
    const token = this.getAccessToken();

    try {
      const response = await this.axiosInstance.get(`/opportunities/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('[GHL] Error fetching opportunity:', error);
      throw new Error('Failed to fetch ticket from GoHighLevel');
    }
  }

  /**
   * Update an opportunity
   */
  async updateOpportunity(id: string, data: Partial<GHLOpportunity>): Promise<GHLOpportunity> {
    const token = this.getAccessToken();

    try {
      const response = await this.axiosInstance.put(`/opportunities/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error('[GHL] Error updating opportunity:', error);
      throw new Error('Failed to update ticket in GoHighLevel');
    }
  }
}

// Export singleton instance
export const ghlClient = new GoHighLevelClient();
