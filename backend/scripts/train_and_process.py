# backend/scripts/train_and_process.py
import os
import sys
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from backend.models.endoscopyModel import EndoscopyModel
from backend.services.videoService import VideoService
from datetime import datetime

def train_model(data_path: str = None):
    """
    Train the endoscopy model with data
    """
    print("Initializing model training...")
    model = EndoscopyModel()
    
    if data_path and os.path.exists(data_path):
        print(f"Training with data from: {data_path}")
        # Add your training logic here
        # model.train(data_path)
        
    # Save model locally first
    local_model_path = 'local_model.h5'
    model.model.save(local_model_path)
    print(f"Model saved locally to: {local_model_path}")
    
    # Upload to cloud
    try:
        model.save_to_cloud(local_model_path)
        print("Model successfully uploaded to cloud storage")
    except Exception as e:
        print(f"Error uploading model to cloud: {e}")

def process_video(video_path: str, patient_id: str):
    """
    Process a video file and save results
    """
    print(f"Processing video: {video_path}")
    try:
        service = VideoService()
        results = service.process_video(video_path)
        
        # Save results
        result_file = service.save_results(results, patient_id)
        print(f"Results saved to: {result_file}")
        
        return results
    except Exception as e:
        print(f"Error processing video: {e}")
        return None

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Train model and process videos')
    parser.add_argument('--train', action='store_true', help='Train the model')
    parser.add_argument('--data-path', type=str, help='Path to training data')
    parser.add_argument('--process', action='store_true', help='Process a video')
    parser.add_argument('--video-path', type=str, help='Path to video file')
    parser.add_argument('--patient-id', type=str, help='Patient ID for video processing')
    
    args = parser.parse_args()
    
    if args.train:
        train_model(args.data_path)
    
    if args.process and args.video_path and args.patient_id:
        process_video(args.video_path, args.patient_id)