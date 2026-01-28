/**
 * Arquivo de Configuração de Exemplo
 * 
 * Copie este arquivo para config.js e personalize com suas informações
 * Depois, inclua <script src="config.js"></script> no index.html antes dos outros scripts
 */

const CONFIG = {
    // ID do vídeo do YouTube (apenas o ID, não a URL completa)
    youtubeVideoId: 'YOUR_VIDEO_ID_HERE',
    
    // Informações da empresa/marca
    company: {
        name: 'Ready To Go',
        cnpj: '37.643.030/0001-26',
        copyright: '© 2024 Ready To Go. Todos os direitos reservados.'
    },
    
    // Links
    links: {
        privacyPolicy: '/politica-privacidade',
        termsOfUse: '/termos-uso',
        whatsapp: 'https://wa.me/5511999999999',
        email: 'contato@exemplo.com'
    },
    
    // Redes sociais
    social: {
        instagram: 'https://instagram.com/exemplo',
        youtube: 'https://youtube.com/@exemplo',
        facebook: 'https://facebook.com/exemplo'
    },
    
    // Tracking
    analytics: {
        googleAnalyticsId: 'UA-XXXXXXXXX-X', // Opcional
        facebookPixelId: 'XXXXXXXXXX' // Opcional
    },
    
    // Configurações do carrossel
    carousel: {
        autoplayDelay: 5000, // em milissegundos
        loop: true
    },
    
    // Configurações de animação
    animation: {
        enabled: true,
        duration: 800,
        offset: 100
    }
};

// Para usar no código:
// console.log(CONFIG.youtubeVideoId);
