"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

// Check that PostHog is defined and we are running in the browser
if (typeof window !== "undefined") {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      // Deshabilitamos algunas features intrusivas para ser más éticos y enfocarnos en producto
      capture_pageview: true, // Registra las visitas a las páginas
      autocapture: false,     // Deshabilitado: no queremos espiar cada clic de los usuarios
      session_recording: {
        maskAllInputs: true,
        maskTextSelector: "*", // Enmascarar todo el texto por privacidad (si se activara session_recording)
      },
    });
  }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  // Solo devolvemos el provider si posthog fue inicializado
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <PHProvider client={posthog}>{children}</PHProvider>;
  }

  // Fallback si no hay PostHog configurado
  return <>{children}</>;
}
