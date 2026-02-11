import { useState } from 'react'
import { Search, ChevronDown, ShieldCheck } from 'lucide-react'
import IconRenderer from '../common/IconRenderer'

function EventFilters({ filters, onFilterChange }) {
  const [isExpanded, setIsExpanded] = useState({
    category: true,
    date: true,
    time: true,
    ageGroup: true,
    verified: true
  })

  const categories = [
    { id: 'all', label: 'All Events', icon: 'Target' },
    { id: 'wellness', label: 'Wellness', icon: 'HeartPulse' },
    { id: 'outdoors', label: 'Outdoors', icon: 'Mountain' },
    { id: 'arts', label: 'Arts', icon: 'Palette' },
    { id: 'social', label: 'Social', icon: 'Users' },
    { id: 'sports', label: 'Sports', icon: 'Trophy' },
    { id: 'workshops', label: 'Workshops', icon: 'Wrench' }
  ]

  const timeOfDay = [
    { id: 'all', label: 'Any Time', icon: 'Clock' },
    { id: 'morning', label: 'Morning (6AM-12PM)', icon: 'Sunrise' },
    { id: 'afternoon', label: 'Afternoon (12PM-5PM)', icon: 'Sun' },
    { id: 'evening', label: 'Evening (5PM-10PM)', icon: 'Sunset' }
  ]

  const ageGroups = [
    { id: 'all', label: 'All Ages' },
    { id: '18-35', label: '18-35' },
    { id: '25-45', label: '25-45' },
    { id: '35-55', label: '35-55' },
    { id: '45+', label: '45+' }
  ]

  const handleCategoryChange = (categoryId) => {
    onFilterChange({ category: categoryId })
  }

  const handleTimeChange = (timeId) => {
    onFilterChange({ timeOfDay: timeId })
  }

  const handleAgeGroupChange = (ageGroupId) => {
    onFilterChange({ ageGroup: ageGroupId })
  }

  const handleVerifiedToggle = () => {
    onFilterChange({ verified: !filters.verified })
  }

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value })
  }

  const handleDateRangeChange = (type, value) => {
    onFilterChange({
      dateRange: {
        ...filters.dateRange,
        [type]: value
      }
    })
  }

  const clearFilters = () => {
    onFilterChange({
      category: 'all',
      timeOfDay: 'all',
      ageGroup: 'all',
      verified: false,
      search: '',
      dateRange: { start: '', end: '' }
    })
  }

  const toggleSection = (section) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="card p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="input-field w-full pl-12 pr-4"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="card p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-sage-600 hover:text-sage-700 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div>
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-semibold text-gray-800">Category</h4>
            <ChevronDown size={16} className={`transform transition-transform ${isExpanded.category ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.category && (
            <div className="space-y-2">
              {categories.map(cat => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    filters.category === cat.id
                      ? 'bg-sage-400/30 border border-sage-500/50'
                      : 'bg-white/20 hover:bg-white/40 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.id}
                    checked={filters.category === cat.id}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="hidden"
                  />
                  <IconRenderer name={cat.icon} size={20} />
                  <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('date')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-semibold text-gray-800">Date Range</h4>
            <ChevronDown size={16} className={`transform transition-transform ${isExpanded.date ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.date && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                  className="input-field w-full text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                <input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                  className="input-field w-full text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Time of Day Filter */}
        <div>
          <button
            onClick={() => toggleSection('time')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-semibold text-gray-800">Time of Day</h4>
            <ChevronDown size={16} className={`transform transition-transform ${isExpanded.time ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.time && (
            <div className="space-y-2">
              {timeOfDay.map(time => (
                <label
                  key={time.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    filters.timeOfDay === time.id
                      ? 'bg-ocean-400/30 border border-ocean-500/50'
                      : 'bg-white/20 hover:bg-white/40 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="timeOfDay"
                    value={time.id}
                    checked={filters.timeOfDay === time.id}
                    onChange={() => handleTimeChange(time.id)}
                    className="hidden"
                  />
                  <IconRenderer name={time.icon} size={20} />
                  <span className="text-sm font-medium text-gray-700">{time.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Age Group Filter */}
        <div>
          <button
            onClick={() => toggleSection('ageGroup')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-semibold text-gray-800">Age Group</h4>
            <ChevronDown size={16} className={`transform transition-transform ${isExpanded.ageGroup ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.ageGroup && (
            <div className="space-y-2">
              {ageGroups.map(age => (
                <label
                  key={age.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                    filters.ageGroup === age.id
                      ? 'bg-sage-400/30 border border-sage-500/50'
                      : 'bg-white/20 hover:bg-white/40 border border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="ageGroup"
                    value={age.id}
                    checked={filters.ageGroup === age.id}
                    onChange={() => handleAgeGroupChange(age.id)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-700">{age.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Verified Organizations Toggle */}
        <div>
          <button
            onClick={() => toggleSection('verified')}
            className="flex items-center justify-between w-full mb-3 text-left"
          >
            <h4 className="font-semibold text-gray-800">Verified Only</h4>
            <ChevronDown size={16} className={`transform transition-transform ${isExpanded.verified ? 'rotate-180' : ''}`} />
          </button>
          {isExpanded.verified && (
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/20 hover:bg-white/40 cursor-pointer transition-all duration-300 border border-transparent hover:border-sage-300/50">
              <div className="flex items-center gap-3">
                <ShieldCheck size={20} className="text-sage-600" />
                <span className="text-sm font-medium text-gray-700">Show only verified events</span>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={filters.verified || false}
                  onChange={handleVerifiedToggle}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500"></div>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.category !== 'all' || filters.timeOfDay !== 'all' || filters.ageGroup !== 'all' || filters.verified || filters.search) && (
        <div className="card p-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.category !== 'all' && (
              <span className="badge badge-primary text-xs px-3 py-1.5">
                {categories.find(c => c.id === filters.category)?.label}
              </span>
            )}
            {filters.timeOfDay !== 'all' && (
              <span className="badge badge-info text-xs px-3 py-1.5">
                {timeOfDay.find(t => t.id === filters.timeOfDay)?.label}
              </span>
            )}
            {filters.ageGroup !== 'all' && (
              <span className="badge badge-primary text-xs px-3 py-1.5">
                {ageGroups.find(a => a.id === filters.ageGroup)?.label}
              </span>
            )}
            {filters.verified && (
              <span className="badge badge-success text-xs px-3 py-1.5">
                Verified Only
              </span>
            )}
            {filters.search && (
              <span className="badge badge-info text-xs px-3 py-1.5">
                Search: "{filters.search}"
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default EventFilters
