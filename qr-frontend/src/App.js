

import { useState, useRef } from "react";
import "./App.css";

export default function App() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [decoded, setDecoded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {

    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError(null);
    setFile(f);
    setResult(null);
    setDecoded(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const uploadImage = async () => {

    if (!file) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {

      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();

      setDecoded(data.decoded_data);
      setResult(data.analysis);

    } catch (err) {

      console.error(err);
      setError("Backend connection failed");

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="page">

      {/* Header */}

      <div className="page-header">

        <div className="system-online">
          <span className="pulse-dot"></span>
          SYSTEM ONLINE
        </div>

        <h1 className="title">
          QR FRAUD<br/>INTELLIGENCE
        </h1>

        <div className="subtitle">
          AI POWERED DETECTION ENGINE
        </div>

      </div>


      {/* Main Card */}

      <div className="card">

        <div
          className={`upload-zone ${preview ? "has-preview" : ""}`}
          onClick={() => fileInputRef.current?.click()}
        >

          {!preview && (

            <div className="upload-prompt">

              <div className="upload-icon">
                ⬆
              </div>

              <div className="upload-title">
                Upload QR image or <span className="link-text">click to browse</span>
              </div>

              <div className="upload-sub">
                PNG · JPG · WEBP
              </div>

            </div>

          )}

          {preview && (

            <div className="preview-wrap">

              <img
                src={preview}
                alt="QR preview"
                className="qr-preview"
              />

              <div className="file-name">
                {file?.name}
              </div>

            </div>

          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

        </div>


        {/* Error */}

        {error && (

          <div className="error-box">

            <div className="error-icon">!</div>

            {error}

          </div>

        )}


        {/* Button */}

        <button
          className={`scan-btn ${!file ? "idle" : ""}`}
          onClick={uploadImage}
          disabled={loading || !file}
        >

          {loading ? (
            <>
              <span className="spinner"></span>
              ANALYZING...
            </>
          ) : (
            <>
              <span className="btn-icon">🔍</span>
              SCAN QR
            </>
          )}

        </button>

      </div>


      {/* Result */}

      {result && (

        <div className="result-card">

          <div className="result-header">

            <div>
              <span className="label-mono">Analysis Result</span>
            </div>

          </div>


          {decoded && (

            <div className="decoded-block">

              <span className="label-mono">Decoded QR Data</span>

              <div className="decoded-url">
                {decoded}
              </div>

            </div>

          )}


          {/* Risk Score */}

          <div className="risk-meter">

            <div className="risk-meter-header">

              <span className="label-mono">Risk Score</span>

              <span className="risk-score-value">
                {result.risk_score}
              </span>

            </div>

            <div className="meter-track">

              <div
                className="meter-fill"
                style={{
                  width: `${result.risk_score}%`,
                  background:
                    result.risk_score > 70
                      ? "var(--red)"
                      : result.risk_score > 40
                      ? "var(--amber)"
                      : "var(--green)"
                }}
              />

            </div>

          </div>


          {/* Detection Details */}

          {result.explanations && (

            <div className="threats-section">

              <div className="threats-header">

                <span className="label-mono">
                  Detection Details
                </span>

                <span className="threat-count">
                  {result.explanations.length}
                </span>

              </div>

              <ul className="threats-list">

                {result.explanations.map((e, i) => (

                  <li key={i} className="threat-item">

                    <div className="threat-index">
                      #{i + 1}
                    </div>

                    <div className="threat-content">

                      <div className="threat-module">
                        {e.module}
                      </div>

                      <div className="threat-reason">
                        {e.reason}
                      </div>

                    </div>

                  </li>

                ))}

              </ul>

            </div>

          )}

        </div>

      )}

      <div className="page-footer">
        QR FRAUD INTELLIGENCE SYSTEM
      </div>

    </div>

  );
}