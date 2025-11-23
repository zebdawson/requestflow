/**
 * POST /api/tickets/create
 * Creates a new ticket in GoHighLevel
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ghlClient } from '../ghl-client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Validate request body
    const {
      clientName,
      clientContact,
      clientEmail,
      clientPhone,
      jobType,
      jobDescription,
      priority,
    } = req.body;

    if (!clientName || !clientContact || !clientEmail || !clientPhone || !jobType || !jobDescription || !priority) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Generate unique ticket number
    const ticketNumber = ghlClient.generateTicketNumber();

    // Prepare ticket data
    const ticketData = {
      ...req.body,
      ticketNumber,
    };

    // Create opportunity in GoHighLevel
    const opportunity = await ghlClient.createOpportunity(ticketData);

    // Return success response
    return res.status(201).json({
      success: true,
      ticketNumber,
      ticketId: opportunity.id,
      message: 'Ticket created successfully',
    });
  } catch (error) {
    console.error('[API] Error creating ticket:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
