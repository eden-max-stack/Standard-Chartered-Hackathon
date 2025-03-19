import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "convex/_generated/dataModel"; // Ensure you import Id type
import { v4 as uuidv4 } from "uuid";


const OpenAccount: React.FC = () => {
    const navigate = useNavigate();

    // File states
    const [files, setFiles] = useState<{ [key in "aadhaar" | "pan" | "income" | "selfie"]?: File }>({});
    const [status, setStatus] = useState<{ [key in "aadhaar" | "pan" | "income" | "selfie"]?: "initial" | "uploading" | "success" | "fail" }>({});
    const [password, setPassword] = useState('');
    const [extractedData, setExtractedData] = useState({ name: "", dob: "", gender: "", income: "", employment: "", aadhaar_number: "", pan_number: "" });

    const user = JSON.parse(sessionStorage.getItem("user") ?? "{}"); // Parse safely
    const userUid = user.uid;
    const userEmail = user.email;


    //const uploadFile = useMutation(api.accounts.uploadFile);
    const createAccount = useMutation(api.accounts.createAccount);
    const createUser = useMutation(api.users.createUser);
    const updateAccounts = useMutation(api.users.incrementAccountCount);
    const checkNewJoinee = useQuery(api.users.getUserByUid, { uid: userUid });

    const [formData, setFormData] = useState({
        uid: "",
        name: "",
        password: "",
        dob: "",
        gender: "",
        aadhaar_number: "",
        pan_number: "",
        income: "",
        employment: "",
        address: "",
        accountType: "savings",
        depositAmount: 0,
        debitCard: false,
        netBankingUsername: "",
        netBankingPassword: "",
        termsAgreed: false,
    });


    const [accountType, setAccountType] = useState("");
    const [depositAmount, setDepositAmount] = useState("");
    const [termsAgreed, setTermsAgreed] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [capturing, setCapturing] = useState(false);
    const [selectedType, setSelectedType] = useState<"aadhaar" | "pan" | "income" | "selfie" | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
        if (e.target.files && e.target.files[0]) {
        setFiles((prev) => ({ ...prev, [type]: e.target.files![0] }));
        setStatus((prev) => ({ ...prev, [type]: "initial" }));
        }
    };

    const startCamera = (type: keyof typeof files) => {
        setSelectedType(type);
        setCapturing(true);
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream;
        }
        });
    };

    const captureImage = () => {
        if (canvasRef.current && videoRef.current && selectedType) {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        // Set canvas size to match video stream
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame onto canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas content to Blob and store it as a File
        canvas.toBlob((blob) => {
            if (blob) {
            const file = new File([blob], `${selectedType}.jpg`, { type: "image/jpeg" });

            // Store the captured image in state
            setFiles((prev) => ({ ...prev, [selectedType]: file }));
            setStatus((prev) => ({ ...prev, [selectedType]: "initial" }));

            stopCamera();
            }
        }, "image/jpeg");
        }
    };


    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
        }
        setCapturing(false);
        setSelectedType(null);
    };

    const handleUpload = async () => {
        if (!files.aadhaar || !files.pan || !files.income || !files.selfie) {
        alert("Please upload all required documents");
        return;
        }

        setStatus({ aadhaar: "uploading", pan: "uploading", income: "uploading", selfie: "uploading" });

        const formData = new FormData();
        Object.entries(files).forEach(([key, file]) => file && formData.append(key, file));

        try {
        const { data } = await axios.post("http://localhost:8087/visionAPI", formData);
        console.log(data);

        // Extract details from API response
        const extractedDetails = { name: "", dob: "", gender: "", income: "", employment: "", aadhaar_number: "", pan_number: "" };

        data.results.forEach((item: any) => {
            if (item.type === "aadhaar") {
            extractedDetails.aadhaar_number = item.data.aadhaar_number || "";
            extractedDetails.name = item.data.name || extractedDetails.name; // Prefer Aadhaar name
            extractedDetails.dob = item.data.dob || extractedDetails.dob;
            extractedDetails.gender = item.data.gender || extractedDetails.gender;
            } else if (item.type === "pan") {
            extractedDetails.pan_number = item.data.pan_number || "";
            extractedDetails.name = item.data.name || extractedDetails.name; // Prefer PAN name if Aadhaar name is null
            } else if (item.type === "income") {
            extractedDetails.income = item.data.income || extractedDetails.income;
            extractedDetails.employment = item.data.employment_type || extractedDetails.employment;
            }
        });

        // set form data
        
        const user = JSON.parse(sessionStorage.getItem("user") ?? "{}"); // Parse safely
        setFormData((prev) => ({ ...prev, uid: user.uid || "" })); 
        setFormData((prev) => ({...prev, name: extractedDetails.name}));
        setFormData((prev) => ({...prev, dob: extractedDetails.dob}));
        setFormData((prev) => ({...prev, gender: extractedDetails.gender}));
        setFormData((prev) => ({...prev, aadhaar_number: extractedDetails.aadhaar_number}));
        setFormData((prev) => ({...prev, pan_number: extractedDetails.pan_number}));
        setFormData((prev) => ({...prev, income: extractedDetails.income}));
        setFormData((prev) => ({...prev, employment: extractedDetails.employment}));

        setExtractedData(extractedDetails);
        setStatus({ aadhaar: "success", pan: "success", income: "success", selfie: "success" });

        } catch (error) {
        console.error("Upload failed", error);
        setStatus({ aadhaar: "fail", pan: "fail", income: "fail", selfie: "fail" });
        }
    };

    function useUploadFile() {
        const generateUploadUrl = useMutation(api.accounts.generateUploadUrl);

        return async (file: File) => {
            const uploadUrl = await generateUploadUrl();

            const response = await fetch(uploadUrl, {
                method: "POST",
                body: file,
            });

            if (!response.ok) {
                throw new Error("File upload failed");
            }

            const { storageId } = await response.json();
            return storageId;
        };
    }

    const uploadFileConvex = useUploadFile(); // ✅ Hook is called inside a component


    const handleUploadConvex = async () => {
        if (!files.aadhaar || !files.pan || !files.selfie) {
            alert("Please upload Aadhaar, PAN, and Selfie documents.");
            return;
        }
    
        setStatus({ aadhaar: "uploading", pan: "uploading", income: "uploading", selfie: "uploading" });
    
        try {
            const uploadPromises = Object.entries(files).map(async ([key, file]) => {
                if (file instanceof File) {
                    console.log({ file });
                    const id = await uploadFileConvex(file); // ✅ Now properly using the hook
                    console.log(id);
                    return { key, id };
                } else {
                    console.error(`Invalid file for ${key}:`, file);
                    throw new Error(`Invalid file type for ${key}`);
                }
            });
    
            const uploadedFiles = await Promise.all(uploadPromises);
            const fileIds = Object.fromEntries(uploadedFiles.map(({ key, id }) => [key, id])) as {
                aadhaar: Id<"_storage">;
                pan: Id<"_storage">;
                income?: Id<"_storage">;
                selfie: Id<"_storage">;
            };
    
            setStatus({ aadhaar: "success", pan: "success", income: "success", selfie: "success" });
            return fileIds;
        } catch (error) {
            console.error("File upload failed:", error);
            setStatus({ aadhaar: "fail", pan: "fail", income: "fail", selfie: "fail" });
            throw error;
        }
    };
    
    const handleSubmit = async () => {
        if (!formData.termsAgreed) {
            console.error("User did not agree to terms.");
            alert("You must agree to the terms.");
            return;
        }
    
        try {
            console.log(formData);
            console.log("Starting file upload process...");
            const fileIds = await handleUploadConvex();
    
            if (!fileIds) {
                console.error("File upload failed, aborting form submission.");
                alert("File upload failed.");
                return;
            }
    
            console.log("File upload successful, proceeding with account creation...");
    
            const newAccountId = await createAccount({
                personalDetails: {
                    uid: formData.uid, // Make sure UID is included
                    name: formData.name,
                    dob: formData.dob,
                    gender: formData.gender,
                    aadhaar_number: formData.aadhaar_number,
                    pan_number: formData.pan_number,
                    income: formData.income || undefined,
                    employment: formData.employment || undefined,
                },
                documents: {
                    aadhaar: fileIds.aadhaar,
                    pan: fileIds.pan,
                    income: fileIds.income || undefined,
                    selfie: fileIds.selfie,
                },
                account: {
                    type: formData.accountType === "savings" ? "savings" : undefined, // Default to 'savings'
                    depositAmount: formData.depositAmount,
                    accountId: uuidv4()
                },
            });
    
            console.log("Account successfully created, ID:", newAccountId);

            // checking if user is new joinee of bank
            if (checkNewJoinee === undefined) {
                console.log("Loading user data...");
                return;
              }

            console.log(`formData.uid: ${formData.uid}`);
              
            if (!checkNewJoinee) {
                const createNewUser = createUser({
                    uid: userUid,
                    name: formData.name,
                    age: calculateAge(formData.dob),
                    customerID: uuidv4(),
                    income: Number(formData.income),
                    email: userEmail,
                    password: formData.password,
                    accounts: 1,
                    loans: 0
                })

                console.log(createNewUser);
            } else {

                await updateAccounts({ uid: userUid });
                console.log("Existing user - Account count updated!");
            }

            console.log("new account created and user logged into users table.")
            
            alert("Account created! ID: " + newAccountId);
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Failed to create account.");
        }
    };
    
    const calculateAge = (dobString: string): number => {
        const dob = new Date(dobString); // Convert string to Date object
        const today = new Date();
      
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
      
        // Adjust age if the birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age--;
        }
      
        return age;
      };


      return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg text-gray-900">
          <h1 className="text-2xl font-bold mb-4 text-[#003366]">Open New Account</h1>
          <p className="text-sm text-gray-700 mb-6">Complete the form below to open a new account. Ensure all details are correct before submission.</p>
    
          <h2 className="font-bold text-[#003366] mb-2">KYC Verification</h2>
          {(["aadhaar", "pan", "income", "selfie"] as const).map((type) => (
            <div key={type} className="mb-4">
              <label className="block font-bold text-gray-900">{type.toUpperCase()}:</label>
              <input type="file" accept="image/*" className="mb-2 border p-2 w-full rounded" onChange={(e) => handleFileChange(e, type)} />
              <button 
                className="bg-[#003366] text-white px-3 py-1 rounded hover:bg-[#FF9933] transition"
                onClick={() => startCamera(type)}
              >📷 Capture</button>
            </div>
          ))}
    
          {capturing && (
            <div className="mb-4">
              <video ref={videoRef} autoPlay className="w-full h-64 border rounded" />
              <canvas ref={canvasRef} className="hidden"></canvas>
              <button 
                className="bg-[#003366] text-white px-3 py-1 mt-2 rounded hover:bg-[#FF9933] transition"
                onClick={captureImage}
              >📸 Capture Image</button>
              <button 
                className="bg-red-500 text-white px-3 py-1 mt-2 rounded hover:bg-red-600 transition"
                onClick={stopCamera}
              >❌ Stop Camera</button>
            </div>
          )}
    
          <button 
            className="bg-[#003366] text-white px-4 py-2 rounded mt-4 w-full hover:bg-[#FF9933] transition"
            onClick={handleUpload}
          >Upload Documents</button>
    
          <h2 className="font-bold text-[#003366] mt-6">Personal Details</h2>
          <input className="border p-2 w-full rounded mb-2" value={extractedData.name} onChange={(e) => {
              setExtractedData({ ...extractedData, name: e.target.value });
              setFormData((prev) => ({...prev, name: e.target.value}))}} placeholder="Full Name" />
          <input className="border p-2 w-full rounded mb-2" value={extractedData.dob} onChange={(e) => {
              setExtractedData({ ...extractedData, dob: e.target.value });
              setFormData((prev) => ({...prev, dob: e.target.value}))}} placeholder="Date of Birth" />
          <input className="border p-2 w-full rounded mb-2" value={extractedData.gender} onChange={(e) => {
              setExtractedData({ ...extractedData, gender: e.target.value });
              setFormData((prev) => ({...prev, gender: e.target.value}))}} placeholder="Gender" />
          <input className="border p-2 w-full rounded mb-2" value={extractedData.aadhaar_number} onChange={(e) => {
              setExtractedData({...extractedData, aadhaar_number: e.target.value});
              setFormData((prev) => ({...prev, aadhaar_number: e.target.value}));
          }} placeholder="Aadhaar Number"/>
          <input className="border p-2 w-full rounded mb-2" value={extractedData.pan_number} onChange={(e) => {
              setExtractedData({ ...extractedData, pan_number: e.target.value });
              setFormData((prev) => ({...prev, pan_number: e.target.value}))}} placeholder="PAN Number"/>
          <input className="border p-2 w-full rounded mb-2" value={extractedData.income} onChange={(e) => {
              setExtractedData({ ...extractedData, income: e.target.value });
              setFormData((prev) => ({...prev, income: e.target.value}))}} placeholder="Income" />
          <input className="border p-2 w-full rounded mb-2" value={extractedData.employment} onChange={(e) => {
              setExtractedData({ ...extractedData, employment: e.target.value });
              setFormData((prev) => ({...prev, employment: e.target.value}))}} placeholder="Employment Type" />
          <input className="border p-2 w-full rounded mb-2" value={password} onChange={(e) => {
              setFormData((prev) => ({...prev, password: e.target.value}));
              setPassword(e.target.value);
          }} placeholder="Password" type="password" />
          
          <h2 className="font-bold text-[#003366] mt-6">Account Setup</h2>
          <select className="border p-2 w-full rounded mb-2" value={accountType} onChange={(e) => {
              setAccountType(e.target.value);
              setFormData((prev) => ({...prev, accountType: e.target.value}))}}>
              <option value="">Select Account Type</option>
              <option value="savings">Savings</option>
              <option value="premium">Premium Savings</option>
          </select>
          <input className="border p-2 w-full rounded mb-2" type="number" placeholder="Initial Deposit" value={depositAmount || ""}  onChange={(e) => {
               const value = e.target.value ? Number(e.target.value) : 0;
              setDepositAmount(e.target.value);
              setFormData((prev) => ({...prev, depositAmount: value}))}} />
    
          <h2 className="font-bold text-[#003366] mt-6">Terms & Conditions</h2>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={formData.termsAgreed} onChange={(e) => {
                    setTermsAgreed(e.target.checked);
                    setFormData((prev) => ({
                    ...prev,
                    termsAgreed: e.target.checked,
                    }));
                }}
            /> 
            <span className="text-gray-700">I agree to the T&C</span>
          </div>
    
          <button 
            onClick={handleSubmit} 
            className={`w-full text-white p-2 rounded mt-4 transition ${termsAgreed ? "bg-[#003366] hover:bg-[#FF9933]" : "bg-gray-400"}`}
          >Submit</button>
        </div>
    );
    
};

export default OpenAccount;
