from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import speech
import psycopg2
from datetime import date
import uuid
import os
from dotenv import load_dotenv
import asyncio
from functools import partial
import io

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection settings
DB_HOST = '34.73.202.253'
DB_NAME = 'postgres'
DB_USER = 'postgres'
DB_PASS = 'Alexnet123'

credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
if not credentials_path:
    raise ValueError("Google Application Credentials not set in .env")

def get_db_connection():
    return psycopg2.connect(
    "postgresql://postgres:Alexnet123@34.73.202.253:5432/postgres"
    )

@app.post("/api/transcribe")
async def transcribe_endpoint(audio: UploadFile = File(...)):
    audio_content = await audio.read()
    transcribed_text = transcribe_audio(audio_content)
    
    return {
        "success": True,
        "text": transcribed_text,
    }


def transcribe_audio(audio_content: bytes) -> str:
    try:
        client = speech.SpeechClient()
        
        audio = speech.RecognitionAudio(content=audio_content)
        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            language_code="en-US",
            enable_automatic_punctuation=True
        )

        response = client.recognize(config=config, audio=audio)
        print(response)
        if not response.results:
            print("No transcription results found.")
            return ""
        
        transcribed_text = " ".join(
            result.alternatives[0].transcript 
            for result in response.results 
            if result.alternatives
        )
        
        print("Transcribed Text:", transcribed_text)
        return transcribed_text
        
    except Exception as e:
        print(f"Error during transcription: {str(e)}")
        raise
    

def save_to_database(text: str) -> int:
    """Save transcribed text to database."""
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # First create a patient
            anonymized_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO patients (anonymizedid) VALUES (%s) RETURNING patientid",
                (anonymized_id,)
            )
            patient_id = cur.fetchone()[0]

            # Then create a dataset
            cur.execute(
                "INSERT INTO public.datasets (PatientID, DatasetDate) VALUES (%s, %s) RETURNING datasetid",
                (patient_id, date.today())
            )
            dataset_id = cur.fetchone()[0]

            # Finally, save the note
            cur.execute(
                "INSERT INTO preopnotes (DatasetID, NoteText) VALUES (%s, %s) RETURNING PreOpNoteID",
                (dataset_id, text)
            )
            note_id = cur.fetchone()[0]
            
            conn.commit()
            return note_id
    finally:
        conn.close()

@app.post("/api/transcribe")
async def transcribe_endpoint(audio: UploadFile = File(...)):
    try:
        # Read audio file
        audio_content = await audio.read()
        
        # Transcribe audio
        transcribed_text = transcribe_audio(audio_content)
        
        return {
            "success": True,
            "text": transcribed_text,
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)