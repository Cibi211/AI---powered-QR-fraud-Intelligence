import { useState, useRef, useEffect } from "react";

const SCAN_LINES = 20;

function ParticleField() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: i % 3 === 0 ? "2px" : "1px",
            height: i % 3 === 0 ? "2px" : "1px",
            background: i % 5 === 0 ? "#00ff88" : i % 3 === 0 ? "#00cfff" : "rgba(255,255,255,0.3)",
            borderRadius: "50%",
            left: `${(i * 37 + 7) % 100}%`,
            top: `${(i * 53 + 13) % 100}%`,
            animation: `float ${4 + (i % 5)}s ease-in-out ${i * 0.3}s infinite alternate`,
            boxShadow: i % 5 === 0 ? "0 0 6px #00ff88" : i % 3 === 0 ? "0 0 4px #00cfff" : "none",
          }}
        />
      ))}
    </div>
  );
}

function GridBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0,
      backgroundImage: `
        linear-gradient(rgba(0,207,255,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0,207,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
      pointerEvents: "none"
    }} />
  );
}

function ScanAnimation({ active }) {
  return active ? (
    <div style={{
      position: "absolute", inset: 0, overflow: "hidden",
      borderRadius: "12px", pointerEvents: "none", zIndex: 10
    }}>
      <div style={{
        position: "absolute", left: 0, right: 0, height: "3px",
        background: "linear-gradient(90deg, transparent, #00ff88, #00cfff, transparent)",
        boxShadow: "0 0 20px #00ff88, 0 0 40px rgba(0,255,136,0.4)",
        animation: "scanLine 1.5s linear infinite",
      }} />
      {Array.from({ length: SCAN_LINES }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: 0, right: 0,
          height: "1px", top: `${(i / SCAN_LINES) * 100}%`,
          background: "rgba(0,255,136,0.08)",
        }} />
      ))}
    </div>
  ) : null;
}

function RiskMeter({ score, level }) {
  const pct = Math.min(100, Math.max(0, score));
  const color = level?.toLowerCase().includes("high")
    ? "#ff4444" : level?.toLowerCase().includes("medium")
    ? "#ffaa00" : "#00ff88";

  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ color: "#8899aa", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Risk Score
        </span>
        <span style={{ color, fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: "0.9rem" }}>
          {score}/100
        </span>
      </div>
      <div style={{
        height: "8px", background: "rgba(255,255,255,0.07)",
        borderRadius: "99px", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)"
      }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, #00ff88, ${color})`,
          borderRadius: "99px",
          boxShadow: `0 0 12px ${color}`,
          transition: "width 1.2s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

function CornerBrackets({ color = "#00cfff" }) {
  const s = { position: "absolute", width: "18px", height: "18px", opacity: 0.7 };
  const b = `2px solid ${color}`;
  return (
    <>
      <div style={{ ...s, top: 8, left: 8, borderTop: b, borderLeft: b }} />
      <div style={{ ...s, top: 8, right: 8, borderTop: b, borderRight: b }} />
      <div style={{ ...s, bottom: 8, left: 8, borderBottom: b, borderLeft: b }} />
      <div style={{ ...s, bottom: 8, right: 8, borderBottom: b, borderRight: b }} />
    </>
  );
}

function HexBadge({ level }) {
  const isHigh = level?.toLowerCase().includes("high");
  const isMed = level?.toLowerCase().includes("medium");
  const color = isHigh ? "#ff4444" : isMed ? "#ffaa00" : "#00ff88";
  const label = isHigh ? "THREAT" : isMed ? "CAUTION" : "SAFE";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: "8px",
      padding: "6px 18px",
      background: `${color}18`,
      border: `1px solid ${color}55`,
      borderRadius: "4px",
      color,
      fontFamily: "'Courier New', monospace",
      fontWeight: 700,
      fontSize: "0.85rem",
      letterSpacing: "0.15em",
      boxShadow: `0 0 16px ${color}22`,
      animation: "pulse 2s ease-in-out infinite",
    }}>
      <span style={{
        width: "8px", height: "8px", borderRadius: "50%",
        background: color, boxShadow: `0 0 8px ${color}`,
        display: "inline-block",
        animation: "blink 1s step-end infinite"
      }} />
      {label}
    </div>
  );
}

