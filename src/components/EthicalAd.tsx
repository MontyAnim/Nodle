"use client";

import React, { useEffect, useRef } from "react";

// Declaración global para la API de EthicalAds
declare global {
  interface Window {
    ethicalads?: {
      load: () => void;
      reload: () => void;
    };
  }
}

interface EthicalAdProps {
  publisher?: string;
  type?: "text" | "image";
  className?: string;
}

export function EthicalAd({ 
  publisher = "nodle", // Reemplazar con el ID aprobado por EthicalAds
  type = "text", 
  className = "" 
}: EthicalAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si EthicalAds ya cargó globalmente, forzamos la recarga al montar el componente
    // para asegurar que detecta el div nuevo (útil en Single Page Apps).
    if (typeof window !== "undefined" && window.ethicalads) {
      // Usamos un pequeño timeout para dar tiempo a que React adjunte el nodo al DOM.
      setTimeout(() => {
        try {
          if (window.ethicalads?.reload) {
            window.ethicalads.reload();
          } else if (window.ethicalads?.load) {
            window.ethicalads.load();
          }
        } catch (e) {
          console.warn("Error cargando EthicalAds:", e);
        }
      }, 100);
    }
  }, []);

  return (
    <div className={`flex justify-center w-full my-4 ${className}`}>
      {/* Contenedor del anuncio según la especificación de EthicalAds */}
      <div 
        ref={adRef}
        className={type === "image" ? "horizontal" : ""}
        data-ea-publisher={publisher} 
        data-ea-type={type}
        // Este ID es útil por si necesitamos apuntar estilos css específicos
        id="ethicalads-container"
      />
    </div>
  );
}
