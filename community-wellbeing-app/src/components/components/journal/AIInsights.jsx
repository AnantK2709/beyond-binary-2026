import "../../../styles/journal/AIInsights.css"

function AIInsights({ transcript, insight }) {
  return (
    <div className="insight-card">
      <h3>📝 Transcription</h3>
      <div className="transcript">{transcript}</div>

      <div className="ai-block">
        <h4>🤖 AI Insight</h4>

        <div className="insight-section">
          <h4>Detected Emotions</h4>
          <span className="tag stressed">😟 Stressed</span>
          <span className="tag relief">😊 Relief</span>
        </div>

        <div className="insight-section">
          <h4>Activities Mentioned</h4>
          <span className="activity-tag">🏃‍♀️ Running</span>
        </div>

        <div className="recommendations-section">
          <h4>💡 Recommendations</h4>
          <div className="recommendation-item">
            <div>
              <h5>Beginner Pottery Workshop</h5>
              <p>Sunday 2:00 PM</p>
            </div>
            <button className="add-button">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIInsights
