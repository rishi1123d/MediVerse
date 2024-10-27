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
    patientHistory: "",
    vitalSigns: {},
    labResults: {},
    medicationList: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const generateReport = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setReport({
        patientId: "12345",
        preOpNotes:
          "Patient presents with persistent abdominal pain and nausea. History of GERD and family history of colon cancer.",
        audioTranscription:
          "The patient's vital signs are stable. BP 120/80, HR 72, RR 16, Temp 98.6°F. Patient reports pain level of 6/10 in the upper right quadrant.",
        endoscopyAnalysis: [
          {
            timestamp: "00:05",
            description: "Esophageal mucosa appears normal",
          },
          {
            timestamp: "00:12",
            description:
              "Gastroesophageal junction shows signs of inflammation",
          },
          {
            timestamp: "00:28",
            description:
              "Suspicious lesion detected in the gastric antrum, approximately 1cm in diameter",
          },
          {
            timestamp: "00:45",
            description: "Duodenum appears normal, no signs of ulceration",
          },
        ],
        recommendations: [
          "Biopsy of the gastric antrum lesion",
          "Increase PPI dosage to manage GERD symptoms",
          "Schedule follow-up endoscopy in 3 months",
          "Refer to gastroenterologist for further evaluation",
        ],
        nextSteps: [
          "Discuss biopsy results with patient",
          "Adjust medication regimen based on biopsy findings",
          "Provide patient education on dietary modifications for GERD management",
          "Schedule follow-up appointment in 2 weeks",
        ],
        patientHistory:
          "45-year-old male with 5-year history of GERD. No previous surgeries. Non-smoker, occasional alcohol use.",
        vitalSigns: {
          bloodPressure: "120/80 mmHg",
          heartRate: "72 bpm",
          respiratoryRate: "16 breaths/min",
          temperature: "98.6°F (37°C)",
          oxygenSaturation: "98% on room air",
        },
        labResults: {
          hgb: "14.2 g/dL",
          wbc: "7.5 x 10^9/L",
          platelets: "250 x 10^9/L",
          creatinine: "0.9 mg/dL",
          alt: "25 U/L",
          ast: "22 U/L",
        },
        medicationList: [
          "Omeprazole 20mg daily",
          "Famotidine 20mg as needed",
          "Multivitamin daily",
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
                  <strong>Patient History:</strong> {report.patientHistory}
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Vital Signs:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(report.vitalSigns).map(([key, value]) => (
                    <li key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Pre-Op Notes:</h3>
                <p>{report.preOpNotes}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Audio Transcription:
                </h3>
                <p>{report.audioTranscription}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Lab Results:</h3>
                <ul className="list-disc list-inside">
                  {Object.entries(report.labResults).map(([key, value]) => (
                    <li key={key}>
                      {key.toUpperCase()}: {value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Current Medications:
                </h3>
                <ul className="list-disc list-inside">
                  {report.medicationList.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Endoscopy Analysis:
                </h3>
                <ul className="list-disc list-inside">
                  {report.endoscopyAnalysis.map((item, index) => (
                    <li key={index}>
                      {item.timestamp} - {item.description}
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
