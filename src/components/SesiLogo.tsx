import React from 'react';

interface SesiLogoProps {
  className?: string;
  size?: number;
}

export const SesiLogo: React.FC<SesiLogoProps> = ({
  className = 'h-16 w-16',
  size = 64
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        <defs>
          {/* Fundo com degradê Laranja refinado */}
          <linearGradient id="sesiOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FB923C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          {/* Brilho e profundidade interna */}
          <radialGradient id="sesiGlow" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#F97316" stopOpacity="1" />
            <stop offset="100%" stopColor="#C2410C" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Círculo Principal Laranja */}
        <circle cx="100" cy="100" r="96" fill="url(#sesiGlow)" />
        <circle cx="100" cy="100" r="95" stroke="#FFFFFF" strokeWidth="4" strokeOpacity="0.9" />

        {/* Arco de Órbita / Ciência e Educação */}
        <ellipse
          cx="100"
          cy="100"
          rx="82"
          ry="32"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          strokeOpacity="0.5"
          transform="rotate(-25 100 100)"
        />

        {/* Letras SESI em Tipografia Bold Estilizada */}
        <text
          x="100"
          y="108"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="48"
          fontWeight="900"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2"
        >
          SESI
        </text>

        {/* Tarja / Badge "CAXIAS" */}
        <rect
          x="42"
          y="126"
          width="116"
          height="24"
          rx="12"
          fill="#FFFFFF"
        />
        <text
          x="100"
          y="142"
          textAnchor="middle"
          fill="#C2410C"
          fontSize="13"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="2.5"
        >
          CAXIAS
        </text>

        {/* Ponto Destaque "NEWS" */}
        <circle cx="152" cy="74" r="5" fill="#FFEDD5" />
      </svg>
    </div>
  );
};
