import "../../../styles/journal/TextJournalEntry.css"

import { useState } from "react";

function TextJournalEntry({ onSubmit }) {
  const [text, setText] = useState("");

  return (
    <div className="text-entry-card">
      <h3>Write your thoughts</h3>
      <textarea
        placeholder="Start writing here..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => onSubmit(text)}>Analyze Entry</button>
    </div>
  );
}
export default TextJournalEntry