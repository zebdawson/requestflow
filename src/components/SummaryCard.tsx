/**
 * SummaryCard Component
 * Displays a single metric card on the dashboard
 * Used for total tickets, open tickets, overdue tickets, etc.
 */

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function SummaryCard({
  title,
  value,
  icon,
  color = 'blue',
  trend,
}: SummaryCardProps) {
  // Color mapping for different card types
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'bg-primary text-white',
      text: 'text-primary',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'bg-success text-white',
      text: 'text-success',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'bg-error text-white',
      text: 'text-error',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'bg-warning text-white',
      text: 'text-warning',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`${colors.bg} rounded-lg shadow-sm p-6 border border-gray-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>

          {/* Optional trend indicator */}
          {trend && (
            <div className="flex items-center mt-2">
              <svg
                className={`h-4 w-4 mr-1 ${
                  trend.isPositive ? 'text-success' : 'text-error'
                } ${trend.isPositive ? 'transform rotate-180' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-success' : 'text-error'
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last week</span>
            </div>
          )}
        </div>

        {/* Icon */}
        <div className={`${colors.icon} rounded-full p-3`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
