import tensorflow as tf
import cv2
import numpy as np
from typing import Tuple, List
from google.cloud import storage
import os
from dotenv import load_dotenv

load_dotenv()

class EndoscopyModel:
    def __init__(self):
        self.model = self._build_model()
        self.input_shape = (224, 224, 3)
        self.classes = ['normal', 'polyp', 'inflammation', 'ulcer', 'tumor']
        
    def _build_model(self):
        base_model = tf.keras.applications.EfficientNetB0(
            input_shape=self.input_shape,
            include_top=False,
            weights='imagenet'
        )
        
        model = tf.keras.Sequential([
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.Dense(256, activation='relu'),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(len(self.classes), activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def process_frame(self, frame):
        processed = cv2.resize(frame, self.input_shape[:2])
        processed = processed / 255.0
        processed = np.expand_dims(processed, axis=0)
        
        predictions = self.model.predict(processed)
        results = {
            'class': self.classes[np.argmax(predictions[0])],
            'confidence': float(predictions[0].max())
        }
        
        return results
    
    def save_to_cloud(self, local_path: str):
        client = storage.Client()
        bucket = client.bucket(os.getenv('GOOGLE_CLOUD_BUCKET_NAME'))
        blob = bucket.blob('models/endoscopy_model.h5')
        blob.upload_from_filename(local_path)

    def load_from_cloud(self):
        client = storage.Client()
        bucket = client.bucket(os.getenv('GOOGLE_CLOUD_BUCKET_NAME'))
        blob = bucket.blob('models/endoscopy_model.h5')
        blob.download_to_filename('temp_model.h5')
        self.model = tf.keras.models.load_model('temp_model.h5')
        os.remove('temp_model.h5')