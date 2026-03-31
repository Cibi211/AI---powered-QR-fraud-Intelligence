// `import "../App.css";

// export default function Gauge({ score }) {
//   const rotation = (score / 100) * 180 - 90;

//   return (
//     <div className="gauge-wrapper">

//       <div className="gauge">

//         {/* Needle */}
//         <div
//           className="gauge-needle"
//           style={{ transform: `rotate(${rotation}deg)` }}
//         ></div>

//         {/* Center */}
//         <div className="gauge-center"></div>

//       </div>

//       {/* Value */}
//       <div className="gauge-value">{score}</div>

//       {/* Label */}
//       <div className="gauge-label">
//         {score > 70
//           ? "HIGH RISK 🚨"
//           : score > 40
//           ? "MODERATE ⚠"
//           : "SAFE ✅"}
//       </div>

//     </div>
//   );
// }`

import "../App.css";

export default function Gauge({ score }) {
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="gauge-wrapper">

      <div className="gauge">

        {/* Glow ring */}
        <div className="gauge-glow"></div>

        {/* Needle */}
        <div
          className="gauge-needle"
          style={{ transform: `rotate(${rotation}deg)` }}
        />

        {/* Center */}
        <div className="gauge-center" />

        {/* Labels */}
        <div className="gauge-label-low">LOW</div>
        <div className="gauge-label-mid">MED</div>
        <div className="gauge-label-high">HIGH</div>

      </div>

      {/* Score */}
      <div className="gauge-value">{score}</div>

      <div className="gauge-status">
        {score > 70
          ? "HIGH RISK 🚨"
          : score > 40
          ? "MODERATE ⚠"
          : "SAFE ✅"}
      </div>

    </div>
  );
}