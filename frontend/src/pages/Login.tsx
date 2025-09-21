import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [profile, setProfile] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.access_token) {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('userId', data.userId);
                setMessage('Login successful!');
                await getProfile(data.access_token);
            } else {
                setMessage(data.error ?? 'Invalid credentials');
            }
        } catch (error) {
            setMessage('Something went wrong');
            console.error(error);
        }
    };

    const getProfile = async (token: string) => {
        try {
            const response = await fetch("http://localhost:3000/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            setProfile(data.user ? JSON.stringify(data.user) : data.message);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <p>{message}</p>}
            <h2>Profile</h2>
            {profile && <p>{profile}</p>}
        </div>
    )
}