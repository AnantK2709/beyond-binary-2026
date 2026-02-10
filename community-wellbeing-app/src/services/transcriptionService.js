export async function uploadAudioForTranscription(audioBlob) {
    const formData = new FormData();
    // Add filename with proper extension
    formData.append("audio", audioBlob, "recording.webm");

    const res = await fetch("http://localhost:5001/api/transcribe", {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        throw new Error("Transcription failed");
    }

    return res.json();
}