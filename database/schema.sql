-- database/schema.sql
CREATE TABLE IF NOT EXISTS patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    medical_record_number VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS endoscopy_sessions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    date_time TIMESTAMP NOT NULL,
    video_url TEXT NOT NULL,
    results_url TEXT,
    doctor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS anomalies (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES endoscopy_sessions(id),
    timestamp FLOAT NOT NULL,
    type VARCHAR(50) NOT NULL,
    confidence FLOAT NOT NULL,
    location_x INTEGER,
    location_y INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);