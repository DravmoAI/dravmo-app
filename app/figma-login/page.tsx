"use client";
import { useState, useEffect } from "react";

export default function YourPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [figmaUrl, setFigmaUrl] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/figma/check-auth");
        if (response.ok) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("Not authenticated");
      }
    };
    checkAuth();
  }, []);

  const handleLogin = () => {
    window.location.href = "/api/figma/auth";
  };

  const handleAnalyze = async () => {
    try {
      const response = await fetch("/api/figma/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ figmaUrl }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
    }
  };

  return (
    <div>
      <div>
        {!isLoggedIn ? (
          <button onClick={handleLogin}>Login to Figma</button>
        ) : (
          <div>
            <div
              style={{
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "#f0f9ff80",
                border: "1px solid #0ea5e950",
                borderRadius: "4px",
              }}
            >
              <span style={{ color: "#0c4a6e90", fontWeight: "bold" }}>✅ Connected to Figma</span>
            </div>
            <input
              type="text"
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              placeholder="Paste Figma URL with node-id"
              style={{ width: "400px", marginRight: "10px" }}
            />
            <button onClick={handleAnalyze}>Analyze</button>
          </div>
        )}
      </div>

      {result && (
        <pre style={{ backgroundColor: "#f5f5f5", padding: "20px", marginTop: "20px" }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