function ReasonItem({ reason, index }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "10px",
      padding: "10px 14px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "6px",
      marginBottom: "8px",
      animation: `fadeUp 0.4s ${index * 0.1}s both ease-out`,
    }}>
      <span style={{
        color: "#00cfff", fontFamily: "monospace",
        fontSize: "0.75rem", marginTop: "1px", flexShrink: 0
      }}>
        [{String(index + 1).padStart(2, "0")}]
      </span>
      <span style={{ color: "#c8d8e8", fontSize: "0.9rem", lineHeight: 1.5 }}>
        {reason}
      </span>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) { setError("Please select an image file (PNG, JPG, etc.)"); return; }
    setError(null); setFile(f); setResult(null); setScanDone(false);
    const r = new FileReader();
    r.onload = () => setPreview(r.result);
    r.readAsDataURL(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setFile(f); setResult(null); setScanDone(false);
      const r = new FileReader();
      r.onload = () => setPreview(r.result);
      r.readAsDataURL(f);
      setError(null);
    } else setError("Please drop an image file");
  };

  const uploadImage = async () => {
    if (!file) { setError("Please select or drop an image first"); return; }
    setError(null); setLoading(true); setScanDone(false);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:8080/api/upload", {
        method: "POST", body: formData,
      });
      if (!response.ok) throw new Error("Server error: " + response.status);
      const data = await response.json();
      setTimeout(() => { setResult(data); setScanDone(true); setLoading(false); }, 400);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze. Please check if backend is running.");
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;600&family=Inter:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #050d1a; }
        @keyframes float {
          from { transform: translate(0, 0) scale(1); }
          to { transform: translate(6px, -12px) scale(1.4); }
        }
        @keyframes scanLine {
          from { top: -3px; }
          to { top: 100%; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.75; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0,207,255,0.2); }
          50% { box-shadow: 0 0 40px rgba(0,207,255,0.5), 0 0 80px rgba(0,255,136,0.15); }
        }
        @keyframes headerReveal {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .upload-zone:hover {
          border-color: #00cfff !important;
          background: rgba(0,207,255,0.05) !important;
        }
        .analyze-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #00cfff, #00ff88) !important;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(0,207,255,0.4) !important;
        }
        .analyze-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #00cfff44; border-radius: 2px; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#050d1a",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
      }}>
        <GridBackground />
        <ParticleField />

        {/* Ambient glow orbs */}
        <div style={{
          position: "fixed", width: "600px", height: "600px",
          background: "radial-gradient(circle, rgba(0,207,255,0.06) 0%, transparent 70%)",
          top: "-200px", right: "-200px", pointerEvents: "none", zIndex: 0
        }} />
        <div style={{
          position: "fixed", width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(0,255,136,0.05) 0%, transparent 70%)",
          bottom: "-150px", left: "-150px", pointerEvents: "none", zIndex: 0
        }} />

        <div style={{
          width: "100%", maxWidth: "500px", position: "relative", zIndex: 1,
          animation: "slideIn 0.6s ease-out both",
        }}>
          {/* Header */}
          <div style={{
            textAlign: "center", marginBottom: "32px",
            animation: "headerReveal 0.7s ease-out both",
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "rgba(0,207,255,0.08)",
              border: "1px solid rgba(0,207,255,0.2)",
              borderRadius: "6px",
              padding: "6px 16px",
              marginBottom: "16px",
            }}>
              <span style={{
                width: "6px", height: "6px", borderRadius: "50%",
                background: "#00ff88", boxShadow: "0 0 8px #00ff88",
                animation: "blink 1.5s ease-in-out infinite"
              }} />
              <span style={{
                color: "#00cfff", fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.72rem", letterSpacing: "0.2em",
              }}>
                SYSTEM ONLINE
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #ffffff 30%, #00cfff 70%, #00ff88)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              letterSpacing: "0.05em",
              lineHeight: 1.1,
              marginBottom: "10px",
            }}>
              QR FRAUD<br />INTELLIGENCE
            </h1>

            <p style={{
              color: "#5a7a99",
              fontSize: "0.88rem", letterSpacing: "0.05em",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              AI-POWERED THREAT DETECTION SYSTEM
            </p>
          </div>

          {/* Main Card */}
          <div style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
            border: "1px solid rgba(0,207,255,0.15)",
            borderRadius: "16px",
            padding: "28px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            animation: "glow 4s ease-in-out infinite",
          }}>

            {/* Upload Zone */}
            <div
              className="upload-zone"
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              style={{
                position: "relative",
                border: dragOver ? "2px solid #00ff88" : preview ? "2px solid rgba(0,207,255,0.4)" : "2px dashed rgba(0,207,255,0.2)",
                borderRadius: "12px",
                padding: preview ? "16px" : "48px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: dragOver ? "rgba(0,255,136,0.05)" : preview ? "rgba(0,207,255,0.04)" : "rgba(0,10,20,0.4)",
                transition: "all 0.25s ease",
                overflow: "hidden",
                minHeight: preview ? "auto" : "200px",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <CornerBrackets color={dragOver ? "#00ff88" : "#00cfff"} />
              {loading && <ScanAnimation active={loading} />}

              {preview ? (
                <>
                  <img src={preview} alt="QR preview" style={{
                    maxHeight: "200px", maxWidth: "100%",
                    borderRadius: "8px",
                    filter: loading ? "brightness(0.6) saturate(0.5)" : "none",
                    transition: "filter 0.3s ease",
                  }} />
                  <div style={{
                    marginTop: "12px",
                    color: "#4a6a80",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.78rem",
                    letterSpacing: "0.05em",
                  }}>
                    {file?.name}
                  </div>
                </>
              ) : (
                <div>
                  <div style={{
                    width: "56px", height: "56px",
                    margin: "0 auto 16px",
                    border: "2px dashed rgba(0,207,255,0.3)",
                    borderRadius: "12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.6rem",
                    color: "#00cfff",
                  }}>
                    ⊞
                  </div>
                  <div style={{
                    color: "#8899aa", fontWeight: 500,
                    marginBottom: "6px", fontSize: "0.95rem",
                  }}>
                    Drop QR image or click to select
                  </div>
                  <div style={{
                    color: "#3a5a6a",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.76rem", letterSpacing: "0.08em",
                  }}>
                    PNG · JPG · WEBP · SUPPORTED
                  </div>
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*"
                onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                marginTop: "14px", padding: "12px 16px",
                background: "rgba(255,68,68,0.1)",
                border: "1px solid rgba(255,68,68,0.3)",
                borderRadius: "8px", color: "#ff8888",
                fontSize: "0.87rem",
                fontFamily: "'JetBrains Mono', monospace",
                animation: "fadeUp 0.3s ease-out",
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Button */}
            <button
              className="analyze-btn"
              onClick={uploadImage}
              disabled={loading || !file}
              style={{
                marginTop: "18px", width: "100%", padding: "15px",
                background: loading || !file
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, rgba(0,207,255,0.9), rgba(0,255,136,0.8))",
                color: loading || !file ? "#3a5a6a" : "#050d1a",
                border: loading || !file ? "1px solid rgba(255,255,255,0.08)" : "none",
                borderRadius: "10px",
                fontSize: "0.9rem", fontWeight: 700,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "0.12em",
                cursor: loading || !file ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                position: "relative", overflow: "hidden",
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "16px", height: "16px",
                    border: "2px solid rgba(0,207,255,0.3)",
                    borderTopColor: "#00cfff",
                    borderRadius: "50%",
                    animation: "spinRing 0.8s linear infinite",
                  }} />
                  <span style={{ color: "#00cfff" }}>ANALYZING TARGET...</span>
                </>
              ) : (
                <>
                  <span>SCAN FOR THREATS</span>
                  {file && <span style={{ opacity: 0.7 }}>→</span>}
                </>
              )}
            </button>

            {/* Result Panel */}
            {result && scanDone && (
              <div style={{
                marginTop: "28px",
                borderTop: "1px solid rgba(0,207,255,0.1)",
                paddingTop: "24px",
                animation: "slideIn 0.5s ease-out both",
              }}>

                {/* Header row */}
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  alignItems: "center", marginBottom: "24px",
                }}>
                  <div style={{
                    color: "#4a6a80",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.75rem", letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}>
                    ANALYSIS COMPLETE
                  </div>
                  <HexBadge level={result.riskLevel} />
                </div>

                <RiskMeter score={result.riskScore} level={result.riskLevel} />

                {/* Stats row */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  gap: "12px", marginBottom: "20px",
                }}>
                  {[
                    { label: "SCORE", value: `${result.riskScore}/100` },
                    { label: "LEVEL", value: result.riskLevel || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      padding: "14px",
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: "8px",
                    }}>
                      <div style={{
                        color: "#3a5a70",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: "0.68rem", letterSpacing: "0.15em", marginBottom: "6px",
                      }}>
                        {label}
                      </div>
                      <div style={{
                        color: "#e0eeff",
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 700, fontSize: "1rem",
                      }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reasons */}
                {result.reasons?.length > 0 && (
                  <>
                    <div style={{
                      color: "#3a5a70",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.72rem", letterSpacing: "0.15em",
                      marginBottom: "12px",
                    }}>
                      THREAT INDICATORS · {result.reasons.length} FOUND
                    </div>
                    {result.reasons.map((r, i) => <ReasonItem key={i} reason={r} index={i} />)}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center", marginTop: "20px",
            color: "#1e3040",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.72rem", letterSpacing: "0.12em",
          }}>
            QR FRAUD INTELLIGENCE SYSTEM · LOCAL ANALYSIS ENGINE
          </div>
        </div>
      </div>
    </>
  );
}