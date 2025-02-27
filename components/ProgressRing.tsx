"use client";
import { useEffect, useState } from "react";

interface ProgressRingProps {
  progress: number; // pourcentage entre 0 et 100
  size?: number; // taille du cercle en pixels
  strokeWidth?: number; // épaisseur de la bordure
  className?: string;
}

export default function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 15,
  className = "",
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);

  // Calculs pour le cercle SVG
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const progressOffset = ((100 - progress) / 100) * circumference;
    setOffset(progressOffset);
  }, [progress, circumference]);

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Cercle de fond gris */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />

        {/* Cercle de progression rouge */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-red-500 transition-all duration-500 ease-in-out"
        />
      </svg>

      {/* Texte du pourcentage au centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-3xl font-bold text-gray-800 dark:text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}
