# backend/scripts/data_loader.py
import os
import shutil
from pathlib import Path
import cv2
import numpy as np
from typing import Tuple, List

def prepare_training_data(source_dir: str, dest_dir: str) -> Tuple[List[np.ndarray], List[int]]:
    """
    Prepare training data from directory structure
    """
    images = []
    labels = []
    
    # Create destination directory if it doesn't exist
    os.makedirs(dest_dir, exist_ok=True)
    
    # Expected class directories
    classes = ['normal', 'polyp', 'inflammation', 'ulcer', 'tumor']
    
    for class_idx, class_name in enumerate(classes):
        class_dir = os.path.join(source_dir, class_name)
        dest_class_dir = os.path.join(dest_dir, class_name)
        
        if os.path.exists(class_dir):
            os.makedirs(dest_class_dir, exist_ok=True)
            
            for img_name in os.listdir(class_dir):
                if img_name.lower().endswith(('.png', '.jpg', '.jpeg')):
                    src_path = os.path.join(class_dir, img_name)
                    dest_path = os.path.join(dest_class_dir, img_name)
                    
                    # Copy file to destination
                    shutil.copy2(src_path, dest_path)
                    
                    # Load and preprocess image
                    img = cv2.imread(src_path)
                    if img is not None:
                        img = cv2.resize(img, (224, 224))
                        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                        img = img.astype(np.float32) / 255.0
                        
                        images.append(img)
                        labels.append(class_idx)
    
    return np.array(images), np.array(labels)

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Prepare training data')
    parser.add_argument('--source', required=True, help='Source directory with class subdirectories')
    parser.add_argument('--dest', required=True, help='Destination directory for processed data')
    
    args = parser.parse_args()
    
    X, y = prepare_training_data(args.source, args.dest)
    print(f"Prepared {len(X)} images across {len(set(y))} classes")