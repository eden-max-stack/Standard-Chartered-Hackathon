import React, { useState, useRef } from 'react';
import "./App.css";
import axios from 'axios';

function DocumentProcessing() {
  const [files, setFiles] = useState<{ aadhaar?: File; pan?: File; income?: File }>({});
  const [status, setStatus] = useState<{ [key in 'aadhaar' | 'pan' | 'income']?: 'initial' | 'uploading' | 'success' | 'fail' }>({
    aadhaar: 'initial',
    pan: 'initial',
    income: 'initial',
  });

  const [capturing, setCapturing] = useState(false);
  const [selectedType, setSelectedType] = useState<'aadhaar' | 'pan' | 'income' | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle file selection dynamically
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan' | 'income') => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
      setStatus((prev) => ({ ...prev, [type]: 'initial' }));
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      if (files.aadhaar) formData.append('aadhaar', files.aadhaar);
      if (files.pan) formData.append('pan', files.pan);
      if (files.income) formData.append('income', files.income);
  
      const response = await axios.post('http://localhost:8087/visionAPI', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error submitting files:", error);
    }
  };
  

  // Start webcam
  const startCamera = (type: 'aadhaar' | 'pan' | 'income') => {
    setSelectedType(type);
    setCapturing(true);
    setFiles((prev) => ({ ...prev, [type]: undefined })); // Remove any existing file
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error('Error accessing webcam:', error));
  };

  // Capture image from webcam
  const captureImage = () => {
    if (canvasRef.current && videoRef.current && selectedType) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `${selectedType}.jpg`, { type: 'image/jpeg' });
          setFiles((prev) => ({ ...prev, [selectedType]: file }));
          setStatus((prev) => ({ ...prev, [selectedType]: 'initial' }));
          stopCamera(); // Stop camera after capturing
        }
      }, 'image/jpeg');
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
    setCapturing(false);
    setSelectedType(null);
  };

  // Upload the selected file
  const handleUpload = async (type: 'aadhaar' | 'pan' | 'income') => {
    const file = files[type];
    if (!file) {
      alert(`No file selected for ${type.toUpperCase()}`);
      return;
    }

    setStatus((prev) => ({ ...prev, [type]: 'uploading' }));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const result = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData,
      });

      const data = await result.json();
      console.log(`Upload success for ${type}:`, data);

      setStatus((prev) => ({ ...prev, [type]: 'success' }));
    } catch (error) {
      console.error(`Upload failed for ${type}:`, error);
      setStatus((prev) => ({ ...prev, [type]: 'fail' }));
    }
  };

  return (
    <div>
      <h2>Upload Your Documents</h2>

      {/* Webcam Capture */}
      {capturing && selectedType && (
        <div>
          <video ref={videoRef} autoPlay width="300" height="200"></video>
          <canvas ref={canvasRef} width="300" height="200" style={{ display: 'none' }}></canvas>
          <button onClick={captureImage}>📸 Capture Image</button>
          <button onClick={stopCamera}>❌ Cancel</button>
        </div>
      )}

      {/* Aadhaar Upload */}
      <DocumentUpload
        label="Aadhaar"
        type="aadhaar"
        file={files.aadhaar}
        onFileChange={handleFileChange}
        onCapture={startCamera}
        onUpload={handleUpload}
        status={status.aadhaar}
        capturing={capturing}
      />

      {/* PAN Upload */}
      <DocumentUpload
        label="PAN"
        type="pan"
        file={files.pan}
        onFileChange={handleFileChange}
        onCapture={startCamera}
        onUpload={handleUpload}
        status={status.pan}
        capturing={capturing}
      />

      {/* Income Proof Upload */}
      <DocumentUpload
        label="Income Proof"
        type="income"
        file={files.income}
        onFileChange={handleFileChange}
        onCapture={startCamera}
        onUpload={handleUpload}
        status={status.income}
        capturing={capturing}
      />

      <button onClick={handleSubmit} className="submit">Submit All</button>
    </div>
  );
}

// Document Upload Component
const DocumentUpload = ({
  label,
  type,
  file,
  onFileChange,
  onCapture,
  onUpload,
  status,
  capturing
}: {
  label: string;
  type: 'aadhaar' | 'pan' | 'income';
  file?: File;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan' | 'income') => void;
  onCapture: (type: 'aadhaar' | 'pan' | 'income') => void;
  onUpload: (type: 'aadhaar' | 'pan' | 'income') => void;
  status?: string;
  capturing: boolean;
}) => (
  <div className="input-group">
    <label>{label}:</label>
    {!file && !capturing && (
      <>
        <input type="file" onChange={(e) => onFileChange(e, type)} />
        <button onClick={() => onCapture(type)}>📷 Capture from Camera</button>
      </>
    )}
    {file && <FileDetails file={file} />}
    {file && <UploadButton onClick={() => onUpload(type)} status={status} />}
  </div>
);

// Displays file details
const FileDetails = ({ file }: { file: File }) => (
  <section>
    <ul>
      <li><strong>Name:</strong> {file.name}</li>
      <li><strong>Type:</strong> {file.type}</li>
      <li><strong>Size:</strong> {file.size} bytes</li>
    </ul>
  </section>
);

// Upload Button with Status Display
const UploadButton = ({ onClick, status }: { onClick: () => void; status?: string }) => (
  <div>
    <button onClick={onClick} className="submit" disabled={status === 'uploading'}>
      {status === 'uploading' ? 'Uploading...' : 'Upload File'}
    </button>
    <Result status={status} />
  </div>
);

// Status Messages
const Result = ({ status }: { status?: string }) => {
  if (status === 'success') return <p>✅ File uploaded successfully!</p>;
  if (status === 'fail') return <p>❌ File upload failed!</p>;
  if (status === 'uploading') return <p>⏳ Uploading file...</p>;
  return null;
};

export default DocumentProcessing;
