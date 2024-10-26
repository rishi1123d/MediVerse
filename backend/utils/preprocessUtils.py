# backend/utils/preprocessUtils.py
import cv2
import numpy as np
from typing import Tuple

def preprocess_frame(frame: np.ndarray, target_size: Tuple[int, int] = (224, 224)) -> np.ndarray:
    """Preprocess a single frame for model input"""
    # Resize
    processed = cv2.resize(frame, target_size)
    
    # Convert to RGB if necessary
    if len(processed.shape) == 2:
        processed = cv2.cvtColor(processed, cv2.COLOR_GRAY2RGB)
    elif processed.shape[2] == 1:
        processed = cv2.cvtColor(processed, cv2.COLOR_GRAY2RGB)
    elif processed.shape[2] == 4:
        processed = cv2.cvtColor(processed, cv2.COLOR_BGRA2RGB)
    else:
        processed = cv2.cvtColor(processed, cv2.COLOR_BGR2RGB)
    
    # Normalize
    processed = processed.astype(np.float32) / 255.0
    
    return processed

def apply_clahe(image: np.ndarray) -> np.ndarray:
    """Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)"""
    lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    lab[...,0] = clahe.apply(lab[...,0])
    return cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)

def detect_blur(image: np.ndarray, threshold: float = 100.0) -> bool:
    """Detect if image is blurry"""
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    fm = cv2.Laplacian(gray, cv2.CV_64F).var()
    return fm < threshold