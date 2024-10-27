# backend/api/main.py

from fastapi import FastAPI, HTTPException
from db import get_patient_data

# Initialize the FastAPI app
app = FastAPI()

# Define an endpoint to get patient data
@app.get("/api/getPatient")
async def get_patient(patientId: str):
    # Fetch patient data by calling the function in db.py
    patient_data = get_patient_data(patientId)
    if patient_data:
        return {"patient": patient_data}
    else:
        raise HTTPException(status_code=404, detail="Patient not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
# Run using: uvicorn backend.api.main:app --reload
