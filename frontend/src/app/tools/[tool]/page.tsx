"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

const toolInfo: any = {
    "pdf-to-word": { name: "PDF to Word", endpoint: "/convert/pdf-to-word", accept: ".pdf", multiple: false },
    "word-to-pdf": { name: "Word to PDF", endpoint: "/convert/word-to-pdf", accept: ".docx,.doc", multiple: false },
    "jpg-to-pdf": { name: "JPG to PDF", endpoint: "/convert/jpg-to-pdf", accept: ".jpg,.jpeg", multiple: true },
    "pdf-to-jpg": { name: "PDF to JPG", endpoint: "/convert/pdf-to-jpg", accept: ".pdf", multiple: false },
};

export default function ToolPage() {
    const { tool } = useParams();
    const info = toolInfo[tool as string];
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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

    if (!info) return <div className="container">Tool not found</div>;
    if (!isLoggedIn) return null;

    const handleConvert = async () => {
        if (!files || files.length === 0) {
            setError("Please select at least one file.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        if (info.multiple) {
            Array.from(files).forEach((file) => formData.append("files", file));
        } else {
            formData.append("file", files[0]);
        }

        try {
            const res = await fetch(`http://localhost:8000${info.endpoint}`, {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                // Get filename from header or use default
                const contentDisposition = res.headers.get("content-disposition");
                let filename = "converted_file";
                if (contentDisposition) {
                    const match = contentDisposition.match(/filename="(.+)"/);
                    if (match) filename = match[1];
                }
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                const data = await res.json();
                setError(data.detail || "Conversion failed");
            }
        } catch (err) {
            setError("Connect to backend failed. Make sure Python server is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ textAlign: "center", padding: "4rem 0" }}>
            <div className="card" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h1 style={{ marginBottom: "1rem" }}>{info.name}</h1>
                <p style={{ color: "var(--secondary)", marginBottom: "2rem" }}>
                    Select the files you want to convert.
                </p>

                <div className="input-group" style={{ border: "2px dashed var(--border)", padding: "2rem", borderRadius: "12px" }}>
                    <input
                        type="file"
                        accept={info.accept}
                        multiple={info.multiple}
                        onChange={(e) => setFiles(e.target.files)}
                        style={{ display: "none" }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" style={{ cursor: "pointer" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📁</div>
                        {files ? (
                            <p>{files.length} file(s) selected</p>
                        ) : (
                            <p>Click here or drag and drop to select files</p>
                        )}
                    </label>
                </div>

                {error && <p className="error-message" style={{ marginTop: "1rem" }}>{error}</p>}

                <button
                    onClick={handleConvert}
                    className="btn btn-primary"
                    style={{ width: "100%", marginTop: "2rem", padding: "1rem" }}
                    disabled={loading || !files}
                >
                    {loading ? "Processing..." : "Convert Now"}
                </button>
            </div>
        </div>
    );
}
