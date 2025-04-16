# SkyNet Bank Corp

## **Project Description**  
SkyNet is an **AI-powered virtual branch manager** that provides a **video-based loan assistance experience**, allowing customers to apply for loans **digitally** without visiting a physical bank. Through **interactive video conversations**, facial verification, and AI-driven document analysis, SkyNet streamlines the loan application process while ensuring a **human-like banking experience**.  

---

## **Purpose & Objectives**  
- **Enhance customer experience** by replacing traditional loan application forms with **video-based interactions**.  
- **Improve accessibility** with a virtual branch manager guiding users through the process.  
- **Automate loan eligibility checks** through AI-powered document processing and rule-based decisioning.  
- **Ensure security and accuracy** with **facial verification** and **OCR-based document validation**.

## **Key Features**  

### **1️⃣ Virtual AI Branch Manager**  
- Pre-recorded video assistant mimics a real-life bank manager.  
- AI-driven responses provide **personalized loan guidance**.  

### **2️⃣ Video-Based Customer Interaction**  
- Users **record responses** instead of filling lengthy forms.  
- **Facial verification** ensures applicant consistency.  

### **3️⃣ Simplified Document Submission & Processing**  
- Users upload **Aadhaar, PAN, or income proof** via webcam or mobile.  
- **OCR extracts** details (Name, DOB, Income, Employment Type).  

### **4️⃣ Loan Eligibility & Decisioning**  
- AI-based **rule engine evaluates eligibility** in real time.  
- Instant feedback: ✅ **Approved** | ❌ **Rejected** | 🔄 **More Info Needed**.  

## Demo Video 🎥
[![Watch the Demo](https://img.shields.io/badge/Watch%20Demo-Click%20Here-blue?style=for-the-badge)](https://drive.google.com/file/d/1k7YmHfWDa9LAMI13XD6ENo-EpHyq1Q-D/view?usp=sharing)

> Click the badge above to watch the demo video.

## Installation
```sh
# Clone the repository
git clone git@github.com:eden-max-stack/Standard-Chartered-Hackathon.git

# Navigate to the project directory
cd Standard-Chartered-Hackathon


# Install dependencies
cd client
npm install express router path date-fns cors # for backend

cd server
npm install convex react-router-dom @mui/material @emotion/react @emotion/styled axios # for frontend

# Python Dependencies to run the backend server 
pip install fastapi uvicorn opencv-python numpy mtcnn deepface python-multipart sentence-transformers torch
```

## Usage: To open 5 terminals
### Terminal 1: Run frontend
```sh
cd client/my-app
npm run dev
```

### Terminal 2: Run backend
```sh
cd server
node server.js
```

### Terminal 3: Connect to DB
```sh
cd client/my-app
npx convex dev
```

### Terminal 4: Virtual AI Branch Manager
```sh
.venv/Scripts/activate
cd server/python_backend
py server.py
```

### Terminal 5: Customer Interaction
```sh
.venv/Scripts/activate
cd server/python_backend
py face_upload.py
```

## Technologies Used
- Frontend: React TS, TailwindCSS, Material UI
- Backend: Node JS, Express JS
- AI: Python, Uvicorn, PyTorch, OpenCV, Keras 

## Contributing
Feel free to submit a pull request if you'd like to contribute! 😊

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
