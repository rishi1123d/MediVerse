const express = require('express');
const multer = require('multer');
const { SpeechClient } = require('@google-cloud/speech');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const speechClient = new SpeechClient();

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioBytes = req.file.buffer;

    // Configure the request for transcription
    const audio = {
      content: audioBytes.toString('base64'),
    };
    const config = {
      encoding: 'LINEAR16', // Adjust this based on your audio format
      sampleRateHertz: 48000, // Adjust this to match your recording settings
      languageCode: 'en-US',
    };
    const request = {
      audio: audio,
      config: config,
    };

    // Transcribe audio
    const [response] = await speechClient.recognize(request);
    const transcribedText = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Save transcribed text to database
    const noteId = await saveToDatabase(transcribedText);

    res.json({
      success: true,
      text: transcribedText,
      note_id: noteId,
    });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Function to save transcribed text to the database
const saveToDatabase = async (text) => {
  const client = await pool.connect();
  try {
    const anonymizedId = generateAnonymizedId(); // Replace with your logic to generate ID
    await client.query('INSERT INTO patients (anonymizedid) VALUES ($1)', [anonymizedId]);
    
    const patientIdResult = await client.query('SELECT patientid FROM patients WHERE anonymizedid = $1', [anonymizedId]);
    const patientId = patientIdResult.rows[0].patientid;

    const datasetIdResult = await client.query(
      'INSERT INTO public.datasets (PatientID, DatasetDate) VALUES ($1, CURRENT_DATE) RETURNING datasetid',
      [patientId]
    );
    const datasetId = datasetIdResult.rows[0].datasetid;

    const noteResult = await client.query(
      'INSERT INTO preopnotes (DatasetID, NoteText) VALUES ($1, $2) RETURNING PreOpNoteID',
      [datasetId, text]
    );
    return noteResult.rows[0].PreOpNoteID;
  } finally {
    client.release();
  }
};

// Utility function to generate anonymized ID
const generateAnonymizedId = () => {
  return 'patient_' + Math.random().toString(36).substr(2, 9);
};

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});