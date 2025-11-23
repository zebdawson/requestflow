/**
 * Submit Page
 * Container for the ticket intake form
 * Handles form submission, success states, and error handling
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import { createTicket } from '../services/api';
import type { CreateTicketRequest } from '../types/ticket';

export default function Submit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateTicketRequest) => {
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('[Submit] Creating ticket...', data);
      const response = await createTicket(data);

      if (response.success) {
        setTicketNumber(response.ticketNumber);
        setSubmitSuccess(true);
        console.log('[Submit] Ticket created successfully:', response.ticketNumber);
      } else {
        throw new Error(response.error || 'Failed to create ticket');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('[Submit] Error creating ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAnother = () => {
    setSubmitSuccess(false);
    setTicketNumber(null);
    setError(null);
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  // Success state
  if (submitSuccess && ticketNumber) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success/10 mb-4">
              <svg
                className="h-10 w-10 text-success"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Ticket Created Successfully!
            </h2>

            <p className="text-gray-600 mb-6">
              Your job request has been submitted and will be reviewed shortly.
            </p>

            {/* Ticket Number Display */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Your Ticket Number</p>
              <p className="text-4xl font-bold text-primary tracking-wider">
                {ticketNumber}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Save this number for your records
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCreateAnother}
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Another Ticket
              </button>
              <button
                onClick={handleViewDashboard}
                className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">
              What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Your ticket has been logged in the system and synced to GoHighLevel</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>The assigned departments will be notified</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>You'll receive updates as your request is processed</span>
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Track progress on the dashboard anytime</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Form state (default)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Submit Job Request
          </h1>
          <p className="text-gray-600">
            Fill out the form below to create a new ticket for PFC operations
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-error/10 border border-error text-error px-6 py-4 rounded-lg flex items-start">
            <svg
              className="h-6 w-6 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold mb-1">Error Submitting Ticket</h3>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-sm underline mt-2 hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Ticket Form */}
        <TicketForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
}
