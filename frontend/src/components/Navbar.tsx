"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = () => {
            setIsLoggedIn(!!localStorage.getItem("isLoggedIn"));
        };

        checkLogin();
        // Watch for changes (in case of multi-tab or navigation triggers)
        const interval = setInterval(checkLogin, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
        router.push("/login");
    };

    return (
        <nav className="nav">
            <Link href="/" className="logo">
                DocConvert
            </Link>
            <div style={{ display: "flex", gap: "1rem" }}>
                {isLoggedIn ? (
                    <>
                        <button onClick={handleLogout} className="btn btn-outline">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="btn btn-outline">
                            Login
                        </Link>
                        <Link href="/signup" className="btn btn-primary">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
