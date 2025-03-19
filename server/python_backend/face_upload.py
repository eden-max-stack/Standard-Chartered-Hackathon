from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import cv2
import numpy as np
import shutil
import os
import pickle
import json
import torch
from sentence_transformers import util
from mtcnn import MTCNN
from deepface import DeepFace
import logging

app = FastAPI()

# ✅ Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# ✅ Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


### 🔹 FACE VERIFICATION FUNCTIONALITY ###
class FaceVerifier:
    def __init__(self, reference_image_path):  # ✅ Fix constructor name
        self.reference_image_path = reference_image_path
        self.detector = MTCNN()
        self.reference_embedding = self.get_face_embedding(reference_image_path)
        
        if self.reference_embedding is None:
            logging.error("No face detected in the reference image.")

    def get_face_embedding(self, image_path):
        """Extracts face embedding using DeepFace."""
        try:
            embedding = DeepFace.represent(img_path=image_path, model_name="Facenet", enforce_detection=False)
            return np.array(embedding[0]['embedding'])
        except Exception as e:
            logging.error(f"Error extracting face embedding: {e}")
            return None

    def extract_faces(self, frame):
        """Detects faces using MTCNN and returns the largest detected face."""
        faces = self.detector.detect_faces(frame)
        if not faces:
            return None
        x, y, w, h = sorted(faces, key=lambda x: x['box'][2] * x['box'][3], reverse=True)[0]['box']
        return frame[y:y+h, x:x+w]

    def verify_face(self, frame):
        """Verifies a face against the reference image."""
        face = self.extract_faces(frame)
        if face is None:
            return {"status": "error", "message": "No face detected"}

        temp_path = os.path.join(UPLOAD_DIR, "temp_face.jpg")
        cv2.imwrite(temp_path, face)

        try:
            result = DeepFace.verify(img1_path=temp_path, img2_path=self.reference_image_path, model_name="Facenet", enforce_detection=False)
            return {"status": "success", "verified": result["verified"], "match_percentage": result["distance"]}
        except Exception as e:
            logging.error(f"Verification error: {e}")
            return {"status": "error", "message": "Face verification failed"}


@app.post("/upload_reference")
async def upload_reference(file: UploadFile = File(...)):
    """Uploads the reference image for verification."""
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "Reference image uploaded successfully", "path": file_path}


@app.post("/verify_video")
async def verify_video(file: UploadFile = File(...)):
    """Uploads a video and verifies the face."""
    video_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ✅ FIX: Correct reference image path
    verifier = FaceVerifier(r"C:/Users/maxim/OneDrive/Desktop/videoVerification.mp4")

    # ✅ FIX: Extract frames from the video
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return {"message": "Error: Could not open video file"}

    success, frame = cap.read()
    cap.release()

    if not success:
        return {"message": "Error: Could not read frames from the video"}

    result = verifier.verify_face(frame)

    return {"message": "Verification complete", "result": result}


### 🔹 AI VIDEO SEARCH FUNCTIONALITY ###
# ✅ Load fine-tuned SBERT model
try:
    with open("fine_tuned_sbert.pkl", "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Error loading model:", str(e))
    model = None

# ✅ Load video dataset
try:
    with open("video_mapping.json", "r") as f:
        video_data = json.load(f)
    video_titles = [video["title"] for video in video_data["videos"]]
    video_urls = {video["title"]: video["link"] for video in video_data["videos"]}

    # Encode video titles with the trained model
    if model:
        video_embeddings = model.encode(video_titles, convert_to_tensor=True)
    else:
        video_embeddings = None

    print("✅ Video dataset loaded successfully!")
except Exception as e:
    print("❌ Error loading video dataset:", str(e))
    video_titles = []
    video_urls = {}
    video_embeddings = None


# ✅ Function to find the most relevant video
def find_video(query):
    if model is None or video_embeddings is None:
        return None  # Model or video data is missing

    query_embedding = model.encode(query, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(query_embedding, video_embeddings)
    best_match_index = torch.argmax(similarities).cpu().numpy()

    best_video_title = video_titles[best_match_index]
    return video_urls.get(best_video_title)


# ✅ API Request Model
class QueryRequest(BaseModel):
    query: str


# ✅ API Endpoint
@app.post("/get_video")
async def get_video(request: QueryRequest):
    video_url = find_video(request.query)
    
    if not video_url:
        raise HTTPException(status_code=404, detail="No matching video found.")
    
    return {"video_url": video_url}  # Returns plain Drive link (not embedded)


### 🔹 RUN FASTAPI SERVER ###
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)