/**
 * TicketForm Component
 * Mobile-optimized form for creating new job request tickets
 * Features: validation, conditional fields, auto-save, progress indicator
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateTicketRequest } from '../types/ticket';

interface TicketFormProps {
  onSubmit: (data: CreateTicketRequest) => Promise<void>;
  isSubmitting: boolean;
}

// Auto-save key for localStorage
const AUTOSAVE_KEY = 'pfc-ticket-draft';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

export default function TicketForm({ onSubmit, isSubmitting }: TicketFormProps) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<CreateTicketRequest>({
    mode: 'onChange', // Validate on every change for real-time feedback
    defaultValues: {
      departments: {
        staffing: false,
        logistics: false,
        finance: false,
        scheduling: false,
      },
    },
  });

  // Watch department checkboxes to show/hide conditional fields
  const departments = watch('departments');
  const watchedFields = watch();

  // Calculate form completion percentage
  const calculateProgress = (): number => {
    const requiredFields = [
      watchedFields.clientName,
      watchedFields.clientContact,
      watchedFields.clientEmail,
      watchedFields.clientPhone,
      watchedFields.jobType,
      watchedFields.jobDescription,
      watchedFields.priority,
    ];

    const filledRequired = requiredFields.filter(Boolean).length;
    return Math.round((filledRequired / requiredFields.length) * 100);
  };

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(AUTOSAVE_KEY);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        Object.keys(draft).forEach((key) => {
          setValue(key as keyof CreateTicketRequest, draft[key]);
        });
        console.log('[Form] Loaded draft from localStorage');
      } catch (error) {
        console.error('[Form] Failed to load draft:', error);
      }
    }
  }, [setValue]);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(watchedFields));
      setLastSaved(new Date());
      console.log('[Form] Auto-saved to localStorage');
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [watchedFields]);

  // Handle form submission
  const handleFormSubmit = async (data: CreateTicketRequest) => {
    await onSubmit(data);
    // Clear draft after successful submission
    localStorage.removeItem(AUTOSAVE_KEY);
    reset();
  };

  const progress = calculateProgress();

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Progress Indicator */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Form Progress</span>
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        {lastSaved && (
          <p className="text-xs text-gray-500 mt-1">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Client Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Client Information
        </h2>

        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Client Name <span className="text-error">*</span>
          </label>
          <input
            id="clientName"
            type="text"
            {...register('clientName', { required: 'Client name is required' })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base ${
              errors.clientName ? 'border-error' : 'border-gray-300'
            }`}
            placeholder="Enter client or company name"
          />
          {errors.clientName && (
            <p className="mt-1 text-sm text-error">{errors.clientName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="clientContact" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Person <span className="text-error">*</span>
          </label>
          <input
            id="clientContact"
            type="text"
            {...register('clientContact', { required: 'Contact person is required' })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base ${
              errors.clientContact ? 'border-error' : 'border-gray-300'
            }`}
            placeholder="Enter contact person name"
          />
          {errors.clientContact && (
            <p className="mt-1 text-sm text-error">{errors.clientContact.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-error">*</span>
            </label>
            <input
              id="clientEmail"
              type="email"
              {...register('clientEmail', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base ${
                errors.clientEmail ? 'border-error' : 'border-gray-300'
              }`}
              placeholder="contact@example.com"
            />
            {errors.clientEmail && (
              <p className="mt-1 text-sm text-error">{errors.clientEmail.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone <span className="text-error">*</span>
            </label>
            <input
              id="clientPhone"
              type="tel"
              {...register('clientPhone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[\d\s\-\+\(\)]+$/,
                  message: 'Invalid phone number',
                },
              })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base ${
                errors.clientPhone ? 'border-error' : 'border-gray-300'
              }`}
              placeholder="(555) 123-4567"
            />
            {errors.clientPhone && (
              <p className="mt-1 text-sm text-error">{errors.clientPhone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Job Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-1">
              Job Type <span className="text-error">*</span>
            </label>
            <select
              id="jobType"
              {...register('jobType', { required: 'Job type is required' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base ${
                errors.jobType ? 'border-error' : 'border-gray-300'
              }`}
            >
              <option value="">Select job type...</option>
              <option value="Event Staffing">Event Staffing</option>
              <option value="ESOC Assessment">ESOC Assessment</option>
              <option value="Driver Detail">Driver Detail</option>
              <option value="Operational Support">Operational Support</option>
              <option value="Emergency Response">Emergency Response</option>
              <option value="Other">Other</option>
            </select>
            {errors.jobType && (
              <p className="mt-1 text-sm text-error">{errors.jobType.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority <span className="text-error">*</span>
            </label>
            <select
              id="priority"
              {...register('priority', { required: 'Priority is required' })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base ${
                errors.priority ? 'border-error' : 'border-gray-300'
              }`}
            >
              <option value="">Select priority...</option>
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
            {errors.priority && (
              <p className="mt-1 text-sm text-error">{errors.priority.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Job Description <span className="text-error">*</span>
          </label>
          <textarea
            id="jobDescription"
            rows={5}
            {...register('jobDescription', {
              required: 'Job description is required',
              minLength: {
                value: 50,
                message: 'Description must be at least 50 characters',
              },
            })}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base ${
              errors.jobDescription ? 'border-error' : 'border-gray-300'
            }`}
            placeholder="Provide detailed description of the job requirements (minimum 50 characters)..."
          />
          {errors.jobDescription && (
            <p className="mt-1 text-sm text-error">{errors.jobDescription.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {watchedFields.jobDescription?.length || 0} / 50 minimum characters
          </p>
        </div>
      </div>

      {/* Event Details Section (Optional) */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Event Details <span className="text-sm font-normal text-gray-500">(Optional)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
              Event Date
            </label>
            <input
              id="eventDate"
              type="date"
              {...register('eventDate')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
            />
          </div>

          <div>
            <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-1">
              Event Location
            </label>
            <input
              id="eventLocation"
              type="text"
              {...register('eventLocation')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
              placeholder="Enter event location"
            />
          </div>
        </div>
      </div>

      {/* Department Routing Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Department Routing
        </h2>
        <p className="text-sm text-gray-600">
          Select all departments that need to be involved in this request
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('departments.staffing')}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Staffing</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('departments.logistics')}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Logistics</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('departments.finance')}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Finance</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('departments.scheduling')}
              className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Scheduling</span>
          </label>
        </div>

        {/* Conditional: Staffing Department Fields */}
        {departments?.staffing && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
            <h3 className="text-sm font-semibold text-blue-900">Staffing Requirements</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="personnelCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Personnel
                </label>
                <input
                  id="personnelCount"
                  type="number"
                  min="1"
                  {...register('personnelCount', {
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  placeholder="e.g., 5"
                />
              </div>

              <div>
                <label htmlFor="personnelType" className="block text-sm font-medium text-gray-700 mb-1">
                  Personnel Type
                </label>
                <input
                  id="personnelType"
                  type="text"
                  {...register('personnelType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  placeholder="e.g., Security Guards, Event Staff"
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional: Finance Department Fields */}
        {departments?.finance && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 space-y-4">
            <h3 className="text-sm font-semibold text-green-900">Financial Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="budgetAmount"
                    type="number"
                    min="0"
                    step="0.01"
                    {...register('budgetAmount', {
                      valueAsNumber: true,
                    })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="billingType" className="block text-sm font-medium text-gray-700 mb-1">
                  Billing Type
                </label>
                <select
                  id="billingType"
                  {...register('billingType')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
                >
                  <option value="">Select billing type...</option>
                  <option value="Hourly">Hourly</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Per Person">Per Person</option>
                  <option value="Per Event">Per Event</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Special Instructions Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Additional Information <span className="text-sm font-normal text-gray-500">(Optional)</span>
        </h2>

        <div>
          <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700 mb-1">
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            rows={4}
            {...register('specialInstructions')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-base"
            placeholder="Any additional notes, requirements, or special instructions..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="sticky bottom-0 bg-white p-4 rounded-lg shadow-lg border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-all ${
            isSubmitting || !isValid
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-blue-700 active:bg-blue-800'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Submit Ticket Request'
          )}
        </button>
      </div>
    </form>
  );
}
