import "../../../styles/journal/Transcript.css"

function TranscriptSection({ transcript }) {
  if (!transcript) return null;

  return (
    <div className="transcript-section">
      <h3>📝 Transcription</h3>
      <div className="transcript">
        {transcript}
      </div>
    </div>
  );
}

export default TranscriptSection;