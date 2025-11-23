/**
 * GET /api/tickets/[id]
 * Fetches a single ticket by ID from GoHighLevel
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ghlClient } from '../ghl-client';

/**
 * Transform GoHighLevel opportunity to Ticket format
 */
function transformOpportunityToTicket(opportunity: any) {
  const customFields = opportunity.customFields || {};

  return {
    id: opportunity.id,
    ticketNumber: customFields.ticket_number || '',
    status: customFields.ticket_status || 'New Request',
    createdAt: customFields.submitted_date || opportunity.createdAt,
    updatedAt: opportunity.updatedAt || opportunity.createdAt,
    clientName: customFields.client_name || '',
    clientContact: customFields.client_contact || '',
    clientEmail: customFields.client_email || '',
    clientPhone: customFields.client_phone || '',
    jobType: customFields.job_type || '',
    jobDescription: customFields.job_description || '',
    priority: customFields.ticket_priority || 'Normal',
    eventDate: customFields.event_date || undefined,
    eventLocation: customFields.event_location || undefined,
    departments: {
      staffing: customFields.requires_staffing === true || customFields.requires_staffing === 'true',
      logistics: customFields.requires_logistics === true || customFields.requires_logistics === 'true',
      finance: customFields.requires_finance === true || customFields.requires_finance === 'true',
      scheduling: customFields.requires_scheduling === true || customFields.requires_scheduling === 'true',
    },
    personnelCount: customFields.personnel_count ? Number(customFields.personnel_count) : undefined,
    personnelType: customFields.personnel_type || undefined,
    budgetAmount: customFields.budget_amount ? Number(customFields.budget_amount) : undefined,
    billingType: customFields.billing_type || undefined,
    specialInstructions: customFields.special_instructions || undefined,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Get ticket ID from query parameters
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Missing or invalid ticket ID',
      });
    }

    // Fetch opportunity from GoHighLevel
    const opportunity = await ghlClient.getOpportunity(id);

    // Transform opportunity to ticket
    const ticket = transformOpportunityToTicket(opportunity);

    // Return success response
    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    console.error('[API] Error fetching ticket:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
