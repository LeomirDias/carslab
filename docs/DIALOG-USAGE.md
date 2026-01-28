# Documentação do Componente Dialog de Formulário

## Visão Geral

O componente `form-dialog` é um modal responsivo que captura informações de leads (nome completo, email e contato) antes de redirecionar para um link de checkout ou outra página.

## Recursos

### ✅ Validações Automáticas

1. **Nome Completo**
   - Exige pelo menos 2 palavras (nome e sobrenome)
   - Padroniza automaticamente (primeira letra de cada palavra em maiúscula)
   - Exemplo: "joão silva" → "João Silva"

2. **Email**
   - Valida presença do símbolo `@`
   - Valida tamanho mínimo do email

3. **Contato (Telefone)**
   - Formatação automática enquanto digita
   - Formato final: `(99) 9 9999-9999`
   - Aceita números com 10 ou 11 dígitos

### 🎨 Design Responsivo

- Centralizado na tela
- Funciona em todos os tamanhos de dispositivos
- Overlay com fundo escuro semitransparente
- Animações suaves de entrada e saída
- Fechar ao clicar fora do dialog ou pressionar ESC

## Como Usar

### 1. Configurar o Link de Redirecionamento

Edite o arquivo `components/form-dialog.html` e configure o link no botão de envio:

```html
<button 
  type="submit"
  id="submitDialogBtn"
  data-redirect-link="https://pay.hotmart.com/seu-produto"
  data-redirect-target="_blank"
  class="...">
  Continuar
</button>
```

**Atributos:**
- `data-redirect-link`: URL para onde o usuário será redirecionado após enviar o formulário
- `data-redirect-target`: `_blank` (nova aba) ou `_self` (mesma aba)

### 2. Uso Padrão (Automático)

Por padrão, todos os botões criados com `data-component="primary-btn"` agora abrem o dialog automaticamente:

```html
<div data-component="primary-btn" 
     data-text="Comprar Agora" 
     data-link="https://pay.hotmart.com/..."
     data-classes="text-lg px-10 py-5">
</div>
```

> **Nota:** O link no `data-link` do botão será usado temporariamente para atualizar o botão do dialog, mas o link principal é o configurado diretamente no dialog.

### 3. Desabilitar o Dialog (Redirecionamento Direto)

Se você quiser que um botão específico redirecione diretamente sem abrir o dialog:

```html
<div data-component="primary-btn" 
     data-text="Comprar Agora" 
     data-link="https://pay.hotmart.com/..."
     data-use-dialog="false">
</div>
```

### 4. Uso Programático via JavaScript

Você também pode abrir o dialog manualmente via JavaScript:

```javascript
// Abrir o dialog
window.openFormDialog();

// Fechar o dialog
window.closeFormDialog();

// Atualizar o link do dialog dinamicamente (opcional)
const submitBtn = document.getElementById('submitDialogBtn');
submitBtn.setAttribute('data-redirect-link', 'https://novo-link.com');
submitBtn.setAttribute('data-redirect-target', '_blank');
```

## Estrutura de Arquivos

```
base-pv-vtsd/
├── components/
│   └── form-dialog.html       # HTML do componente
├── scripts/
│   ├── form-dialog.js         # Lógica do dialog
│   └── primary-btn.js         # Botão atualizado (integrado com dialog)
└── index.html                 # Carrega o dialog automaticamente
```

## Personalização

### Modificar Textos do Dialog

Edite o arquivo `components/form-dialog.html`:

```html
<!-- Alterar o título -->
<h2 class="text-2xl font-bold text-text">Seu Título Aqui</h2>

<!-- Alterar o texto do botão de envio -->
<button type="submit">Seu Texto Aqui</button>
```

### Modificar Validações

Edite o arquivo `scripts/form-dialog.js` nas funções:
- `standardizeName()` - Padronização de nomes
- `validateEmail()` - Validação de email
- `formatPhone()` - Formatação de telefone
- `validatePhone()` - Validação de telefone

### Capturar Dados do Formulário

Os dados são exibidos no console ao enviar. Para integrar com seu backend, edite a função de submit em `form-dialog.js`:

```javascript
// Localizar esta parte no código
console.log('Dados do formulário:', {
    fullName: standardizeName(fullName),
    email: email.trim(),
    phone: formatPhone(phone)
});

// Adicionar seu código de integração aqui
// Exemplo com fetch:
await fetch('https://sua-api.com/leads', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        fullName: standardizeName(fullName),
        email: email.trim(),
        phone: formatPhone(phone)
    })
});
```

## Comportamento do Fluxo

1. Usuário clica em um botão primário
2. O link do botão atualiza o atributo `data-redirect-link` do botão do dialog
3. Dialog abre no centro da tela
4. Usuário preenche o formulário
5. Validações ocorrem em tempo real
6. Ao clicar em "Continuar":
   - Se houver erros, mostra mensagens em vermelho
   - Se estiver válido, fecha o dialog e redireciona para o link configurado no botão do dialog

## Estilos

O dialog usa Tailwind CSS e segue as cores definidas no `tailwind.config`:

- **Primary**: `#FF6B35` (botões e destaques)
- **Text**: `#333333` (texto principal)
- **Border**: `gray-300` (bordas dos inputs)
- **Error**: `red-500` (mensagens de erro)

## Acessibilidade

- Suporte a navegação por teclado
- Tecla ESC fecha o dialog
- Labels associados aos inputs
- Mensagens de erro descritivas
- ARIA labels nos botões

## Compatibilidade

- Funciona em todos os navegadores modernos
- Responsivo para mobile, tablet e desktop
- Testado em iOS Safari, Chrome, Firefox e Edge
