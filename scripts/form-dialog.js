/**
 * Form Dialog Component
 * Componente de dialog com formulário de captura de leads
 */

/**
 * Padroniza o nome completo (primeira letra de cada palavra em maiúscula)
 * @param {string} name - Nome a ser padronizado
 * @returns {string} - Nome padronizado
 */
function standardizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Valida se o email contém @
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se válido
 */
function validateEmail(email) {
  return email.includes("@") && email.trim().length > 3;
}

/**
 * Formata o telefone brasileiro: (00) 00000-0000
 * @param {string} phone - Telefone a ser formatado
 * @returns {string} - Telefone formatado
 */
function formatPhone(phone) {
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, "");

  // Aplica a formatação baseada no tamanho
  if (numbers.length <= 2) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 11) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    // Limita a 11 dígitos
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
}

/**
 * Valida se o telefone está completo
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - True se válido (10 ou 11 dígitos)
 */
function validatePhone(phone) {
  const numbers = phone.replace(/\D/g, "");
  return numbers.length >= 10 && numbers.length <= 11;
}

/**
 * Salva o email no localStorage
 * @param {string} email - Email a ser salvo
 */
function saveEmailToLocalStorage(email) {
  if (email && email.trim().length > 0) {
    try {
      localStorage.setItem("carslab_user_email", email.trim());
    } catch (e) {
      console.warn("Não foi possível salvar o email no localStorage:", e);
    }
  }
}

/**
 * Salva o telefone no localStorage
 * @param {string} phone - Telefone a ser salvo
 */
function savePhoneToLocalStorage(phone) {
  if (phone && phone.trim().length > 0) {
    try {
      // Remove formatação e salva apenas números
      const numbers = phone.replace(/\D/g, "");
      if (numbers.length >= 10) {
        localStorage.setItem("carslab_user_phone", numbers);
      }
    } catch (e) {
      console.warn("Não foi possível salvar o telefone no localStorage:", e);
    }
  }
}

/**
 * Recupera o email do localStorage (função auxiliar para reutilização)
 * @returns {string|null} - Email salvo ou null se não existir
 */
function getEmailFromLocalStorage() {
  try {
    return localStorage.getItem("carslab_user_email");
  } catch (e) {
    console.warn("Não foi possível recuperar o email do localStorage:", e);
    return null;
  }
}

/**
 * Carrega o email do localStorage e preenche o campo
 */
function loadEmailFromLocalStorage() {
  try {
    const savedEmail = getEmailFromLocalStorage();
    if (savedEmail) {
      const emailInput = document.getElementById("email");
      if (emailInput) {
        emailInput.value = savedEmail;
      }
    }
  } catch (e) {
    console.warn("Não foi possível carregar o email do localStorage:", e);
  }
}

/**
 * Carrega o telefone do localStorage e preenche o campo
 */
function loadPhoneFromLocalStorage() {
  try {
    const savedPhone = localStorage.getItem("carslab_user_phone");
    if (savedPhone) {
      const phoneInput = document.getElementById("phone");
      if (phoneInput) {
        // Formata o telefone ao carregar
        phoneInput.value = formatPhone(savedPhone);
      }
    }
  } catch (e) {
    console.warn("Não foi possível carregar o telefone do localStorage:", e);
  }
}

/**
 * Abre o dialog do formulário
 */
function openFormDialog() {
  const dialog = document.getElementById("formDialog");
  if (dialog) {
    dialog.classList.remove("hidden");
    dialog.classList.add("flex");
    // Previne scroll do body quando o dialog está aberto
    document.body.style.overflow = "hidden";
    // Carrega dados salvos do localStorage
    loadEmailFromLocalStorage();
    loadPhoneFromLocalStorage();
  }
}

/**
 * Fecha o dialog do formulário
 */
function closeFormDialog() {
  const dialog = document.getElementById("formDialog");
  if (dialog) {
    dialog.classList.add("hidden");
    dialog.classList.remove("flex");
    // Restaura scroll do body
    document.body.style.overflow = "auto";
    // Limpa o formulário
    document.getElementById("leadForm").reset();
    // Remove mensagens de erro
    hideAllErrors();
    // Oculta os campos de contato
    document.getElementById("emailField").classList.add("hidden");
    document.getElementById("phoneField").classList.add("hidden");
  }
}

/**
 * Esconde todas as mensagens de erro
 */
function hideAllErrors() {
  document.getElementById("fullNameError").classList.add("hidden");
  document.getElementById("emailError").classList.add("hidden");
  document.getElementById("phoneError").classList.add("hidden");
}

/**
 * Mostra mensagem de erro para um campo específico
 * @param {string} fieldId - ID do campo com erro
 */
function showError(fieldId) {
  document.getElementById(`${fieldId}Error`).classList.remove("hidden");
}

/**
 * Atualiza a visibilidade dos campos de contato baseado nos checkboxes
 */
function updateContactFieldsVisibility() {
  const receiveEmailCheckbox = document.getElementById("receiveEmail");
  const receiveWhatsappCheckbox = document.getElementById("receiveWhatsapp");
  const emailField = document.getElementById("emailField");
  const phoneField = document.getElementById("phoneField");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  // Mostra/oculta campo de email
  if (receiveEmailCheckbox && receiveEmailCheckbox.checked) {
    emailField.classList.remove("hidden");
    emailInput.setAttribute("required", "required");
    // Carrega email do localStorage se o campo estiver vazio
    if (!emailInput.value) {
      loadEmailFromLocalStorage();
    }
  } else {
    emailField.classList.add("hidden");
    emailInput.removeAttribute("required");
    emailInput.value = "";
  }

  // Mostra/oculta campo de telefone
  if (receiveWhatsappCheckbox && receiveWhatsappCheckbox.checked) {
    phoneField.classList.remove("hidden");
    phoneInput.setAttribute("required", "required");
    // Carrega telefone do localStorage se o campo estiver vazio
    if (!phoneInput.value) {
      loadPhoneFromLocalStorage();
    }
  } else {
    phoneField.classList.add("hidden");
    phoneInput.removeAttribute("required");
    phoneInput.value = "";
  }
}

