import { useState } from "react";
import AIInsights from "./AIInsights";
import "../../../styles/journal/JournalEntryCard.css";

export default function JournalEntryCard({ entry }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="journal-entry-card">
      {/* Collapsed summary */}
      <div
        className="journal-entry-summary"
        onClick={() => setExpanded(!expanded)}
      >
        <h4>{entry.date}</h4>
        <span className="entry-time">{entry.time}</span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="journal-entry-expanded">

          <div className="entry-text">
            {entry.text}
          </div>

          <AIInsights transcript={entry.text} />
        </div>
      )}
    </div>
  );
}
