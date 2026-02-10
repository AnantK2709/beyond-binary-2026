import "../../../styles/journal/VoiceJournalRecorder.css"

import { useState, useEffect } from "react"

function VoiceJournalRecorder({ onComplete, onStatusChange }) {

  const [status, setStatus] = useState("new"); // "new" | "recording" | "complete"
  const [seconds, setSeconds] = useState(0);

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
    setStatus("recording");
    setSeconds(0);
  };

  const stopRecording = () => {
    setStatus("complete");
    onComplete("Mock transcript from voice input");
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
            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
            {String(seconds % 60).padStart(2, "0")}
          </div>

        <button
          className="record-button recording"
            onClick = { stopRecording }
        >
          ⏹
        </button>
        </>

      )}

      {status === "complete" && (
        <>
          <div className="recorder-status">
            <h3>Recording Complete</h3>
            <p>Your entry is ready for analysis</p>
          </div>
          <button
            className="record-button"
            onClick={startRecording}
          >
            ⚪️
          </button>
        </>
      )}
    </div>
  );
}
export default VoiceJournalRecorder
