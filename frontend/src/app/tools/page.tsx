"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const tools = [
    { id: "pdf-to-word", name: "PDF to Word", desc: "Convert PDF files to editable Word documents.", color: "#2563eb", icon: "📄" },
    { id: "word-to-pdf", name: "Word to PDF", desc: "Convert Word documents to high-quality PDF files.", color: "#10b981", icon: "📝" },
    { id: "jpg-to-pdf", name: "JPG to PDF", desc: "Turn your images into a single PDF document.", color: "#f59e0b", icon: "🖼️" },
    { id: "pdf-to-jpg", name: "PDF to JPG", desc: "Extract images from your PDF or convert pages to JPG.", color: "#ef4444", icon: "📷" },
];

export default function ToolsDashboard() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const loginStatus = localStorage.getItem("isLoggedIn");
        if (!loginStatus) {
            router.push("/login");
        } else {
            setIsLoggedIn(true);
        }
    }, [router]);

    if (!isLoggedIn) return null;

    return (
        <main className="container">
            <header style={{ padding: "3rem 0", textAlign: "left" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
                    Welcome Back!
                </h1>
                <p style={{ fontSize: "1.1rem", color: "var(--secondary)" }}>
                    Select a tool below to get started with your document conversion.
                </p>
            </header>

            <div className="grid">
                {tools.map((tool) => (
                    <div key={tool.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", borderTop: `4px solid ${tool.color}` }}>
                        <div>
                            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{tool.icon}</div>
                            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{tool.name}</h2>
                            <p style={{ color: "var(--secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{tool.desc}</p>
                        </div>
                        <Link href={`/tools/${tool.id}`} className="btn btn-primary" style={{ background: tool.color }}>
                            Open Tool
                        </Link>
                    </div>
                ))}
            </div>
        </main>
    );
}
