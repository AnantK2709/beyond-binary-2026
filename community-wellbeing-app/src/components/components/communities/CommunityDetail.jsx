function CommunityDetail({ community }) {
  if (!community) {
    return <div className="text-gray-500">Loading community details...</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
        <p className="text-gray-600">{community.description}</p>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {community.interests?.map((interest, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Community Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-sage-50 rounded-lg">
            <div className="text-2xl font-bold text-sage-700">{community.members}</div>
            <div className="text-sm text-gray-600">Members</div>
          </div>
          <div className="p-4 bg-sage-50 rounded-lg">
            <div className="text-2xl font-bold text-sage-700">
              {community.verified ? '✓' : '○'}
            </div>
            <div className="text-sm text-gray-600">Status</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CommunityDetail
