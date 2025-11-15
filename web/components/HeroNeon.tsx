import React from "react";

export const HeroNeon: React.FC = () => {
  return (
    <>
      <section className="hero-neon-wrap">
        <div className="hero-neon">
          <div className="hero-kicker">Catalogue public</div>

          <h1 className="hero-title">
            Des outils IA élégants et puissants.<br />
            Optimisés pour aller vite.
          </h1>

          <p className="hero-sub">
            Chaque outil est pensé pour t&apos;éviter la charge mentale. Tu ouvres,
            tu remplis 2 infos, tu repars avec un résultat clean, prêt à utiliser.
          </p>

          <div className="hero-cta-row">
            <button className="hero-btn-primary">Voir les meilleurs outils</button>
            <button className="hero-btn-secondary">Explorer tout le catalogue</button>
          </div>

          <svg className="hero-wave" viewBox="0 0 1440 320">
            <defs>
              <linearGradient id="waveGradReact" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="40%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <path
              d="M0,220 C200,160 340,260 620,220 C820,180 980,60 1180,120 C1330,160 1440,240 1440,240"
              stroke="url(#waveGradReact)"
              strokeWidth="4"
              fill="transparent"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>

      <style jsx>{`
        .hero-neon-wrap {
          position: relative;
          margin: 110px auto 40px;
          max-width: 1100px;
          padding: 0 20px;
        }

        .hero-neon {
          position: relative;
          padding: 40px 28px 80px;
          border-radius: 26px;
          background: linear-gradient(
            145deg,
            rgba(139, 92, 246, 0.25),
            rgba(34, 197, 94, 0.22),
            rgba(14, 165, 233, 0.18),
            rgba(15, 16, 22, 0.7)
          );
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow:
            0 0 80px rgba(139, 92, 246, 0.15),
            0 0 90px rgba(34, 197, 94, 0.12);
          overflow: hidden;
        }

        .hero-kicker {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #d1d5db;
          margin-bottom: 14px;
          font-weight: 600;
        }

        .hero-title {
          font-size: 34px;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 12px;
          max-width: 700px;
        }

        .hero-sub {
          color: #b7bbc3;
          font-size: 15px;
          line-height: 1.55;
          max-width: 700px;
          margin: 0 0 22px;
        }

        .hero-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 10px;
        }

        .hero-btn-primary {
          padding: 11px 16px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #8b5cf6, #22c55e);
          color: #020617;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
        }

        .hero-btn-secondary {
          padding: 11px 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(15, 23, 42, 0.6);
          color: #e5e7eb;
          font-size: 14px;
          cursor: pointer;
        }

        .hero-wave {
          position: absolute;
          bottom: -16px;
          left: -20px;
          right: -20px;
          width: calc(100% + 40px);
          opacity: 0.9;
        }

        @media (max-width: 640px) {
          .hero-neon-wrap {
            margin-top: 80px;
          }
          .hero-title {
            font-size: 26px;
          }
          .hero-neon {
            padding: 28px 20px 64px;
          }
        }
      `}</style>
    </>
  );
};
