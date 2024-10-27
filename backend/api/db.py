# backend/api/db.py

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Load environment variables from a .env file in the root directory
load_dotenv()

# Set database credentials from environment variables
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')
DB_NAME = os.getenv('DB_NAME')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT', 5432)

# Construct database URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Function to get patient data by ID
def get_patient_data(patient_id):
    session = SessionLocal()
    try:
        # Using parameterized queries to prevent SQL injection
        query = text("SELECT * FROM patients WHERE patient_id = :patient_id")
        result = session.execute(query, {"patient_id": patient_id}).fetchone()
        return dict(result) if result else None
    except Exception as e:
        print(f"Error fetching patient data: {e}")
        return None
    finally:
        session.close()
