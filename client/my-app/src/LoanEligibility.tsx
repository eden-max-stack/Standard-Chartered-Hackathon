import React from 'react';
import axios from 'axios';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';

const LoanEligibility: React.FC = () => {
  const user = JSON.parse(sessionStorage.getItem("user") ?? "{}");
  // Fetch user details
  const getDetails = useQuery(api.users.getUserByEmail, { email: user.email });

  const checkEligibility = async () => {
    console.log(user.email);

    if (!getDetails) {
      console.error("User details not available yet.");
      return;
    }

    console.log(getDetails);
    // Extract relevant details (age and income)
    const age = getDetails.age;
    const income = getDetails.income;

    console.log(age, income);
    // const { age, income } = getDetails;

    // Validate if the required fields exist
    if (age === undefined || income === undefined) {
      console.error("Age or income is missing in user data.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8087/check-eligibility", {
        data: { age, income },
      });
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  };

  return (
    <div>
      <h1>Loan Eligibility System</h1>
      <button onClick={checkEligibility}>Check</button>
    </div>
  );
};

export default LoanEligibility;
