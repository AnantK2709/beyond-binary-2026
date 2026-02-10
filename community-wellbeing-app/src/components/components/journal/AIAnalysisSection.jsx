import "../../../styles/journal/AIInsights.css"

function AIAnalysisSection({ insight }) {
  console.log("analysis input")
  console.log(typeof insight)
  if (!insight) return null;

  let parsedInsight;
  try {
    parsedInsight = typeof insight === 'string' ? JSON.parse(insight) : insight;
  } catch (error) {
    console.error("Failed to parse insight:", error);
    return <div className="ai-block">Error parsing AI insights</div>;
  }

  const {
    detected_emotions = [],
    detected_activities = [],
    comments = [],
  } = parsedInsight;

  console.log("activities", detected_activities)
  console.log("emotions", detected_emotions)
  console.log("comments", comments)

  return (
    <div className="ai-block">
      <h4>🤖 AI Insight</h4>

      {detected_emotions.length > 0 && (
        <div className="insight-section">
          <h4>Detected Emotions</h4>
          {detected_emotions.map((emotion) => (
            <span key={emotion} className={`tag ${emotion}`}>
              {emotion}
            </span>
          ))}
        </div>
      )}

      {detected_activities.length > 0 && (
        <div className="insight-section">
          <h4>Activities Mentioned</h4>
          {detected_activities.map((activity) => (
            <span key={activity} className="activity-tag">
              {activity}
            </span>
          ))}
        </div>
      )}

      {comments.length > 0 && (
        <div className="insight-section">
          <h4>Notes</h4>
          {comments.map((comment, idx) => (
            <p key={idx} className="ai-comment">
              {comment}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default AIAnalysisSection;
