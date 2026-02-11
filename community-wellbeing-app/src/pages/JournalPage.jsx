import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import { journalService } from '../services/journalService.js';
import { askQuestion } from "../services/aiInsightService.js"; 

import Navbar from "../components/components/common/Navbar";
import VoiceJournalRecorder from "../components/components/journal/VoiceJournalRecorder";
import TextJournalEntry from "../components/components/journal/TextJournalEntry";
import AIInsights from "../components/components/journal/AIInsights";
import JournalEntriesList from "../components/components/journal/JournalEntriesList";

import "../styles/journal/journal.css";

export default function JournalPage() {

  const { user } = useAuth();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState("voice");
  const [recorderState, setRecorderState] = useState("new");
  const [textEntryState, setTextEntryState] = useState("new"); 
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [textContent, setTextContent] = useState("");
  const [insight, setInsight] = useState(null);


  useEffect(() => {
    const isSaved = recorderState === "saved" || textEntryState === "saved";
    if (!isSaved) return;

    const content = recorderState === "saved" ? voiceTranscript : textContent;
    if (!content) return;

    (async () => {
      const entryType = recorderState === "saved" ? "voice" : "text";

      // Save to localStorage
      await journalService.addEntry(userId, {
        type: entryType,
        content: content
      });

      console.log(content)
      // Then analyze
      const result = await askQuestion(content);
      console.log("Response from API:", result);
      setInsight(result.answer);
    })();
  }, [recorderState, textEntryState, voiceTranscript, textContent]);


  return (
    <>      
    <Navbar />
    <div className="container">
      <header className="header">
        <h1 className="journal-title">Journal</h1>
          <p className="text-gray-600 text-lg">Express yourself naturally and receive personalized insights</p>
      </header>

      <div className="journal-tabs animate-scale-in">
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
      <div style={{ display: activeTab === "voice" ? "block" : "none" }}>
        <VoiceJournalRecorder
          onTranscript={setVoiceTranscript}
          onStatusChange={setRecorderState}
        />

        {recorderState === "saved" && insight && (
          <AIInsights insight={insight} />
        )}
      </div>

      <div style={{ display: activeTab === "text" ? "block" : "none" }}>
        <TextJournalEntry
          onSubmit={setTextContent}
          onStatusChange={setTextEntryState}
        />

        {textEntryState === "saved" && insight && (
          <AIInsights insight={insight} />
        )}
      </div>

        {activeTab === "past" && <JournalEntriesList userId={userId} />}
    </div>
    </>
  );
}
