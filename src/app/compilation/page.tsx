"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Compilation() {
  const [report, setReport] = useState({
    patientId: "",
    preOpNotes: "",
    audioTranscription: "",
    endoscopyAnalysis: [],
    recommendations: [],
    nextSteps: [],
  });
  const router = useRouter();

  useEffect(() => {
    // Simulating report generation
    const generateReport = async () => {
      // In a real scenario, this would fetch data from your database or API
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setReport({
        patientId: "12345",
        preOpNotes: "Patient presents with...",
        audioTranscription: "The patient's vital signs are...",
        endoscopyAnalysis: [
          { timestamp: "00:05", description: "Possible inflammation" },
          { timestamp: "00:12", description: "Unusual tissue formation" },
          {
            timestamp: "00:28",
            description: "Area requiring further examination",
          },
        ],
        recommendations: [
          "Further examination of detected anomalies",
          "Follow-up tests recommended",
          "Consult with specialist regarding unusual tissue formation",
        ],
        nextSteps: [
          "Schedule follow-up appointment",
          "Prepare detailed briefing for surgical team",
        ],
      });
    };

    generateReport();
  }, []);

  const handleDownloadPDF = () => {
    // In a real scenario, this would generate and download a PDF
    alert("PDF download functionality would be implemented here.");
  };

  const handleNewPatient = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl font-bold mb-6 text-white text-center">
          Compilation Report
        </h1>
        <div className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg backdrop-blur-sm">
          <div className="space-y-6 text-white">
            <div>
              <h2 className="text-2xl font-semibold mb-2">
                Patient ID: {report.patientId}
              </h2>
              <p>
                <strong>Pre-Op Notes:</strong> {report.preOpNotes}
              </p>
              <p>
                <strong>Audio Transcription:</strong>{" "}
                {report.audioTranscription}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Endoscopy Analysis:
              </h3>
              <ul className="list-disc list-inside">
                {report.endoscopyAnalysis.map((item, index) => (
                  <li key={index}>
                    Anomaly detected at {item.timestamp} - {item.description}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Recommendations:</h3>
              <ol className="list-decimal list-inside">
                {report.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Next Steps:</h3>
              <ul className="list-disc list-inside">
                {report.nextSteps.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDownloadPDF}
            className="px-6 py-3 bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-md hover:from-purple-500 hover:to-blue-500 transition-all duration-300 font-semibold"
          >
            Download PDF
          </button>
          <button
            onClick={handleNewPatient}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-blue-400 text-white rounded-md hover:from-green-500 hover:to-blue-500 transition-all duration-300 font-semibold"
          >
            New Patient
          </button>
        </div>
      </div>
    </div>
  );
}
