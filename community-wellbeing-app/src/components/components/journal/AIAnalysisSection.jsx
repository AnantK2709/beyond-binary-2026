import "../../../styles/journal/AIInsights.css"

function AIAnalysisSection({ insight }) {
  if (!insight) return null;

  return (
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
    </div>
  );
}

export default AIAnalysisSection;
