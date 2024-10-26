-- Create Patients table
CREATE TABLE Patients (
    PatientID SERIAL PRIMARY KEY,
    AnonymizedID VARCHAR(255) UNIQUE NOT NULL,
    CreatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create Datasets table
CREATE TABLE Datasets (
    DatasetID SERIAL PRIMARY KEY,
    PatientID INT,
    DatasetDate DATE NOT NULL,
    CreatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (PatientID) REFERENCES Patients(PatientID) ON DELETE CASCADE
);

-- Create PreOpNotes table
CREATE TABLE PreOpNotes (
    PreOpNoteID SERIAL PRIMARY KEY,
    DatasetID INT,
    NoteText TEXT,
    CreatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DatasetID) REFERENCES Datasets(DatasetID) ON DELETE CASCADE
);

-- Create EndoscopyNotes table
CREATE TABLE EndoscopyNotes (
    EndoscopyNoteID SERIAL PRIMARY KEY,
    DatasetID INT,
    NoteText TEXT,
    CreatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DatasetID) REFERENCES Datasets(DatasetID) ON DELETE CASCADE
);

-- Create ModelIdentifications table
CREATE TABLE ModelIdentifications (
    IdentificationID SERIAL PRIMARY KEY,
    DatasetID INT,
    IdentificationText TEXT,
    CreatedAt TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (DatasetID) REFERENCES Datasets(DatasetID) ON DELETE CASCADE
);