import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';

const Login: React.FC = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [signInWithEmailandPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);   

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const res = await signInWithEmailandPassword(email, password);
            
            if (res?.user) { // Check the response, not the state
                console.log("Success! User signed in.", res.user);
                sessionStorage.setItem('user', JSON.stringify(res.user)); // Store user object
                setEmail('');
                setPassword('');
                navigate('/profile-setup');
            }
        } catch (error) {
            console.error("Error signing in:", error);
        }
    };
    
    useEffect(() => {
        if (sessionStorage.getItem('user')) navigate('/profile-setup');
    })

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input 
                type="text"
                id="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
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
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
            <div className="leadToRegister">
                <h4>Don't have an account?</h4>
                <button onClick={() => navigate('/register')}>Register</button>
            </div>
        </div>
    );
}

export default Login;