/**
 * Inicializa o dialog e seus event listeners
 */
function initFormDialog() {
  const dialog = document.getElementById("formDialog");
  const closeBtn = document.getElementById("closeDialogBtn");
  const form = document.getElementById("leadForm");
  const fullNameInput = document.getElementById("fullName");
  const phoneInput = document.getElementById("phone");
  const receiveEmailCheckbox = document.getElementById("receiveEmail");
  const receiveWhatsappCheckbox = document.getElementById("receiveWhatsapp");

  // Fecha o dialog ao clicar no botão de fechar
  if (closeBtn) {
    closeBtn.addEventListener("click", closeFormDialog);
  }

  // Fecha o dialog ao clicar fora dele
  if (dialog) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        closeFormDialog();
      }
    });
  }

  // Fecha o dialog ao pressionar ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeFormDialog();
    }
  });

  // Padroniza o nome ao sair do campo
  if (fullNameInput) {
    fullNameInput.addEventListener("blur", (e) => {
      e.target.value = standardizeName(e.target.value);
    });
  }

  // Formata o telefone enquanto o usuário digita e salva no localStorage
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      e.target.value = formatPhone(e.target.value);
      // Salva no localStorage enquanto o usuário digita
      savePhoneToLocalStorage(e.target.value);
    });
    // Salva também quando o usuário sai do campo
    phoneInput.addEventListener("blur", (e) => {
      savePhoneToLocalStorage(e.target.value);
    });
  }

  // Salva o email no localStorage quando o usuário digita
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("input", (e) => {
      saveEmailToLocalStorage(e.target.value);
    });
    // Salva também quando o usuário sai do campo
    emailInput.addEventListener("blur", (e) => {
      saveEmailToLocalStorage(e.target.value);
    });
  }

  // Atualiza visibilidade dos campos quando os checkboxes mudam
  if (receiveEmailCheckbox) {
    receiveEmailCheckbox.addEventListener(
      "change",
      updateContactFieldsVisibility,
    );
  }
  if (receiveWhatsappCheckbox) {
    receiveWhatsappCheckbox.addEventListener(
      "change",
      updateContactFieldsVisibility,
    );
  }

  // Submissão do formulário
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      hideAllErrors();

      const fullName = document.getElementById("fullName").value;
      const email = document.getElementById("email").value;
      const phone = document.getElementById("phone").value;
      const receiveEmail = document.getElementById("receiveEmail").checked;
      const receiveWhatsapp =
        document.getElementById("receiveWhatsapp").checked;

      let hasError = false;

      // Valida nome completo (deve ter pelo menos 2 palavras)
      if (fullName.trim().split(" ").length < 2) {
        showError("fullName");
        hasError = true;
      }

      // Valida se pelo menos um método de contato foi selecionado
      if (!receiveEmail && !receiveWhatsapp) {
        alert(
          "Por favor, selecione pelo menos uma forma de recebimento (e-mail ou WhatsApp)",
        );
        hasError = true;
      }

      // Valida email se foi selecionado
      if (receiveEmail && !validateEmail(email)) {
        showError("email");
        hasError = true;
      }

      // Valida telefone se foi selecionado
      if (receiveWhatsapp && !validatePhone(phone)) {
        showError("phone");
        hasError = true;
      }

      // Se não houver erros, redireciona
      if (!hasError) {
        // Salva os dados no localStorage antes de enviar
        if (receiveEmail && email) {
          saveEmailToLocalStorage(email);
        }
        if (receiveWhatsapp && phone) {
          savePhoneToLocalStorage(phone);
        }

        // Aqui você pode adicionar código para enviar os dados para um servidor
        const formData = {
          fullName: standardizeName(fullName),
          receiveEmail: receiveEmail,
          receiveWhatsapp: receiveWhatsapp,
        };

        if (receiveEmail) {
          formData.email = email.trim();
        }
        if (receiveWhatsapp) {
          formData.phone = phone.replace(/\D/g, ""); // Remove formatação para salvar apenas números
        }

        console.log("Dados do formulário:", formData);

        // Fecha o dialog
        closeFormDialog();

        // Pega o link do botão de submit
        const submitBtn = document.getElementById("submitDialogBtn");
        const redirectLink = submitBtn
          ? submitBtn.getAttribute("data-redirect-link")
          : "";
        const redirectTarget = submitBtn
          ? submitBtn.getAttribute("data-redirect-target") || "_blank"
          : "_blank";

        // Redireciona para o link
        if (redirectLink) {
          if (redirectTarget === "_self") {
            // Redireciona na mesma aba
            window.location.href = redirectLink;
          } else {
            // Redireciona em nova aba
            window.open(redirectLink, "_blank", "noopener,noreferrer");
          }
        }
      }
    });
  }
}

// Exporta funções para uso global
window.openFormDialog = openFormDialog;
window.closeFormDialog = closeFormDialog;
window.initFormDialog = initFormDialog;
window.getEmailFromLocalStorage = getEmailFromLocalStorage;
