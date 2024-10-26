"use client";

import { useState } from "react";

export default function PreOp() {
  const [typedNotes, setTypedNotes] = useState("");
  const [speechToTextNotes, setSpeechToTextNotes] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleTypedNotesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setTypedNotes(e.target.value);
  };

  const handleSpeechToText = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording
      // This is a placeholder for the actual speech-to-text implementation
      console.log("Started recording");
    } else {
      // Stop recording
      console.log("Stopped recording");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("Submitting pre-op data:", { typedNotes, speechToTextNotes });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pre-Op Data Collection</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="typedNotes" className="block mb-2">
            Typed Notes:
          </label>
          <textarea
            id="typedNotes"
            value={typedNotes}
            onChange={handleTypedNotesChange}
            className="w-full p-2 border rounded"
            rows={5}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="speechToText" className="block mb-2">
            Speech to Text:
          </label>
          <button
            type="button"
            onClick={handleSpeechToText}
            className={`p-2 rounded ${
              isRecording ? "bg-red-500 text-white" : "bg-blue-500 text-white"
            }`}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
          <textarea
            id="speechToText"
            value={speechToTextNotes}
            readOnly
            className="w-full p-2 border rounded mt-2"
            rows={3}
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Submit Pre-Op Data
        </button>
      </form>
    </div>
  );
}
