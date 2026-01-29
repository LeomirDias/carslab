/**
 * Template de configuração. O config.js é gerado por: npm run build (ou npm run generate-config).
 * Valores sensíveis vêm do .env (local) ou das variáveis de ambiente (ex.: Vercel):
 *   API_URL ou API_UR, API_TOKEN, PRODUCT_ID (opcional).
 */

const CONFIG = {
  // API de leads (POST criar lead, PATCH atualizar user_type)
  leadApi: {
    url: "https://sua-api.com/api/leads", // URL base da API de leads
    token: "SEU_LEAD_API_TOKEN", // Token (LEAD_API_TOKEN do backend)
    productId: "ff3fdf61-e88f-43b5-982a-32d50f112414", // UUID do produto (check-lavagem-segura)
  },

  // ID do vídeo do YouTube (apenas o ID, não a URL completa)
  youtubeVideoId: "YOUR_VIDEO_ID_HERE",

  // Informações da empresa/marca
  company: {
    name: "Ready To Go",
    cnpj: "37.643.030/0001-26",
    copyright: "© 2024 Ready To Go. Todos os direitos reservados.",
  },

  // Links
  links: {
    privacyPolicy: "/politica-privacidade",
    termsOfUse: "/termos-uso",
    whatsapp: "https://wa.me/5564996775544",
    email: "contato@exemplo.com",
  },

  // Redes sociais
  social: {
    instagram: "https://instagram.com/exemplo",
    youtube: "https://youtube.com/@exemplo",
    facebook: "https://facebook.com/exemplo",
  },

  // Tracking
  analytics: {
    googleAnalyticsId: "UA-XXXXXXXXX-X", // Opcional
    facebookPixelId: "XXXXXXXXXX", // Opcional
  },

  // Configurações do carrossel
  carousel: {
    autoplayDelay: 5000, // em milissegundos
    loop: true,
  },

  // Configurações de animação
  animation: {
    enabled: true,
    duration: 800,
    offset: 100,
  },
};

// Para usar no código:
// console.log(CONFIG.youtubeVideoId);
