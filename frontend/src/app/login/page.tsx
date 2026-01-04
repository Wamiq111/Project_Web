"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                localStorage.setItem("isLoggedIn", "true");
                localStorage.setItem("userEmail", email);
                router.push("/tools");
            } else {
                const data = await res.json();
                setError(data.detail || "Login failed");
            }
        } catch (err) {
            setError("Connect to backend failed. Make sure Python server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: "400px", marginTop: "10vh" }}>
            <div className="card">
                <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@gmail.com"
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: "100%", marginTop: "1rem" }}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
                    Don't have an account? <Link href="/signup" style={{ color: "var(--primary)" }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}
