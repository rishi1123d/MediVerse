# backend/services/videoService.py
import cv2
import numpy as np
from ..models.endoscopyModel import EndoscopyModel
from google.cloud import storage
import os
from datetime import datetime

class VideoService:
    def __init__(self):
        self.model = EndoscopyModel()
        self.model.load_from_cloud()
        
    def process_video(self, video_path: str, interval_frames: int = 30):
        results = []
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_count % interval_frames == 0:
                analysis = self.model.process_frame(frame)
                analysis['timestamp'] = frame_count / cap.get(cv2.CAP_PROP_FPS)
                results.append(analysis)
                
            frame_count += 1
            
        cap.release()
        return results
    
    def save_results(self, results, patient_id: str):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'results_{patient_id}_{timestamp}.json'
        
        client = storage.Client()
        bucket = client.bucket(os.getenv('GOOGLE_CLOUD_BUCKET_NAME'))
        blob = bucket.blob(f'results/{filename}')
        
        blob.upload_from_string(
            data=json.dumps(results),
            content_type='application/json'
        )
        
        return filename