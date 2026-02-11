import "../../../styles/journal/TextJournalEntry.css"

import { useState } from "react";

function TextJournalEntry({ onSubmit, onStatusChange }) {
  const [status, setStatus] = useState("new"); // "new" | "typing" | "saved"
  const [text, setText] = useState("");

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    setStatus("saved");
    onStatusChange?.("saved");
    onSubmit(text);
  };

  const handleClear = () => {
    setText("");
    setStatus("new");
    onStatusChange?.("new");
  };

  return (
    <div className="text-entry-card animate-scale-in">
      <div className="text-entry-header">
        <h3>{status === "saved" ? "Your entry has been saved" : "Write your thoughts"}</h3>
      </div>

      <textarea
        placeholder="Start writing here..."
        value={text}
        onChange={handleChange}
        disabled={status === "saved"}
      />

      <div className="action-buttons">
        {status === "saved" ? (
          <button className="btn-secondary" onClick={handleClear}>
            Start New
          </button>
        ) : (
          <>
            <button className="btn-primary" onClick={handleSubmit}>
              Save to Journal
            </button>
            <button className="btn-secondary" onClick={handleClear}>
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
}
export default TextJournalEntry