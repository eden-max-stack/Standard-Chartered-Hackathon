import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import LoanElibility from './LoanEligibility';
import DocumentProcessing from './DocumentProcessing';
import CustomerInteraction from './CustomerInteraction';
import VirtualAIBranchManager from './VirtualAIBranchManager';
import ProfileSetup from './ProfileSetup';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import OpenAccount from './OpenAccount';

const App: React.FC = () => {
  return (
    <div> 
      <Router>
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ai-branch-manager" element={<VirtualAIBranchManager />} />
          <Route path="/customer-interaction" element={<CustomerInteraction />} />
          <Route path="/document-processing" element={<DocumentProcessing />} />
          <Route path="/loan-eligibility" element={<LoanElibility />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/open-account" element={<OpenAccount />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;