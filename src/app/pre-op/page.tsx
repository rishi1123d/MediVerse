"use client";

import { useState, useRef } from "react";

// Mock function for NLX platform integration
const submitToNLX = async (data: any) => {
  console.log("Submitting to NLX:", data);
  // In a real scenario, this would send data to the NLX platform
  return { success: true, message: "Data submitted successfully" };
};

export default function PreOp() {
  const [typedNotes, setTypedNotes] = useState("");
  const [audioNotes, setAudioNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [patientFile, setPatientFile] = useState<File | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const handleTypedNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTypedNotes(e.target.value);
  };

  const handleSpeechToText = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.ondataavailable = (event) => {
          const audioUrl = URL.createObjectURL(event.data);
          setAudioNotes(audioUrl);
        };
        mediaRecorder.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    } else {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
        setIsRecording(false);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPatientFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      typedNotes,
      audioNotes,
      patientFile: patientFile ? patientFile.name : null,
    };
    const result = await submitToNLX(formData);
    alert(result.message);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pre-Op Data Collection</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Typed Notes</h2>
          <textarea
            placeholder="Enter pre-op notes here"
            value={typedNotes}
            onChange={handleTypedNotesChange}
            className="w-full p-2 border rounded"
            rows={5}
          />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Audio Notes</h2>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSpeechToText}
              className={`p-2 rounded ${
                isRecording ? "bg-red-500 text-white" : "bg-blue-500 text-white"
              }`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            {audioNotes && <audio src={audioNotes} controls />}
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Patient File Upload</h2>
          <input type="file" onChange={handleFileChange} className="w-full" />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          Submit Pre-Op Data
        </button>
      </form>
    </div>
  );
}
