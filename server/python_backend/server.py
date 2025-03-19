import pickle
import json
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sentence_transformers import util

app = FastAPI()

# ✅ Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to ["http://localhost:3000"] for security
    allow_credentials=True,
    allow_methods=["*"],  # Allows POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)

# ✅ Load fine-tuned model safely
try:
    with open("fine_tuned_sbert.pkl", "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully!")
except Exception as e:
    print("❌ Error loading model:", str(e))
    model = None

# ✅ Load video mapping dataset safely
try:
    with open("video_mapping.json", "r") as f:
        video_data = json.load(f)
    video_titles = [video["title"] for video in video_data["videos"]]
    video_urls = {video["title"]: video["link"] for video in video_data["videos"]}

    # Encode video titles with the trained model (only if model is loaded)
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

# ✅ Function to find video
def find_video(query):
    if model is None or video_embeddings is None:
        return None  # Model or video data is missing

    query_embedding = model.encode(query, convert_to_tensor=True)
    similarities = util.pytorch_cos_sim(query_embedding, video_embeddings)
    best_match_index = torch.argmax(similarities).cpu().numpy()

    best_video_title = video_titles[best_match_index]
    return video_urls.get(best_video_title)  # Returns full Google Drive link

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

# ✅ Run FastAPI Server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
