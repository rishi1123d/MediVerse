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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const generateReport = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };

    generateReport();
  }, []);

  const handleDownloadPDF = () => {
    const reportContent = `
      Patient ID: ${report.patientId}
      Pre-Op Notes: ${report.preOpNotes}
      Audio Transcription: ${report.audioTranscription}
      Endoscopy Analysis: ${report.endoscopyAnalysis
        .map((item) => `${item.timestamp} - ${item.description}`)
        .join("\n")}
      Recommendations: ${report.recommendations.join("\n")}
      Next Steps: ${report.nextSteps.join("\n")}
    `;
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${report.patientId}.txt`;
    link.click();
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
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
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
        )}
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
