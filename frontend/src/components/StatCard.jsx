import { classNames } from '../utils/helpers'

const iconBgColors = {
  blue: 'bg-primary-100 text-primary-600',
  green: 'bg-success-100 text-success-600',
  yellow: 'bg-warning-100 text-warning-600',
  red: 'bg-danger-100 text-danger-600',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
}

export default function StatCard({ title, value, icon: Icon, iconColor = 'blue', trend, trendLabel, onClick }) {
  return (
    <div
      className={classNames(
        'stat-card',
        onClick && 'cursor-pointer hover:shadow-md transition-shadow'
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="stat-label">{title}</p>
          <p className="stat-value">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend > 0 ? 'text-success-600' : 'text-danger-600'}`}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% {trendLabel || 'vs last month'}
            </p>
          )}
        </div>
        <div className={classNames('p-3 rounded-xl', iconBgColors[iconColor])}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}