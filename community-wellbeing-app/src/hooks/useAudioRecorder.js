import { useRef, useState } from "react";

export function useAudioRecorder() {
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);

    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState(null);

    const startAudioRecording = async () => {
        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            mediaRecorderRef.current = new MediaRecorder(streamRef.current);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setIsPaused(false);
        } catch (err) {
            setError("Microphone permission denied");
        }
    };

    const pauseAudioRecording = () => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        }
    };

    const resumeAudioRecording = () => {
        if (mediaRecorderRef.current?.state === "paused") {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    };

    const stopAudioRecording = () => {
        return new Promise((resolve) => {
            if (!mediaRecorderRef.current) return;

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });

                streamRef.current.getTracks().forEach(track => track.stop());

                setIsRecording(false);
                setIsPaused(false);

                resolve(audioBlob);
            };

            mediaRecorderRef.current.stop();
        });
    };

    return {
        startAudioRecording,
        pauseAudioRecording,
        resumeAudioRecording,
        stopAudioRecording,
        isRecording,
        isPaused,
        error
    };
}
