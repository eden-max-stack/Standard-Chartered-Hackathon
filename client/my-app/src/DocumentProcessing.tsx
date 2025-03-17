import React, { useState } from 'react';
import "./App.css";

function DocumentProcessing() {
  const [files, setFiles] = useState<{ aadhaar?: File; pan?: File; income?: File }>({});
  const [status, setStatus] = useState<{ [key in 'aadhaar' | 'pan' | 'income']?: 'initial' | 'uploading' | 'success' | 'fail' }>({
    aadhaar: 'initial',
    pan: 'initial',
    income: 'initial',
  });

  // Handles file selection dynamically
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan' | 'income') => {
    if (e.target.files && e.target.files[0]) {
      setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
      setStatus((prev) => ({ ...prev, [type]: 'initial' })); // Reset status
    }
  };

  // Handles file upload
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

      {/* Aadhaar Upload */}
      <div className="input-group">
        <label>Aadhaar:</label>
        <input type="file" onChange={(e) => handleFileChange(e, 'aadhaar')} />
        {files.aadhaar && <FileDetails file={files.aadhaar} />}
        {files.aadhaar && <UploadButton onClick={() => handleUpload('aadhaar')} status={status.aadhaar} />}
      </div>

      {/* PAN Upload */}
      <div className="input-group">
        <label>PAN:</label>
        <input type="file" onChange={(e) => handleFileChange(e, 'pan')} />
        {files.pan && <FileDetails file={files.pan} />}
        {files.pan && <UploadButton onClick={() => handleUpload('pan')} status={status.pan} />}
      </div>

      {/* Income Upload */}
      <div className="input-group">
        <label>Income Proof:</label>
        <input type="file" onChange={(e) => handleFileChange(e, 'income')} />
        {files.income && <FileDetails file={files.income} />}
        {files.income && <UploadButton onClick={() => handleUpload('income')} status={status.income} />}
      </div>
    </div>
  );
}

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
