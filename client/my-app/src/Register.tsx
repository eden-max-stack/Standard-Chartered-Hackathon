import React, { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from '../firebase/config';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../convex/_generated/api";
import { useMutation } from "convex/react";

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [income, setIncome] = useState(0);
    const [age, setAge] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const createUser = useMutation(api.users.createUser);

    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            console.error("Email and password are required.");
            return;
        }

        console.log("Attempting to register with:", email, password);

        try {
            const res = await createUserWithEmailAndPassword(email, password);
            if (res) {

                console.log("Success! User registered:", res.user);

                const newUser = await createUser({
                    name: name,
                    age: age,
                    customerID: customerId,
                    income: income,
                    email: email,
                    password: password
                });
                console.log(newUser);
                setEmail('');
                setPassword('');
                navigate('/login');
            }
        } catch (error) {
            console.error("Firebase Auth Error:", error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input 
                type="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required />

                <label htmlFor="email">Email:</label>
                <input
                    type="email" 
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="customerId">Customer ID:</label>
                <input
                    type="text" 
                    id="customerId"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                />
                <label htmlFor="age">Age:</label>
                <input
                    type="number" 
                    id="age"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    required
                />
                <label htmlFor="income">Income:</label>
                <input
                    type="number" 
                    id="income"
                    value={income}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
            <div className="leadToLogin">
                <h4>Already have an account?</h4>
                <button onClick={() => navigate('/login')}>Login</button>
            </div>
        </div>
    );
};

export default Register;
