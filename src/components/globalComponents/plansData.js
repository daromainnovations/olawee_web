
// Planes activos (solo monthly)
const plansData = {
    monthly: [
      {
        id: "explora",
        label: "OLAWEE EXPLORA",
        price: "Gratis · 14 días",
        headline: "Prueba lo que OLAWEE puede hacer por ti, en 14 días.",
        licenses: 1,
        trialDays: 14,
        tier: "free",
        badge: "Nuevo",
        features: [
          "Chat básico",
          "Selección de modelos de IA",
          "Asistentes y Prompts propios y compartidos",
          "Comunidad OLAWEE",
          "Recursos e historial",
          "Soporte básico"
        ]
      },
      {
        id: "impulsa",
        label: "OLAWEE IMPULSA",
        price: "50€ / mes",
        headline: "Tu asistente personal para ahorrar horas y trabajar mejor.",
        licenses: 1,
        tier: "pro",
        features: [
          "Todo en EXPLORA",
          "Auditorías estratégicas incluidas",
          "Formación personalizada (opcional)",
          "Soporte básico"
        ]
      },
      {
        id: "equipo",
        label: "OLAWEE EQUIPO",
        price: "120€ / mes",
        headline: "Convierte la IA en tu mejor equipo de trabajo.",
        licenses: 3,
        tier: "business",
        popular: true,   // mostrará “Más popular” si lo usas en el UI
        badge: "Más popular",
        features: [
          "Todo en IMPULSA",
          "Gestión de usuarios (3 licencias)",
          "Integración con apps externas (*)",
          "Soporte avanzado",
          "Formación personalizada (opcional)",
          "Asistentes personalizados (opcional)"
        ]
      }
    ]
  };
  
  export default plansData;
  
  // === Matriz de comparación para la tabla (checks/textos por plan) ===
  export const comparisonMatrix = {
    // Orden “al revés” para columnas (EQUIPO → IMPULSA → EXPLORA)
    order: ["equipo", "impulsa", "explora"],
    featuresCatalog: [
      { key: "chat",              label: "Chat base e historial" },
      { key: "models",            label: "Selección de modelos de IA" },
      { key: "assistantsShare",   label: "Acceso a compartición de Asistentes" },
      { key: "promptsShare",      label: "Acceso a compartición de Prompts" },
      { key: "community",         label: "Acceso a OLAWEE Community" },
      { key: "audits",            label: "Auditorías" },
      { key: "userMgmt",          label: "Gestión de usuarios (múltiples licencias)" },
      { key: "integrations",      label: "Integración con apps externas" },
      { key: "supportBasic",      label: "Soporte básico" },
      { key: "supportAdv",        label: "Soporte avanzado" },
      { key: "training",          label: "Formación personalizada" },
      { key: "assistantsCustom",  label: "Asistentes personalizados" },
    ],
    plans: {
      explora: {
        chat: "trial",
        models: "trial",
        assistantsShare: "trial",
        promptsShare: "trial",
        community: "trial",
        audits: false,
        userMgmt: false,
        integrations: false,
        supportBasic: true,
        supportAdv: false,
        training: false,
        assistantsCustom: false
      },
      impulsa: {
        chat: true,
        models: true,
        assistantsShare: true,
        promptsShare: true,
        community: true,
        audits: true,
        userMgmt: false,
        integrations: false,
        supportBasic: true,
        supportAdv: false,
        training: "opcional",
        assistantsCustom: "opcional"
      },
      equipo: {
        chat: true,
        models: true,
        assistantsShare: true,
        promptsShare: true,
        community: true,
        audits: true,
        userMgmt: "3 licencias",
        integrations: "*",
        supportBasic: true,
        supportAdv: true,
        training: "opcional",
        assistantsCustom: "opcional"
      }
    }
  };
  