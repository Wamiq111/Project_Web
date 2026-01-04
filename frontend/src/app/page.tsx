"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const tools = [
  { id: "pdf-to-word", name: "PDF to Word", desc: "Convert PDF files to editable Word documents.", color: "#2563eb" },
  { id: "word-to-pdf", name: "Word to PDF", desc: "Convert Word documents to high-quality PDF files.", color: "#10b981" },
  { id: "jpg-to-pdf", name: "JPG to PDF", desc: "Turn your images into a single PDF document.", color: "#f59e0b" },
  { id: "pdf-to-jpg", name: "PDF to JPG", desc: "Extract images from your PDF or convert pages to JPG.", color: "#ef4444" },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("isLoggedIn"));
  }, []);

  return (
    <main className="container">
      <section style={{ textAlign: "center", padding: "4rem 0" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem" }}>
          Document Conversion <span style={{ color: "var(--primary)" }}>Made Easy</span>
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--secondary)", maxWidth: "600px", margin: "0 auto" }}>
          The simple, fast, and secure way to convert your documents. No strings attached, just pure productivity.
        </p>
      </section>

      {!isLoggedIn && (
        <div className="card" style={{ textAlign: "center", marginBottom: "4rem", background: "rgba(37, 99, 235, 0.05)" }}>
          <h3>Get Started for Free</h3>
          <p style={{ marginBottom: "1.5rem" }}>Sign up with your Gmail account to start converting documents.</p>
          <Link href="/signup" className="btn btn-primary">Create Account</Link>
        </div>
      )}

      <div className="grid">
        {tools.map((tool) => (
          <div key={tool.id} className="card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ width: "40px", height: "4px", background: tool.color, marginBottom: "1rem", borderRadius: "2px" }}></div>
              <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{tool.name}</h2>
              <p style={{ color: "var(--secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>{tool.desc}</p>
            </div>
            {isLoggedIn ? (
              <Link href={`/tools/${tool.id}`} className="btn btn-outline" style={{ border: `1px solid ${tool.color}`, color: tool.color }}>
                Use Tool
              </Link>
            ) : (
              <Link href="/login" className="btn btn-outline">
                Login to Use
              </Link>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
