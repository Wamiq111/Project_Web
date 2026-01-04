"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.endsWith("@gmail.com")) {
            setError("Only @gmail.com emails are allowed.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                router.push("/login");
            } else {
                const data = await res.json();
                setError(data.detail || "Signup failed");
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
                <h1 style={{ marginBottom: "1.5rem", textAlign: "center" }}>Sign Up</h1>
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Email (Gmail only)</label>
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
                        {loading ? "Registering..." : "Sign Up"}
                    </button>
                </form>
                <p style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
                    Already have an account? <Link href="/login" style={{ color: "var(--primary)" }}>Login</Link>
                </p>
            </div>
        </div>
    );
}
