import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import LoanElibility from './LoanEligibility';
import DocumentProcessing from './DocumentProcessing';
import FaceUpload from './FaceUpload';
import VirtualAIBranchManager from './VirtualAIBranchManager';
import ProfileSetup from './ProfileSetup';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import OpenAccount from './OpenAccount';
import Navbar from './NavBar';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css';

const App: React.FC = () => {
  return (
    <div> 
      <div className='pt-[80px]'>
        <Router>
        <Navbar/>
          <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/ai-branch-manager" element={<VirtualAIBranchManager />} />
              <Route path="/customer-interaction" element={<FaceUpload />} />
              <Route path="/document-processing" element={<DocumentProcessing />} />
              <Route path="/loan-eligibility" element={<LoanElibility />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/open-account" element={<OpenAccount />} />
            </Routes>
          </Router>
          </div>
    </div>
  );
}

export default App;