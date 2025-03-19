import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const LoanEligibility: React.FC = () => {
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");

  // Fetch user details
  const getDetails = useQuery(api.users.getUserByEmail, { email: user.email });

  // Mutation to update user loans
  const updateUserLoans = useMutation(api.users.incrementLoanCount);

  // State for eligibility check
  const [isEligible, setIsEligible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState<string | null>(null);

  const checkEligibility = async () => {
    console.log(user.email);

    if (!getDetails) {
      console.error("User details not available yet.");
      setEligibilityMessage("Fetching user data... Please try again.");
      return;
    }

    console.log(getDetails);
    
    const { age, income, loans } = getDetails;

    if (age === undefined || income === undefined) {
      console.error("Age or income is missing in user data.");
      setEligibilityMessage("Invalid user data. Please update your profile.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8087/check-eligibility", {
        data: { age, income, loans },
      });

      console.log("Response:", response.data);

      // If the API confirms eligibility, enable the button
      if (response.data.eligible) {
        setIsEligible(true);
        setEligibilityMessage("🎉 Congratulations! You are eligible for a loan.");
      } else {
        setIsEligible(false);
        setEligibilityMessage("❌ Unfortunately, you are not eligible for a loan.");
      }
    } catch (error) {
      console.error("Error checking eligibility:", error);
      setIsEligible(false);
      setEligibilityMessage("⚠️ Error checking eligibility. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const applyForLoan = async () => {
    try {
      await updateUserLoans({ uid: user.uid });
      console.log("Loan applied successfully!");
      setEligibilityMessage("✅ Loan application submitted successfully!");
    } catch (error) {
      console.error("Error applying for loan:", error);
      setEligibilityMessage("⚠️ Error applying for a loan. Try again.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center text-center px-6 pt-25">
      {/* Title */}
      <h1 className="text-5xl font-bold text-[#003366] drop-shadow-md mb-6">
        Loan Eligibility Checker
      </h1>
  
      {/* Description */}
      <p className="text-lg text-gray-900 max-w-2xl mb-8">
        Find out if you're eligible for a loan based on your financial profile. 
        Click below to check your eligibility and apply for a loan instantly.
      </p>
  
      {/* Buttons */}
      <div className="flex flex-col md:flex-row gap-6">
        <button
          onClick={checkEligibility}
          className="px-8 py-4 text-lg font-semibold rounded-lg bg-[#003366] text-white hover:bg-[#FF9933] transition-all"
        >
          {loading ? "Checking..." : "Check Eligibility"}
        </button>
  
        <button
          onClick={applyForLoan}
          disabled={!isEligible}
          className={`px-8 py-4 text-lg font-semibold rounded-lg ${
            isEligible
              ? "bg-[#003366] text-white hover:bg-[#FF9933] transition-all"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          Apply for Loan
        </button>
      </div>
  
      {/* Eligibility Message */}
      {eligibilityMessage && (
        <p className="mt-6 text-lg font-medium text-gray-900">{eligibilityMessage}</p>
      )}
    </div>
  );
  
};

export default LoanEligibility;
