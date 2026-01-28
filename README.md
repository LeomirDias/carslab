# Base para Páginas de Vendas de Infoprodutos

Uma base modular e componentizada para criar páginas de vendas de infoprodutos, construída com HTML, CSS e JavaScript puro.

## 📁 Estrutura do Projeto

```
base-pv-V1/
├── index.html                 # Página principal
├── components/                # Componentes reutilizáveis
│   ├── form-dialog.html       # Dialog com formulário de captura de leads
│   ├── header.html
│   ├── hero.html
│   ├── benefits.html
│   ├── target-audience.html
│   ├── testimonials.html
│   ├── course-content.html
│   ├── bonus.html
│   ├── instructor.html
│   ├── footer.html
│   ├── button.html
│   └── card.html
├── styles/
│   ├── main.css              # Estilos principais (reset, variáveis, base)
│   ├── components.css        # Estilos dos componentes
│   ├── utilities.css         # Classes utilitárias
│   └── responsive.css        # Media queries responsivas
├── scripts/
│   ├── main.js               # Script principal (carregamento de componentes)
│   ├── form-dialog.js        # Lógica do dialog de formulário
│   ├── primary-btn.js        # Lógica dos botões primários
│   ├── components.js         # Lógica dos componentes
│   └── animations.js         # Animações e interações
├── assets/
│   ├── images/               # Imagens do projeto
│   ├── videos/               # Vídeos (se necessário)
│   └── icons/                # Ícones
└── lib/                      # Bibliotecas externas (opcional)
```

## 📚 Componentes Disponíveis

### Form Dialog (Novo!)
- Modal responsivo de captura de leads
- Campos: Nome Completo, Email e Contato
- Validações automáticas em tempo real
- Formatação de telefone: (99) 9 9999-9999
- Padronização de nomes (primeira letra maiúscula)
- Validação de email com @
- Integrado automaticamente com botões primários
- [Ver documentação completa](./DIALOG-USAGE.md)

### Header
- Logo
- Menu de navegação responsivo
- Menu mobile com hamburger

### Hero
- Título principal com destaque
- Subtítulo
- Vídeo embed com lazy loading
- Lista de benefícios da aula

### Benefits
- Grid de 4 cards com benefícios
- Ícones SVG
- Animações ao scroll

### Target Audience
- Grid de 5 cards numerados
- Cada card com título e descrição
- CTA no final

### Testimonials
- Carrossel de depoimentos com Swiper.js
- Navegação com setas e dots
- Auto-play configurável
- Responsivo

### Course Content
- Lista de módulos do curso
- Accordion para expandir detalhes
- Imagens dos módulos
- Informações de cada módulo

### Bonus
- Grid de bônus oferecidos
- Cards com ícones e descrições
- Lista de benefícios

### Instructor
- Foto do instrutor
- Biografia
- Credenciais e prêmios
- Layout responsivo

### Footer
- Links úteis
- Informações legais
- Copyright

## 🎨 Bibliotecas Utilizadas

- **AOS (Animate On Scroll)** - Animações ao fazer scroll
- **Swiper.js** - Carrossel moderno e responsivo
- **Lazy Loading Nativo** - Para imagens e vídeos

## 🔧 Funcionalidades

- ✅ Componentização modular
- ✅ Design responsivo (mobile first)
- ✅ **Dialog de captura de leads com validações**
- ✅ **Formatação automática de telefone**
- ✅ **Padronização de nomes**
- ✅ Animações ao scroll
- ✅ Lazy loading de imagens e vídeos
- ✅ Carrossel de depoimentos
- ✅ Accordion para módulos
- ✅ Menu mobile responsivo
- ✅ Smooth scroll
- ✅ Variáveis CSS para fácil customização
- ✅ Classes utilitárias
- ✅ SEO otimizado (meta tags)

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints para:
- Mobile (até 480px)
- Tablet (481px - 768px)
- Desktop (769px+)

## 📝 Notas

- Os componentes são carregados dinamicamente via JavaScript
- As bibliotecas são carregadas via CDN (podem ser instaladas localmente)
- Todos os estilos seguem a metodologia BEM
- O projeto usa CSS Variables para fácil customização
- Suporte a prefers-reduced-motion para acessibilidade

## 🔗 Links Úteis

- [AOS Documentation](https://michalsnik.github.io/aos/)
- [Swiper Documentation](https://swiperjs.com/)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

## 📄 Licença

Este projeto é de direito autoral da conta do GitHub que hospeda este código. Todos os direitos reservados.
