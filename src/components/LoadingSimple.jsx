import React, { useEffect, useState } from "react";

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
          setTimeout(onFinish, 700);
        }, 200);
      }
    };

    requestAnimationFrame(animate);
  }, [onFinish]);

  return (
    <>
      <style>{`
        /* BASE - Portfolio Personnel */
        .loader-screen {
          position: fixed;
          inset: 0;
          background: black;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          z-index: 9999;
          transition: opacity 1s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* EXIT TRANSITION */
        .loader-screen.exit {
          opacity: 0;
          pointer-events: none;
        }

        /* PARTICLES BACKGROUND */
        .loader-screen::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(255, 107, 107, 0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(78, 205, 196, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(255, 195, 113, 0.05) 0%, transparent 50%);
          animation: particleFloat 15s ease-in-out infinite;
        }

        @keyframes particleFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-20px, 20px) scale(1.05);
          }
          66% {
            transform: translate(20px, -20px) scale(0.95);
          }
        }

        /* HALO EFFECT */
        .halo {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(78, 205, 196, 0.15), transparent 70%);
          filter: blur(100px);
          animation: haloPulse 4s ease-in-out infinite;
        }

        @keyframes haloPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.6;
          }
        }

        /* MAIN CONTENT */
        .loader-center {
          position: relative;
          z-index: 10;
          text-align: center;
          animation: contentReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes contentReveal {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* NAME - Portfolio Style */
        .loader-name {
          font-size: 2.6rem;
          font-weight: 600;
          letter-spacing: -0.5px;
          color: #ffffff;
          margin-bottom: 8px;
          animation: nameSlide 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .loader-name span:first-child {
          animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }

        .loader-name span:last-child {
          animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* ROLE - Creative Touch */
        .loader-role {
          font-size: 1rem;
          font-weight: 400;
          letter-spacing: 1px;
          background: linear-gradient(90deg, #ff6b6b, #ffd93d, #4ecdc4);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s linear infinite, roleSlide 1s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both;
          margin-bottom: 48px;
        }

        @keyframes gradientShift {
          to {
            background-position: 200% center;
          }
        }

        @keyframes roleSlide {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* CINEMATIC PROGRESS BAR */
        .cinematic-loader {
          position: relative;
          width: 320px;
          height: 3px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 3px;
          overflow: hidden;
          animation: loaderReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both;
        }

        @keyframes loaderReveal {
          from {
            opacity: 0;
            transform: scaleX(0);
          }
          to {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        .cinematic-progress {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            rgba(255, 107, 107, 0.7),
            rgba(255, 217, 61, 0.8),
            rgba(78, 205, 196, 0.9));
          border-radius: 3px;
          transform-origin: left;
          transition: transform 0.15s ease-out;
          box-shadow: 0 0 20px rgba(78, 205, 196, 0.5),
                      0 0 40px rgba(78, 205, 196, 0.3);
        }

        /* SHIMMER EFFECT */
        .cinematic-loader::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%);
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes shimmer {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(200%);
          }
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .loader-name {
            font-size: 2rem;
          }
          .loader-role {
            font-size: 0.9rem;
          }
          .cinematic-loader {
            width: 280px;
          }
          .halo {
            width: 400px;
            height: 400px;
          }
        }

        @media (max-width: 480px) {
          .loader-name {
            font-size: 1.75rem;
          }
          .loader-role {
            font-size: 0.85rem;
            margin-bottom: 36px;
          }
          .cinematic-loader {
            width: 240px;
          }
        }
      `}</style>

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
    </>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a' }}>
      {loading && <LoadingSimple onFinish={() => setLoading(false)} />}
      {!loading && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          height: '100vh',
          color: 'white',
          fontSize: '2rem',
          fontFamily: 'system-ui'
        }}>
          ✨ Bienvenue sur votre Portfolio
        </div>
      )}
    </div>
  );
}