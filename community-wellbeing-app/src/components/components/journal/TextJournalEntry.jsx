import "../../../styles/journal/TextJournalEntry.css"

import { useState } from "react";

function TextJournalEntry({ onSubmit, onStatusChange }) {
  const [status, setStatus] = useState("new"); // "new" | "typing" | "submitted"
  const [text, setText] = useState("");

  const handleChange = (e) => {
    console.log("setting typing state")
    setText(e.target.value);
    if (status !== "typing") {
      setStatus("typing");
      onStatusChange?.("typing");
    }
  };

  const handleSubmit = () => {
    setStatus("submitted");
    onStatusChange?.("submitted");
    console.log("setting submitted state")
    onSubmit(text);
  };

  const handleClear = () => {
    setText("");
    setStatus("new");
    onStatusChange?.("new");
  };

  return (
    <div className="text-entry-card">
      <div className="text-entry-header">
        <h3>Write your thoughts</h3>
      </div>

      <textarea
        placeholder="Start writing here..."
        value={text}
        onChange={handleChange}
      />

      <div className="text-entry-actions">
        <button onClick={handleSubmit} disabled={!text.trim()}>
          Analyze Entry
        </button>

        <button
          type="button"
          className="clear-button"
          onClick={handleClear}
          disabled={status === "new"}
        >
          Clear
        </button>
      </div>
    </div>
  );
}
export default TextJournalEntry