# backend/scripts/setup_project.py
import os
import sys
from pathlib import Path

def create_directory_structure():
    """Create the necessary directory structure for the project"""
    # Define the base directories
    directories = [
        'data/raw',
        'data/processed',
        'data/models',
        'backend/scripts',
        'backend/models',
        'backend/routes',
        'backend/services',
        'backend/utils'
    ]
    
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    
    # Create directories
    for directory in directories:
        dir_path = project_root / directory
        os.makedirs(dir_path, exist_ok=True)
        print(f"Created directory: {dir_path}")
    
    # Create necessary placeholder files
    placeholders = {
        'backend/models/__init__.py': '',
        'backend/services/__init__.py': '',
        'backend/utils/__init__.py': '',
        'backend/scripts/__init__.py': '',
        'data/raw/.gitkeep': '',
        'data/processed/.gitkeep': '',
        'data/models/.gitkeep': ''
    }
    
    for file_path, content in placeholders.items():
        full_path = project_root / file_path
        if not full_path.exists():
            with open(full_path, 'w') as f:
                f.write(content)
            print(f"Created file: {full_path}")

if __name__ == "__main__":
    create_directory_structure()