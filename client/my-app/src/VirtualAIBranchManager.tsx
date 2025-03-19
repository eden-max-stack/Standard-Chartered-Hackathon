import React, { useState } from "react";
import './App.css'

const VirtualAIBranchManager: React.FC = () => {
  const [inputQuery, setInputQuery] = useState("");
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // ✅ Extract Google Drive File ID
  const extractFileID = (driveLink: string) => {
    const match = driveLink.match(/\/d\/(.+?)\//);
    return match ? match[1] : null;
  };

  // ✅ Handle user query and fetch video
  const handleQuery = async (query: string) => {
    if (!query.trim()) {
      alert("Please enter a query.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/get_video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) throw new Error("No matching video found.");

      const data = await response.json();
      console.log("✅ Fetched Video URL:", data.video_url); // Debugging output

      setVideoURL(data.video_url); // Set video URL for embedding
    } catch (error) {
      console.error(error);
      setVideoURL(null);
      alert("No matching video found.");
    }
  };

  // ✅ Handle voice input using Web Speech API
  const startListening = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("🎤 Voice Input:", transcript);
      setInputQuery(transcript);
      handleQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = (error: any) => {
      console.error("❌ Speech recognition error:", error);
      setIsListening(false);
    };
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-[#003366]">Virtual AI Branch Manager</h1>
      <p className="text-gray-700 mb-4">Ask any banking-related query, and get the most relevant video assistance instantly.</p>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask a question..."
          className="border p-2 w-full rounded"
        />

        <div className="flex gap-4">
          <button
            onClick={() => handleQuery(inputQuery)}
            className="bg-[#003366] text-white px-4 py-2 rounded transition duration-300 hover:bg-[#FF9933]"
          >
            🔍 Search
          </button>

          <button
            onClick={startListening}
            className={`px-4 py-2 rounded transition duration-300 ${isListening ? "bg-red-500" : "bg-green-500"} text-white`}
          >
            {isListening ? "🎙️ Listening..." : "🎤 Voice Input"}
          </button>
        </div>
      </div>

      {videoURL ? (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-lg font-bold text-[#003366]">Relevant Video:</h2>
          <iframe
            width="100%"
            height="315"
            src={`https://drive.google.com/file/d/${extractFileID(videoURL)}/preview`}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
      ) : (
        <p className="text-red-500 mt-4">No video found for this query.</p>
      )}
    </div>
  );
};


export default VirtualAIBranchManager;