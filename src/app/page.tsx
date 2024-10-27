"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [patientId, setPatientId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (patientId) {
      setLoading(true);
      setError("");

      try {
        // Replace with your backend URL, e.g., deployed backend or localhost
        const response = await fetch(`http://127.0.0.1:8000/api/getPatient?patientId=${patientId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch patient data.");
        }

        const data = await response.json();

        // Check if the patient data was found
        if (data.patient) {
          // Store patient data in sessionStorage for further use in other components/pages
          sessionStorage.setItem("patientData", JSON.stringify(data.patient));

          // Navigate to the pre-op page
          router.push(`/pre-op?patientId=${patientId}`);
        } else {
          setError("Patient not found. Please check the ID and try again.");
        }
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("There was an error fetching the patient data.");
      } finally {
        setLoading(false);
      }
    } else {
      setError("Patient ID cannot be empty.");
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
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-semibold transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          {loading ? "Loading..." : "Fetch Patient"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
