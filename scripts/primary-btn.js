/**
 * Primary Button Component
 * Componente de botão reutilizável que pode ser usado em qualquer lugar
 */

/**
 * Cria um botão primário com link de redirecionamento ou abertura de dialog
 * @param {Object} props - Propriedades do botão
 * @param {string} props.text - Texto do botão
 * @param {string} props.link - URL de redirecionamento
 * @param {string} [props.target='_blank'] - Target do link (_blank, _self, etc)
 * @param {string} [props.additionalClasses=''] - Classes CSS adicionais
 * @param {string} [props.id=''] - ID do botão (opcional)
 * @param {boolean} [props.useDialog=true] - Se true, abre dialog antes de redirecionar
 * @returns {HTMLElement} - Elemento do botão
 */
function createPrimaryButton({ 
    text = 'Clique aqui', 
    link, 
    target = '_blank',
    additionalClasses = '',
    id = '',
    useDialog = true
}) {
    // Validação
    if (!link) {
        console.error('Primary Button: O parâmetro "link" é obrigatório');
        return null;
    }

    // Criar o botão
    const button = document.createElement('button');
    
    // Adicionar classes
    const baseClasses = 'bg-primary text-white p-6 rounded-md inline-block transition-all duration-300 hover:bg-primary-dark hover:shadow-lg transform hover:-translate-y-1 cursor-pointer';
    button.className = `${baseClasses} ${additionalClasses}`.trim();
    
    // Adicionar texto
    button.textContent = text;
    
    // Adicionar ID se fornecido
    if (id) {
        button.id = id;
    }
    
    // Adicionar evento de clique
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (useDialog) {
            // Atualiza o link no botão do dialog antes de abrir
            const submitBtn = document.getElementById('submitDialogBtn');
            if (submitBtn) {
                submitBtn.setAttribute('data-redirect-link', link);
            }
            
            // Abre o dialog
            if (typeof window.openFormDialog === 'function') {
                window.openFormDialog();
            } else {
                console.error('Primary Button: A função openFormDialog não está disponível. Certifique-se de que form-dialog.js está carregado.');
                // Fallback: redireciona diretamente em nova aba
                window.open(link, '_blank', 'noopener,noreferrer');
            }
        } else {
            // Redireciona diretamente sem dialog (sempre em nova aba)
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    });
    
    return button;
}

/**
 * Renderiza um botão primário em um container específico
 * @param {string} containerId - ID do container onde o botão será inserido
 * @param {Object} props - Propriedades do botão (mesmas do createPrimaryButton)
 */
function renderPrimaryButton(containerId, props) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Primary Button: Container com ID "${containerId}" não encontrado`);
        return;
    }
    
    const button = createPrimaryButton(props);
    
    if (button) {
        container.appendChild(button);
    }
}

/**
 * Substitui um elemento placeholder por um botão primário
 * Procura por elementos com data-component="primary-btn" e os substitui
 * 
 * Exemplo de uso no HTML:
 * <div data-component="primary-btn" 
 *      data-text="Comprar Agora" 
 *      data-link="https://exemplo.com/checkout"
 *      data-target="_self"
 *      data-classes="w-full md:w-auto"
 *      data-use-dialog="true">
 * </div>
 */
function initPrimaryButtons() {
    const placeholders = document.querySelectorAll('[data-component="primary-btn"]');
    
    placeholders.forEach(placeholder => {
        const useDialogAttr = placeholder.getAttribute('data-use-dialog');
        const useDialog = useDialogAttr === null || useDialogAttr === 'true';
        
        const props = {
            text: placeholder.getAttribute('data-text') || 'Clique aqui',
            link: placeholder.getAttribute('data-link'),
            target: placeholder.getAttribute('data-target') || '_blank',
            additionalClasses: placeholder.getAttribute('data-classes') || '',
            id: placeholder.getAttribute('data-id') || '',
            useDialog: useDialog
        };
        
        const button = createPrimaryButton(props);
        
        if (button) {
            // Substituir o placeholder pelo botão
            placeholder.replaceWith(button);
        }
    });
}

// Exportar funções para uso global
window.createPrimaryButton = createPrimaryButton;
window.renderPrimaryButton = renderPrimaryButton;
window.initPrimaryButtons = initPrimaryButtons;
