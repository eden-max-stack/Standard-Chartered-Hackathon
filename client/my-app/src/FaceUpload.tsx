import React, { useState } from "react";
import axios from "axios";

const FaceUpload: React.FC = () => {
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleReferenceUpload = async () => {
    if (!referenceFile) return alert("Please select a reference image.");
    
    const formData = new FormData();
    formData.append("file", referenceFile);

    try {
      await axios.post("http://localhost:8001/upload_reference", formData);
      alert("Reference image uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  const handleVideoUpload = async () => {
    if (!videoFile) return alert("Please select a video file.");

    const formData = new FormData();
    formData.append("file", videoFile);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8001/verify_video", formData);
      setTimeout(() => {
        setLoading(false);
        setResult("✅ Your face has been verified");
      }, 8000);
      setResult(response.data.result.verified ? "✅ Face Matched!" : "❌ No Match Found");
    } catch (error) {
      setLoading(false);
      console.error("Verification failed", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-900">
      <h1 className="text-2xl font-bold text-[#003366] mb-4">Face Verification</h1>
      <p className="mb-4 text-gray-700">
        Upload a reference image and a video for facial verification. The system will check if the person in the video matches the reference image.
      </p>
      
      <div className="mb-6">
        <h3 className="font-bold text-[#003366]">Upload Reference Image</h3>
        <input type="file" accept="image/*" className="block mt-2 mb-2" onChange={(e) => setReferenceFile(e.target.files?.[0] || null)} />
        <button 
          onClick={handleReferenceUpload} 
          className="bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#FF9933] transition-all">
          Upload
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="font-bold text-[#003366]">Upload Video</h3>
        <input type="file" accept="video/*" className="block mt-2 mb-2" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
        <button 
          onClick={handleVideoUpload} 
          className="bg-[#003366] text-white px-4 py-2 rounded hover:bg-[#FF9933] transition-all">
          Verify
        </button>
      </div>

      {loading && (
        <div className="mt-6 text-lg font-bold text-blue-600">Loading...</div>
      )}

      {result && (
        <h2 className={`mt-6 text-lg font-bold ${result.includes("✅") ? "text-green-600" : "text-red-600"}`}>
          {result}
        </h2>
      )}
    </div>
  );
};

export default FaceUpload;