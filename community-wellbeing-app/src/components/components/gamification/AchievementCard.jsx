const colorMap = {
  sage: 'bg-sage-100 text-sage-700 border-sage-300',
  ocean: 'bg-ocean-100 text-ocean-700 border-ocean-300',
  gold: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  orange: 'bg-orange-100 text-orange-700 border-orange-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
}

function AchievementCard({ achievement }) {
  const {
    icon,
    name,
    description,
    unlocked,
    progress = 0,
    color = 'sage',
    unlockedAt,
  } = achievement

  const badgeColors = colorMap[color] || colorMap.sage

  return (
    <div
      className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
        unlocked
          ? `${badgeColors} border-opacity-50`
          : 'bg-gray-50 text-gray-400 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`text-3xl ${unlocked ? '' : 'grayscale opacity-40'}`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={`font-bold truncate ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
              {name}
            </h4>
            {unlocked && (
              <span className="shrink-0 px-2 py-0.5 bg-sage-500 text-white rounded-full text-xs font-semibold">
                Unlocked
              </span>
            )}
          </div>
          <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {description}
          </p>

          {!unlocked && progress > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sage-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 mt-1 block">
                {progress}% complete
              </span>
            </div>
          )}

          {unlocked && unlockedAt && (
            <p className="text-xs text-gray-500 mt-1">
              Unlocked on{' '}
              {new Date(unlockedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AchievementCard
