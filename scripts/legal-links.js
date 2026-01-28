/**
 * Legal Links Component
 * Gerencia os links legais (Política de Privacidade e Termos de Uso) no footer
 */

/**
 * Configuração dos links legais
 */
const legalLinksConfig = {
    privacyPolicy: {
        url: 'politica-privacidade.html',
        text: 'Política de Privacidade',
        title: 'Política de Privacidade - O Segredo do Detalhamento'
    },
    termsOfUse: {
        url: 'termos-uso.html',
        text: 'Termos de Uso',
        title: 'Termos de Uso - O Segredo do Detalhamento'
    }
};

/**
 * Inicializa os links legais no footer
 * Procura por elementos com data-legal-link e popula com os links corretos
 */
function initLegalLinks() {
    // Link de Política de Privacidade
    const privacyLink = document.querySelector('[data-legal-link="privacy-policy"]');
    if (privacyLink) {
        privacyLink.href = legalLinksConfig.privacyPolicy.url;
        privacyLink.textContent = legalLinksConfig.privacyPolicy.text;
        privacyLink.title = legalLinksConfig.privacyPolicy.title;
    }

    // Link de Termos de Uso
    const termsLink = document.querySelector('[data-legal-link="terms-of-use"]');
    if (termsLink) {
        termsLink.href = legalLinksConfig.termsOfUse.url;
        termsLink.textContent = legalLinksConfig.termsOfUse.text;
        termsLink.title = legalLinksConfig.termsOfUse.title;
    }
}

/**
 * Atualiza os links legais após o carregamento do footer
 * Esta função é chamada após o componente footer ser carregado
 */
function updateLegalLinks() {
    // Tenta inicializar imediatamente
    initLegalLinks();
    
    // Se os links ainda não foram encontrados, tenta novamente após um delay
    const privacyLink = document.querySelector('[data-legal-link="privacy-policy"]');
    const termsLink = document.querySelector('[data-legal-link="terms-of-use"]');
    
    if (!privacyLink || !termsLink) {
        // Usa MutationObserver para detectar quando o footer é adicionado ao DOM
        const observer = new MutationObserver((mutations, obs) => {
            const foundPrivacy = document.querySelector('[data-legal-link="privacy-policy"]');
            const foundTerms = document.querySelector('[data-legal-link="terms-of-use"]');
            
            if (foundPrivacy || foundTerms) {
                initLegalLinks();
                obs.disconnect(); // Para de observar após encontrar os elementos
            }
        });
        
        // Observa mudanças no container do footer
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            observer.observe(footerContainer, {
                childList: true,
                subtree: true
            });
            
            // Timeout de segurança - para de observar após 5 segundos
            setTimeout(() => {
                observer.disconnect();
                initLegalLinks(); // Tenta uma última vez
            }, 5000);
        }
    }
}

// Exporta funções para uso global
window.initLegalLinks = initLegalLinks;
window.updateLegalLinks = updateLegalLinks;

// Auto-inicializa quando o DOM estiver pronto (se o footer já estiver carregado)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initLegalLinks, 200);
    });
} else {
    // DOM já está pronto
    setTimeout(initLegalLinks, 200);
}
