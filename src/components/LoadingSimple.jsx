import React, { useEffect, useState } from "react";
import "./LoadingSimple.css";

const LoadingSimple = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const duration = 2600;

    const animate = () => {
      const elapsed = Date.now() - start;
      const value = Math.min((elapsed / duration) * 100, 100);
      setProgress(value);

      if (value < 100) {
        requestAnimationFrame(animate);
      } else {
        setTimeout(() => {
          setClosing(true);
          setTimeout(onFinish, 700); // ⏳ transition
        }, 200);
      }
    };

    requestAnimationFrame(animate);
  }, [onFinish]);

  return (
    <div className={`loader-screen ${closing ? "exit" : ""}`}>
      <div className="halo" />

      <div className="loader-center">
        <h1 className="loader-name">
          <span>Larbi</span>
          <span>El Aouad</span>
        </h1>

        <p className="loader-role">Développeur Fullstack</p>

        <div className="cinematic-loader">
          <div
            className="cinematic-progress"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingSimple;
