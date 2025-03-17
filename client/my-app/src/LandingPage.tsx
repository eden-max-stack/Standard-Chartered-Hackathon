import React from 'react'
import { useNavigate } from 'react-router-dom'

function LandingPage() {
    const navigate = useNavigate();
  return (
    <div>
        <div>Hello world.</div>
        <button onClick={() => { navigate("/dashboard")}}>Dashboard</button>
        <button onClick={() => { navigate("/document-processing")}}>Document Processing</button>
        <button onClick={() => { navigate("/customer-interaction")}}>Customer Interaction</button>
        <button onClick={() => { navigate("/loan-eligibility")}}>Loan Eligibility</button>
        <button onClick={() => { navigate("/profile-setup")}}>Profile Setup</button>
        <button onClick={() => { navigate("/ai-branch-manager")}}>Virtual AI Branch Manager</button>
    </div>
  )
}

export default LandingPage