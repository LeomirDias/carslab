/**
 * Form Dialog Component
 * Componente de dialog com formulário de captura de leads
 */

/**
 * Retorna a URL e o token da API de leads (CONFIG.leadApi ou variáveis de ambiente em build)
 */
function getLeadApiConfig() {
  if (typeof CONFIG !== "undefined" && CONFIG.leadApi) {
    return { url: CONFIG.leadApi.url, token: CONFIG.leadApi.token };
  }
  if (typeof process !== "undefined" && process.env) {
    return {
      url: process.env.LEAD_API_URL || process.env.API_URL,
      token: process.env.LEAD_API_TOKEN || process.env.API_TOKEN,
    };
  }
  return { url: "", token: "" };
}

/**
 * Envia os dados do lead para a API externa (POST).
 * Estrutura esperada pela API: landing_source, name, email?, phone?, contact_type?, user_type?, consent_marketing?, conversion_status?, product_id?
 * @param {Object} dadosLead - Objeto no formato da API (createLeadSchema)
 * @returns {Promise<Object>} - Resposta da API
 */
async function criarLead(dadosLead) {
  const { url: API_URL, token: API_TOKEN } = getLeadApiConfig();
  if (!API_URL || !API_TOKEN) {
    throw new Error(
      "API de leads não configurada. Defina CONFIG.leadApi em config.js",
    );
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(dadosLead),
    });

    const data = await response.json();

    if (!response.ok) {
      const err = new Error(data.error || "Erro ao criar lead");
      err.status = response.status;
      err.data = data;
      throw err;
    }

    console.log("Lead criado com sucesso:", data);
    return data;
  } catch (error) {
    console.error("Erro na requisição:", error);
    throw error;
  }
}

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
 * @param {string} [containerId] - ID do container onde o dialog está (ex.: check-form-dialog-container)
 */
