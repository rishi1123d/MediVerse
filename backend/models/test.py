# backend/models/test.py
import tensorflow as tf
import cv2
import numpy as np
from pathlib import Path

def test_model_on_image(image_path):
    """Test the trained model on a single image"""
    # Load model
    project_root = Path(__file__).parent.parent.parent
    model_path = project_root / 'data' / 'models' / 'best_model.h5'
    
    if not model_path.exists():
        print("No trained model found! Please train the model first.")
        return
    
    model = tf.keras.models.load_model(str(model_path))
    
    # Load and preprocess image
    img = cv2.imread(str(image_path))
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)
    
    # Make prediction
    classes = ['normal', 'polyp', 'inflammation', 'ulcer', 'tumor']
    prediction = model.predict(img)
    predicted_class = classes[np.argmax(prediction[0])]
    confidence = float(prediction[0].max())
    
    print(f"Predicted class: {predicted_class}")
    print(f"Confidence: {confidence:.2%}")
    
    return predicted_class, confidence

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        test_model_on_image(sys.argv[1])
    else:
        print("Please provide an image path to test")