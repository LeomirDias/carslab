/**
 * Question Dialog Component
 * Componente de dialog com pergunta rápida sobre o objetivo do usuário
 */

/**
 * Atualiza o user_type do lead na API externa (PATCH).
 * @param {Object} emailOuPhone - Objeto com email e/ou phone: { email?: string, phone?: string }
 * @param {string} novoUserType - Novo tipo: "hobby" ou "empreendedor"
 * @returns {Promise<Object>} - Resposta da API { success, data }
 */
async function atualizarUserType(emailOuPhone, novoUserType) {
  const API_URL = process.env.API_URL; // ou sua URL de produção
  const API_TOKEN = process.env.API_TOKEN; // ou use variável de ambiente

  const body = {
    user_type: novoUserType,
    ...(emailOuPhone.email && { email: emailOuPhone.email }),
    ...(emailOuPhone.phone && { phone: emailOuPhone.phone }),
  };

  const response = await fetch(API_URL, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (response.status === 401) throw new Error("Token inválido");
  if (response.status === 404) throw new Error("Lead não encontrado");
  if (response.status === 400) throw new Error(data.error || "Dados inválidos");
  if (!response.ok) throw new Error(data.error || "Erro ao atualizar");

  return data; // { success: true, data: { id, user_type, email, phone, ... } }
}

/**
 * Recupera o email do localStorage
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
 * Recupera o telefone do localStorage
 * @returns {string|null} - Telefone salvo ou null se não existir
 */
function getPhoneFromLocalStorage() {
  try {
    return localStorage.getItem("carslab_user_phone");
  } catch (e) {
    console.warn("Não foi possível recuperar o telefone do localStorage:", e);
    return null;
  }
}

/**
 * Recupera email ou telefone do localStorage (prioriza email)
 * @returns {Object} - Objeto com {contact: string, type: 'email'|'phone'|null}
 */
function getContactFromLocalStorage() {
  const email = getEmailFromLocalStorage();
  if (email) {
    return { contact: email, type: "email" };
  }

  const phone = getPhoneFromLocalStorage();
  if (phone) {
    return { contact: phone, type: "phone" };
  }

  return { contact: null, type: null };
}

/**
 * Salva contato (email ou telefone) e tipo de usuário no localStorage
 * @param {string} contact - Email ou telefone do usuário
 * @param {string} contactType - Tipo de contato ("email" ou "phone")
 * @param {string} userType - Tipo do usuário ("hobby" ou "empreendedor")
 */
function saveUserTypeToLocalStorage(contact, contactType, userType) {
  if (!contact || !contactType || !userType) {
    console.warn("Contato, tipo de contato ou tipo de usuário não fornecido");
    return;
  }

  try {
    const userData = {
      contact: contact.trim(),
      contactType: contactType,
      userType: userType,
    };

    // Mantém compatibilidade com código antigo que espera 'email'
    if (contactType === "email") {
      userData.email = contact.trim();
    } else if (contactType === "phone") {
      userData.phone = contact.trim();
    }

    localStorage.setItem("carslab_user_data", JSON.stringify(userData));
    console.log("Dados do usuário salvos:", userData);
  } catch (e) {
    console.warn(
      "Não foi possível salvar os dados do usuário no localStorage:",
      e,
    );
  }
}

/**
 * Abre o dialog de pergunta
 */
function openQuestionDialog() {
  const dialog = document.getElementById("questionDialog");
  if (dialog) {
    dialog.classList.remove("hidden");
    dialog.classList.add("flex");
    // Previne scroll do body quando o dialog está aberto
    document.body.style.overflow = "hidden";
  }
}

/**
 * Fecha o dialog de pergunta
 */
function closeQuestionDialog() {
  const dialog = document.getElementById("questionDialog");
  if (dialog) {
    dialog.classList.add("hidden");
    dialog.classList.remove("flex");
    // Restaura scroll do body
    document.body.style.overflow = "auto";
    // Limpa o formulário
    const form = document.getElementById("questionForm");
    if (form) {
      form.reset();
    }
    // Remove mensagens de erro
    hideQuestionError();
  }
}

/**
 * Esconde a mensagem de erro
 */
function hideQuestionError() {
  const errorElement = document.getElementById("questionError");
  if (errorElement) {
    errorElement.classList.add("hidden");
  }
}

/**
 * Mostra a mensagem de erro
 */
function showQuestionError() {
  const errorElement = document.getElementById("questionError");
  if (errorElement) {
    errorElement.classList.remove("hidden");
  }
}

/**
 * Inicializa o dialog de pergunta e seus event listeners
 */
function initQuestionDialog() {
  const dialog = document.getElementById("questionDialog");
  const form = document.getElementById("questionForm");

  // Fecha o dialog ao clicar fora dele (opcional - pode remover se quiser obrigar resposta)
  if (dialog) {
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        // Não permite fechar clicando fora - usuário deve responder
        // closeQuestionDialog();
      }
    });
  }

  // Fecha o dialog ao pressionar ESC (opcional - pode remover se quiser obrigar resposta)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const dialogElement = document.getElementById("questionDialog");
      if (dialogElement && !dialogElement.classList.contains("hidden")) {
        // Não permite fechar com ESC - usuário deve responder
        // closeQuestionDialog();
      }
    }
  });

  // Submissão do formulário
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      hideQuestionError();

      const selectedOption = document.querySelector(
        'input[name="userType"]:checked',
      );
      const contactInfo = getContactFromLocalStorage();

      // Valida se uma opção foi selecionada
      if (!selectedOption) {
        showQuestionError();
        return;
      }

      // Valida se existe email ou telefone no localStorage
      if (!contactInfo.contact) {
        alert(
          "Não foi possível encontrar seus dados de contato. Por favor, volte e preencha o formulário novamente.",
        );
        return;
      }

      const userType = selectedOption.value;

      // Monta objeto de contato para a API (email ou phone)
      const emailOuPhone =
        contactInfo.type === "email"
          ? { email: contactInfo.contact }
          : { phone: contactInfo.contact };

      // Desabilita o botão para evitar múltiplos envios
      const submitBtn = document.getElementById("submitQuestionBtn");
      const originalBtnText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Enviando...";
      }

      // Atualiza o user_type do lead na API externa
      try {
        atualizarUserType(emailOuPhone, userType);
      } catch (error) {
        console.error("Erro ao atualizar user_type na API:", error);
        // Continua o fluxo: salva no localStorage e fecha o dialog
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }

      // Salva contato (email ou telefone) + tipo de usuário no localStorage
      saveUserTypeToLocalStorage(
        contactInfo.contact,
        contactInfo.type,
        userType,
      );

      // Fecha o dialog
      closeQuestionDialog();
    });
  }
}

// Exporta funções para uso global
window.openQuestionDialog = openQuestionDialog;
window.closeQuestionDialog = closeQuestionDialog;
window.initQuestionDialog = initQuestionDialog;
window.getEmailFromLocalStorage = getEmailFromLocalStorage;
window.getPhoneFromLocalStorage = getPhoneFromLocalStorage;
window.getContactFromLocalStorage = getContactFromLocalStorage;
window.atualizarUserType = atualizarUserType;
