import "../../../styles/journal/VoiceJournalRecorder.css"

function VoiceJournalRecorder({ onComplete }) {
  return (
    <div className="voice-recorder-card">
      <h3>Recording in Progress</h3>
      <p>Speak naturally about your day</p>

      <div className="waveform-container">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="waveform-bar" />
        ))}
      </div>

      <div className="timer">00:03</div>

      <button
        className="record-button recording"
        onClick={() => onComplete("Mock transcript from voice input")}
      >
        ⏹️
      </button>
    </div>
  );
}
export default VoiceJournalRecorder
