import { useState } from "react";
import VoiceJournalRecorder from "../components/components/journal/VoiceJournalRecorder";
import TextJournalEntry from "../components/components/journal/TextJournalEntry";
import AIInsights from "../components/components/journal/AIInsights";
import JournalEntriesList from "../components/components/journal/JournalEntriesList";

import "../styles/journal/journal.css";


export default function JournalPage() {
  const [activeTab, setActiveTab] = useState("voice");
  const [transcript, setTranscript] = useState("");
  const [recorderState, setRecorderState] = useState("new");
  const [textEntryState, setTextEntryState] = useState("new"); 

  const [insight, setInsight] = useState(null);

  return (
    <div className="container">
      <header className="header">
        <h1>🎤 Journal</h1>
        <p>Express yourself naturally and receive personalized insights</p>
      </header>

      <div className="journal-tabs">
        {["voice", "text", "past"].map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "voice" && "Voice Entry"}
            {tab === "text" && "Text Entry"}
            {tab === "past" && "Past Entries"}
          </button>
        ))}
      </div>

      {activeTab === "voice" && (
        <>
          <VoiceJournalRecorder
            onComplete={setTranscript}
            onStatusChange={setRecorderState}
          />

          {recorderState === "complete" && transcript && (
            <AIInsights transcript={transcript} />
          )}
        </>
      )}

      {activeTab === "text" && (
        <>
          <TextJournalEntry
            onSubmit={setTranscript}
            onStatusChange={setTextEntryState}
          />

          {textEntryState === "submitted" && transcript && (
            <AIInsights transcript={transcript} />
          )}
        </>
      )}

      {activeTab === "past" && <JournalEntriesList />}
    </div>
  );
}
