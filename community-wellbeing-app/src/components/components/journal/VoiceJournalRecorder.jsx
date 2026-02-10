import "../../../styles/journal/VoiceJournalRecorder.css"

import TranscriptSection from "./TranscriptionSection";
import { generateTranscript } from "../../../utils/voiceJournalSimulator";

import { useState, useEffect } from "react"

function VoiceJournalRecorder({ onTranscript, onStatusChange }) {

  const [status, setStatus] = useState("new"); // "new" | "recording" | "paused" | saved
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [finalDuration, setFinalDuration] = useState(0);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    if (status !== "recording") return;

    const interval = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  const startRecording = () => {
    if (status == "paused") {
      setStatus("recording");
    }
    if (status == "new" || status == "saved") {
      setStatus("recording");
      setSeconds(0);
    }
  };

  const stopRecording = async () => {
    setFinalDuration(seconds);

    const result = await generateTranscript(/* recording data */);
    setTranscript(result.transcript);
    setStatus("paused");
  };

  const formatTime = (secs) => {
    return `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  };

  const saveToJournal = () => {
    onTranscript?.(transcript)
    setStatus("saved");
    setSeconds(0);
    onStatusChange?.("saved");
    // implement saving logic
  };


  return (
    <div className="voice-recorder-card">
      {status === "new" && (
        <>
          <div className="recorder-status">
          <h3>Start a Voice Entry</h3>
          <p>Tap the button to begin recording</p>
        </div>
          <button
            className="record-button"
            onClick={startRecording}
          >
            🎤
          </button>
        </>
      )}

      {status === "recording" && (
        <>
          <div className="recorder-status">
        <h3>Recording in Progress</h3>
        <p>Speak naturally about your day</p>
        </div>
        <div className="waveform-container">
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="waveform-bar" />
          ))}
        </div>

          <div className="timer">
            {formatTime(seconds)}
          </div>

        <button
          className="record-button recording"
            onClick = { stopRecording }
        >
          ⏹
        </button>
        </>

      )}

      {status === "paused" && (
        <>
          <div className="recorder-status">
            <h3>Recording Paused</h3>
            <p>Press the button to continue recording</p>
          </div>

          {/* Frozen waveform */}
          <div className="waveform-container">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="waveform-bar frozen" />
            ))}
          </div>

          {/* Frozen timer showing final duration */}
          <div className="timer">
            {formatTime(finalDuration)}
          </div>

          <button
            className="record-button"
            onClick={startRecording}
          >
            ⚪️
          </button>
          <TranscriptSection transcript={transcript} />

          <div className="action-buttons">
            <button
              className="btn-primary"
              onClick={saveToJournal}
            >
              Save to Journal
            </button>

            <button
              className="btn-secondary"
              onClick={() => {
                setTranscript("");
                // setInsight(null);
                saveToJournal(false);
                setStatus("new");
              }}
            >
              Record Again
            </button>
          </div>
        </>
      )}

      {status === "saved" && (
        <>
          <div className="recorder-status">
            <h3>Recording Saved</h3>
            <p>You can access it in the past entries</p>
          </div>

          {/* Frozen waveform */}
          <div className="waveform-container">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="waveform-bar frozen" />
            ))}
          </div>

          {/* Frozen timer showing final duration */}
          <div className="timer">
            {formatTime(finalDuration)}
          </div>

          <TranscriptSection transcript={transcript} />

          <div className="action-buttons">
            <button
              className="btn-secondary"
              onClick={() => {
                // setTranscript("");
                // setInsight(null);
                // saveToJournal(false);
                setStatus("new");
              }}
            >
              Record Again
            </button>
          </div>
          </>
      )}
    </div>
  );
}
export default VoiceJournalRecorder
