
import { useEffect } from "react";

const WIDGET_ID = 159000000627;
const SCRIPT_ID = "fw-widget-script";

export default function FreshchatLoader() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Config (solo una vez)
    if (!window.fwSettings) {
      window.fwSettings = { widget_id: WIDGET_ID };
    }

    // Stub para colas si aún no se ha cargado la librería
    if (typeof window.FreshworksWidget !== "function") {
      const n = function () { n.q.push(arguments); };
      n.q = [];
      window.FreshworksWidget = n;
    }

    // Inyectar script si no existe
    if (!document.getElementById(SCRIPT_ID)) {
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.async = true;
      s.defer = true;
      s.src = `https://widget.freshworks.com/widgets/${WIDGET_ID}.js`;
      document.body.appendChild(s);
    }

    // (Opcional) return de limpieza: no quitamos el script para evitar parpadeos
  }, []);

  return null;
}
