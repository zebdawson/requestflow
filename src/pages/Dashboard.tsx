/**
 * Dashboard Page
 * Executive view of all tickets with filtering and search capabilities
 * Includes summary statistics and auto-refresh functionality
 */

import { useEffect, useState } from 'react';
import SummaryCard from '../components/SummaryCard';
import TicketTable from '../components/TicketTable';
import { getTickets } from '../services/api';
import type { Ticket, TicketFilters, DashboardStats } from '../types/ticket';

const REFRESH_INTERVAL = 30000; // 30 seconds

export default function Dashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<TicketFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Fetch tickets from API
  const fetchTickets = async () => {
    try {
      setError(null);
      const data = await getTickets();
      setTickets(data);
      setLastRefresh(new Date());
      console.log('[Dashboard] Fetched tickets:', data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tickets';
      setError(errorMessage);
      console.error('[Dashboard] Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and auto-refresh setup
  useEffect(() => {
    fetchTickets();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTickets();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...tickets];

    // Apply department filter
    if (filters.department) {
      result = result.filter(
        (ticket) => ticket.departments[filters.department as keyof typeof ticket.departments]
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter((ticket) => ticket.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      result = result.filter((ticket) => ticket.priority === filters.priority);
    }

    // Apply search term (searches across multiple fields)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (ticket) =>
          ticket.ticketNumber.toLowerCase().includes(term) ||
          ticket.clientName.toLowerCase().includes(term) ||
          ticket.clientContact.toLowerCase().includes(term) ||
          ticket.jobType.toLowerCase().includes(term) ||
          ticket.jobDescription.toLowerCase().includes(term)
      );
    }

    setFilteredTickets(result);
  }, [tickets, filters, searchTerm]);

  // Calculate dashboard statistics
  const calculateStats = (): DashboardStats => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(
      (t) => t.status !== 'Completed' && t.status !== 'Cancelled'
    ).length;

    // Calculate overdue tickets (example: New Request older than 48 hours)
    const overdueTickets = tickets.filter((t) => {
      if (t.status !== 'New Request') return false;
      const createdAt = new Date(t.createdAt);
      const now = new Date();
      const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      return hoursDiff > 48;
    }).length;

    // Calculate average completion time (simplified calculation)
    const completedTickets = tickets.filter((t) => t.status === 'Completed');
    const avgTime =
      completedTickets.length > 0
        ? completedTickets.reduce((sum, ticket) => {
            const created = new Date(ticket.createdAt);
            const updated = new Date(ticket.updatedAt);
            const hours = (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
            return sum + hours;
          }, 0) / completedTickets.length
        : 0;

    return {
      totalTickets,
      openTickets,
      overdueTickets,
      averageCompletionTime: Math.round(avgTime),
    };
  };

  const stats = calculateStats();

  // Handle ticket click (could navigate to detail view)
  const handleTicketClick = (ticket: Ticket) => {
    console.log('[Dashboard] Ticket clicked:', ticket.ticketNumber);
    // TODO: Navigate to ticket detail view or open modal
    alert(`Ticket Details:\n\nTicket: ${ticket.ticketNumber}\nClient: ${ticket.clientName}\nStatus: ${ticket.status}`);
  };

  // Export to CSV
  const handleExport = () => {
    const csvData = filteredTickets.map((ticket) => ({
      'Ticket Number': ticket.ticketNumber,
      'Client Name': ticket.clientName,
      'Contact Person': ticket.clientContact,
      'Job Type': ticket.jobType,
      'Status': ticket.status,
      'Priority': ticket.priority,
      'Created Date': new Date(ticket.createdAt).toLocaleDateString(),
      'Description': ticket.jobDescription.replace(/,/g, ';'), // Escape commas
    }));

    const headers = Object.keys(csvData[0] || {});
    const csv = [
      headers.join(','),
      ...csvData.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pfc-tickets-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Monitor and manage all job requests
              {lastRefresh && (
                <span className="text-sm text-gray-500 ml-2">
                  • Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={fetchTickets}
            className="mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-error/10 border border-error text-error px-6 py-4 rounded-lg flex items-start">
            <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-semibold mb-1">Error Loading Tickets</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SummaryCard
            title="Total Tickets"
            value={stats.totalTickets}
            color="blue"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <SummaryCard
            title="Open Tickets"
            value={stats.openTickets}
            color="green"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />
          <SummaryCard
            title="Overdue Tickets"
            value={stats.overdueTickets}
            color="red"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <SummaryCard
            title="Avg. Completion Time"
            value={`${stats.averageCompletionTime}h`}
            color="yellow"
            icon={
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tickets, clients, descriptions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={filters.status || ''}
                onChange={(e) => setFilters({ ...filters, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Statuses</option>
                <option value="New Request">New Request</option>
                <option value="Under Review">Under Review</option>
                <option value="In Progress">In Progress</option>
                <option value="Pending Info">Pending Info</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={filters.priority || ''}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Department:</span>
            {(['staffing', 'logistics', 'finance', 'scheduling'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() =>
                  setFilters({
                    ...filters,
                    department: filters.department === dept ? undefined : dept,
                  })
                }
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.department === dept
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </button>
            ))}
          </div>

          {/* Results Count and Export */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredTickets.length}</span> of{' '}
              <span className="font-semibold">{tickets.length}</span> tickets
            </p>
            <button
              onClick={handleExport}
              disabled={filteredTickets.length === 0}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Ticket Table */}
        <TicketTable tickets={filteredTickets} onTicketClick={handleTicketClick} />
      </div>
    </div>
  );
}
