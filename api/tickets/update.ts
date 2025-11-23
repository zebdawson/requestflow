/**
 * PUT /api/tickets/update
 * Updates a ticket in GoHighLevel
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ghlClient } from '../ghl-client';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
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

    // Get update data from request body
    const updateData = req.body;

    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No update data provided',
      });
    }

    // Prepare data for GoHighLevel
    const ghlUpdateData: any = {};

    // Map ticket fields to GoHighLevel custom fields
    if (updateData.status) {
      ghlUpdateData.customFields = {
        ...ghlUpdateData.customFields,
        ticket_status: updateData.status,
      };
    }

    if (updateData.priority) {
      ghlUpdateData.customFields = {
        ...ghlUpdateData.customFields,
        ticket_priority: updateData.priority,
      };
    }

    // Add other updatable fields as needed

    // Update opportunity in GoHighLevel
    const opportunity = await ghlClient.updateOpportunity(id, ghlUpdateData);

    // Return success response
    return res.status(200).json({
      success: true,
      data: opportunity,
      message: 'Ticket updated successfully',
    });
  } catch (error) {
    console.error('[API] Error updating ticket:', error);

    const errorMessage = error instanceof Error ? error.message : 'Internal server error';

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  }
}
