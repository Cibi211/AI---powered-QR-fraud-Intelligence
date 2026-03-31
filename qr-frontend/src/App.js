import { useState, useRef } from "react";
import "./App.css";
import Gauge from "./components/Gauge";

export default function App() {

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [decoded, setDecoded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  // const [originalResult, setOriginalResult] = useState(null);
  const [language, setLanguage] = useState("en");

  const fileInputRef = useRef(null);
//   useEffect(() => {
//   if (file) {
//     uploadImage();   // 🔥 re-call API when language changes
//   }
// }, [language, file]);

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
    // formData.append("file", file);
    formData.append("file", file);
formData.append("language", language);

    try {

      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Server error");

      const data = await response.json();
       console.log("API response:", data); // optional debug

      setDecoded(data.decoded_data);
      // setResult(data);
      setResult({
  ...data,
  originalReasons: data.reasons   // ✅ store English version
});

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


      {/* Upload Card */}

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


        {error && (

          <div className="error-box">
            <div className="error-icon">!</div>
            {error}
          </div>

        )}


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
      <div className="lang-toggle">

  <button
    className={`lang-btn ${language === "en" ? "active" : ""}`}
    onClick={() => setLanguage("en")}
  >
    English
  </button>

  <button
    className={`lang-btn ${language === "ta" ? "active" : ""}`}
    onClick={() => setLanguage("ta")}
  >
    தமிழ்
  </button>

  <button
    className={`lang-btn ${language === "hi" ? "active" : ""}`}
    onClick={() => setLanguage("hi")}
  >
    हिंदी
  </button>

</div>


      {/* RESULT */}

      {result && (

        <div className="result-card">

          <div className="result-header">
            <span className="label-mono">Analysis Result</span>
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
  <span className="label-mono">Risk Score</span>
  <Gauge score={result.riskScore} />
</div>


          {/* Detection Details */}

          {result.reasons && (

  <div className="threats-section">

    <div className="threats-header">
      <span className="label-mono">Detection Details</span>
      <span className="threat-count">
        {result.reasons.length}
      </span>
    </div>

    <ul className="threats-list">

      {result.reasons.map((reason, i) => (

        <li key={i} className="threat-item">

          <div className="threat-index">
            #{i + 1}
          </div>

          <div className="threat-content">

            <div className="threat-module">
              Detector
            </div>

            <div className="threat-reason">
              {reason}   {/* ✅ Tamil/Hindi will show */}
            </div>

          </div>

        </li>

      ))}

    </ul>

  </div>

)}

        </div>

      )}
      <div style={{ marginBottom: "10px" }}>
  <b>Language:</b> {language.toUpperCase()}
</div>


      <div className="page-footer">
        QR FRAUD INTELLIGENCE SYSTEM
      </div>


    </div>

  );
}




