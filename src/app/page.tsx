"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [patientId, setPatientId] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientId) {
      router.push(`/pre-op?patientId=${patientId}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-7xl font-bold mb-4">MediVerse</h1>
      <p className="text-2xl mb-8 animate-fade-in-down">
        Revolutionizing Pre-Surgical Care
      </p>
      <form onSubmit={handleSubmit} className="flex space-x-4 w-full max-w-md">
        <input
          type="text"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          placeholder="Enter Patient ID"
          className="flex-grow px-4 py-2 rounded-md bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-all duration-300"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-semibold transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Start Pre-Op
        </button>
      </form>
    </div>
  );
}