function openFormDialog(containerId) {
  const root = containerId ? document.getElementById(containerId) : document;
  const dialog = root
    ? root.querySelector("#formDialog")
    : document.getElementById("formDialog");
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
 * @param {string} [containerId] - ID do container onde o dialog está
 */
function closeFormDialog(containerId) {
  const root = containerId ? document.getElementById(containerId) : document;
  const dialog = root
    ? root.querySelector("#formDialog")
    : document.getElementById("formDialog");
  if (dialog) {
    dialog.classList.add("hidden");
    dialog.classList.remove("flex");
    document.body.style.overflow = "auto";
    const getEl = (id) =>
      root && root.querySelector
        ? root.querySelector("#" + id)
        : document.getElementById(id);
    const leadFormEl = getEl("leadForm");
    if (leadFormEl) leadFormEl.reset();
    const emailFieldEl = getEl("emailField");
    const phoneFieldEl = getEl("phoneField");
    if (emailFieldEl) emailFieldEl.classList.add("hidden");
    if (phoneFieldEl) phoneFieldEl.classList.add("hidden");
    hideAllErrors(root);
  }
}

/**
 * Esconde todas as mensagens de erro
 * @param {Element} [root] - Elemento raiz para buscar (ex.: container do dialog)
 */
function hideAllErrors(root) {
  const getEl = (id) =>
    root && root.querySelector
      ? root.querySelector("#" + id)
      : document.getElementById(id);
  ["fullNameError", "emailError", "phoneError"].forEach((id) => {
    const el = getEl(id);
    if (el) el.classList.add("hidden");
  });
}

/**
 * Mostra mensagem de erro para um campo específico
 * @param {string} fieldId - ID do campo com erro
 * @param {Element} [root] - Elemento raiz para buscar
 */
function showError(fieldId, root) {
  const getEl = (id) =>
    root && root.querySelector
      ? root.querySelector("#" + id)
      : document.getElementById(id);
  const el = getEl(`${fieldId}Error`);
  if (el) el.classList.remove("hidden");
}

/**
 * Atualiza a visibilidade dos campos de contato baseado nos checkboxes
 * @param {Element} [root] - Elemento raiz para buscar (ex.: container do dialog)
 */
function updateContactFieldsVisibility(root) {
  const getEl = (id) =>
    root && root.querySelector
      ? root.querySelector("#" + id)
      : document.getElementById(id);
  const receiveEmailCheckbox = getEl("receiveEmail");
  const receiveWhatsappCheckbox = getEl("receiveWhatsapp");
  const emailField = getEl("emailField");
  const phoneField = getEl("phoneField");
  const emailInput = getEl("email");
  const phoneInput = getEl("phone");

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
 * @param {string} [containerId] - ID do container onde o dialog está (ex.: check-form-dialog-container). Use na página do funnel para garantir que o form correto seja vinculado.
 */
function initFormDialog(containerId) {
  const root = containerId ? document.getElementById(containerId) : document;
  if (containerId && !root) {
    console.warn("initFormDialog: container não encontrado", containerId);
    return;
  }
  const get = (id) =>
    root.querySelector
      ? root.querySelector("#" + id)
      : document.getElementById(id);
  const dialog = get("formDialog");
  const closeBtn = get("closeDialogBtn");
  const form = get("leadForm");
  const fullNameInput = get("fullName");
  const phoneInput = get("phone");
  const receiveEmailCheckbox = get("receiveEmail");
  const receiveWhatsappCheckbox = get("receiveWhatsapp");

  const closeDialog = () => closeFormDialog(containerId);

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDialog);
  }

  if (dialog) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        closeDialog();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dialog && !dialog.classList.contains("hidden")) {
      closeDialog();
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

  const emailInput = get("email");
  if (emailInput) {
    emailInput.addEventListener("input", (e) => {
      saveEmailToLocalStorage(e.target.value);
    });
    // Salva também quando o usuário sai do campo
    emailInput.addEventListener("blur", (e) => {
      saveEmailToLocalStorage(e.target.value);
    });
  }

  const updateVisibility = () => updateContactFieldsVisibility(root);
  if (receiveEmailCheckbox) {
    receiveEmailCheckbox.addEventListener("change", updateVisibility);
  }
  if (receiveWhatsappCheckbox) {
    receiveWhatsappCheckbox.addEventListener("change", updateVisibility);
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideAllErrors(root);

      const fullName = (get("fullName") && get("fullName").value) || "";
      const email = (get("email") && get("email").value) || "";
      const phone = (get("phone") && get("phone").value) || "";
      const receiveEmail = get("receiveEmail")
        ? get("receiveEmail").checked
        : false;
      const receiveWhatsapp = get("receiveWhatsapp")
        ? get("receiveWhatsapp").checked
        : false;

      let hasError = false;

      if (fullName.trim().split(" ").length < 2) {
        showError("fullName", root);
        hasError = true;
      }

      if (!receiveEmail && !receiveWhatsapp) {
        alert(
          "Por favor, selecione pelo menos uma forma de recebimento (e-mail ou WhatsApp)",
        );
        hasError = true;
      }

      if (receiveEmail && !validateEmail(email)) {
        showError("email", root);
        hasError = true;
      }

      if (receiveWhatsapp && !validatePhone(phone)) {
        showError("phone", root);
        hasError = true;
      }

      if (!hasError) {
        if (receiveEmail && email) {
          saveEmailToLocalStorage(email);
        }
        if (receiveWhatsapp && phone) {
          savePhoneToLocalStorage(phone);
        }

        const contactType =
          receiveEmail && receiveWhatsapp
            ? "both"
            : receiveEmail
              ? "email"
              : "phone";
        const dadosLead = {
          landing_source: "check-lavagem-segura",
          name: standardizeName(fullName),
          contact_type: contactType,
          user_type: "hobby",
          consent_marketing: true,
          conversion_status: "not_converted",
        };
        if (receiveEmail && email.trim()) {
          dadosLead.email = email.trim();
        }
        if (receiveWhatsapp && phone) {
          dadosLead.phone = phone.replace(/\D/g, "");
        }
        const productId =
          typeof CONFIG !== "undefined" &&
          CONFIG.leadApi &&
          CONFIG.leadApi.productId
            ? CONFIG.leadApi.productId
            : null;
        if (productId) {
          dadosLead.product_id = productId;
        }

        const submitBtn = get("submitDialogBtn");
        const originalBtnText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Enviando...";
        }

        let apiOk = false;
        try {
          await criarLead(dadosLead);
          apiOk = true;
        } catch (error) {
          console.error("Erro ao enviar lead para a API:", error);
          if (error.status === 409) {
            alert(
              "Já existe um cadastro com este e-mail ou telefone. Utilize outros dados ou acesse seu e-mail/WhatsApp para obter o material.",
            );
          } else {
            alert(
              "Não foi possível enviar. Verifique sua conexão e tente novamente.",
            );
          }
        }

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }

        if (!apiOk) return;

        closeDialog();

        const redirectLink = submitBtn
          ? submitBtn.getAttribute("data-redirect-link")
          : "";
        const redirectTarget = submitBtn
          ? submitBtn.getAttribute("data-redirect-target") || "_blank"
          : "_blank";

        if (redirectLink) {
          if (redirectTarget === "_self") {
            window.location.href = redirectLink;
          } else {
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
