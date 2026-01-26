// ============================================================================
// PORTAL DASHBOARDS - SCRIPT PRINCIPAL
// Versão otimizada e comentada
// ============================================================================

// -------- CONSTANTES GLOBAIS --------
// Chaves para localStorage para persistir estados do usuário
const STORAGE_KEY_SECTION = 'lastActiveSection'; // Última seção ativa
const STORAGE_KEY_THEME = 'preferredTheme';     // Tema preferido (light/dark)
const STORAGE_KEY_SHEETS = 'customSheets';      // Planilhas customizadas adicionadas pelo usuário
const STORAGE_KEY_ORIGINAL_CATEGORIES = 'originalSheetCategories'; // Categorias alteradas de planilhas originais
const TOAST_DURATION = 3000; // Duração dos toasts em ms

// -------- CARREGAMENTO IMEDIATO DO TEMA --------
// Executa antes do DOM carregar para evitar flash de tema errado
(function() {
  // Limpa localStorage se tiver valor inválido
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
  const validTheme = (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  
  document.documentElement.setAttribute('data-theme', validTheme);
  localStorage.setItem(STORAGE_KEY_THEME, validTheme);
  
  console.log(`✅ Tema carregado imediatamente: ${validTheme}`);
})();

// -------- ANIMAÇÕES DO MENU --------
function setupMenuAnimations() {
  // Animações escalonadas para menu-items
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach((item, index) => {
    item.style.setProperty('--menu-index', index);
  });

  // Animações escalonadas para submenu items
  const submenuItems = document.querySelectorAll('.submenu a');
  submenuItems.forEach((item, index) => {
    item.style.setProperty('--submenu-index', index);
  });

  console.log('✅ Animações do menu configuradas');
}

// -------- INICIALIZAÇÃO --------
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  loadThemePreference();
  loadLastSection();
  setupKeyboardNavigation();
  setupLazyLoading();
  validateURLs();
  loadCustomSheets();
  setupConfigModal();
  setupMenuAnimations();
  console.log('✅ App inicializado com sucesso');
}

// ============================================================================
// 1. EVENT LISTENERS MODERNOS (Remove onclick inline)
// ============================================================================

function setupEventListeners() {
  // Menu Toggle Dashboard
  const menuDashboard = document.querySelector('.menu-dashboard');
  if (menuDashboard) {
    menuDashboard.addEventListener('click', toggleMenu);
  }

  // Menu Toggle Gerenciar Planilhas
  const menuConfig = document.querySelector('.menu-config');
  if (menuConfig) {
    menuConfig.addEventListener('click', toggleMenuConfig);
    
    // Inicializar estado da seta: começa fechado, seta para cima
    const submenuConfig = document.getElementById('submenu-config');
    const arrowsConfig = document.querySelectorAll('.menu-config .arrow');
    if (submenuConfig && !submenuConfig.classList.contains('open')) {
      arrowsConfig.forEach(arrow => arrow.classList.add('rotate'));
    }
  }

  // Links de Seção
  const submenuLinks = document.querySelectorAll('.submenu a[data-section]');
  submenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      if (sectionId) {
        showSection(sectionId, link);
      }
    });
  });

  // Menu Gerenciar Planilhas - Adicionar
  const addSheetMenu = document.getElementById('add-sheet-menu');
  if (addSheetMenu) {
    addSheetMenu.addEventListener('click', (e) => {
      e.preventDefault();
      openConfigModal();
    });
  }

  // Menu Gerenciar Planilhas - Editar
  const editSheetMenu = document.getElementById('edit-sheet-menu');
  if (editSheetMenu) {
    editSheetMenu.addEventListener('click', (e) => {
      e.preventDefault();
      openEditModal();
    });
  }

  // Menu Gerenciar Planilhas - Deletar
  const deleteSheetMenu = document.getElementById('delete-sheet-menu');
  if (deleteSheetMenu) {
    deleteSheetMenu.addEventListener('click', (e) => {
      e.preventDefault();
      openDeleteModal();
    });
  }

  // Banners - Feedback visual (hover)
  const banners = document.querySelectorAll('.banner');
  banners.forEach(banner => {
    banner.addEventListener('click', () => {
      // Log opcional para debug
      // console.log('Banner clicado');
    });
  });

  // Dark/Light Mode Toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
    // console.log('✅ Event listener do tema adicionado');
  } else {
    console.error('❌ Botão de tema não encontrado');
  }

  // Menu Hambúrguer
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileSidebar);
  }

  // Fechar sidebar ao clicar fora
  document.addEventListener('click', (e) => {
    const sidebar = document.querySelector('.sidebar');
    const hamburger = document.getElementById('hamburger');
    if (sidebar && hamburger && window.innerWidth < 768) {
      if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
        sidebar.classList.remove('open');
        hamburger.classList.remove('active');
      }
    }
  });

  // Search
  const searchInput = document.querySelector('.search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearch, 300));
  }
}

// ============================================================================
// 2. NAVEGAÇÃO E SEÇÕES
// ============================================================================

function toggleMenu() {
  const submenu = document.querySelector('.submenu');
  const arrow = document.querySelector('.arrow');
  
  if (submenu && arrow) {
    const isOpen = submenu.classList.contains('open');
    submenu.classList.toggle('open');
    
    // Ajustar seta: para cima quando fechado, para baixo quando aberto
    if (submenu.classList.contains('open')) {
      arrow.classList.remove('rotate');
    } else {
      arrow.classList.add('rotate');
    }
    
    // ARIA - Acessibilidade
    const menuDashboard = document.querySelector('.menu-dashboard');
    if (menuDashboard) {
      menuDashboard.setAttribute('aria-expanded', !isOpen);
    }
  }
}

function toggleMenuConfig() {
  const submenuConfig = document.getElementById('submenu-config');
  const arrows = document.querySelectorAll('.menu-config .arrow');
  
  if (submenuConfig && arrows.length > 0) {
    const isOpen = submenuConfig.classList.contains('open');
    submenuConfig.classList.toggle('open');
    
    // Ajustar seta: para cima quando fechado, para baixo quando aberto
    if (submenuConfig.classList.contains('open')) {
      arrows.forEach(arrow => arrow.classList.remove('rotate'));
    } else {
      arrows.forEach(arrow => arrow.classList.add('rotate'));
    }
    
    // ARIA - Acessibilidade
    const menuConfig = document.querySelector('.menu-config');
    if (menuConfig) {
      menuConfig.setAttribute('aria-expanded', !isOpen);
    }
  }
}

function showSection(id, element) {
  // Validar ID
  const section = document.getElementById(id);
  if (!section) {
    console.error('❌ Seção não encontrada:', id);
    return;
  }
  
  // Remover active de todas as seções
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
    sec.setAttribute('aria-hidden', 'true');
  });
  section.classList.add('active');
  section.setAttribute('aria-hidden', 'false');

  // Remover active de todos os links
  document.querySelectorAll('.submenu a').forEach(a => {
    a.classList.remove('active');
    a.setAttribute('aria-current', 'false');
  });
  
  // Adicionar active ao clicado
  if (element) {
    element.classList.add('active');
    element.setAttribute('aria-current', 'page');
  }

  // Salvar no localStorage
  localStorage.setItem(STORAGE_KEY_SECTION, id);
  
  // Animar banners da seção ativa
  setTimeout(() => {
    const activeBanners = section.querySelectorAll('.banner');
    activeBanners.forEach((banner, index) => {
      banner.style.setProperty('--banner-index', index);
      banner.style.animationDelay = `${0.6 + index * 0.2}s`;
      banner.style.opacity = '1';
    });
  }, 100);
  
  console.log(`✅ ${element.textContent.trim()} carregada`);
  
  // Scroll ao topo
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadLastSection() {
  const lastSection = localStorage.getItem(STORAGE_KEY_SECTION) || 'assistencial';
  const link = document.querySelector(`.submenu a[data-section="${lastSection}"]`);
  if (link) {
    showSection(lastSection, link);
  }
}

// ============================================================================
// 3. DARK/LIGHT MODE
// ============================================================================

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  console.log(`🔄 Tema atual: ${currentTheme}, Novo tema: ${newTheme}`);
  
  // Aplicar novo tema
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem(STORAGE_KEY_THEME, newTheme);
  
  // Atualizar ícone com imagem
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.classList.add('rotate-animation');
    setTimeout(() => toggle.classList.remove('rotate-animation'), 600);
    toggle.innerHTML = newTheme === 'dark' 
      ? '<img src="./img/icon/sol.png" alt="Modo claro" class="sun-icon" style="width: 48px; height: 48px;">' 
      : '<img src="./img/icon/lua.png" alt="Modo escuro" class="moon-icon" style="width: 48px; height: 48px;">';
    toggle.setAttribute('aria-label', `Mudar para modo ${newTheme === 'dark' ? 'escuro' : 'claro'}`);
    console.log(`✅ Ícone atualizado para: ${newTheme}`);
  }
  
  console.log(`✅ Tema alterado para: ${newTheme}`);
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  const html = document.documentElement;
  html.setAttribute('data-theme', savedTheme);
  
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.innerHTML = savedTheme === 'dark' 
      ? '<img src="./img/icon/sol.png" alt="Modo claro" class="sun-icon" style="width: 48px; height: 48px;">' 
      : '<img src="./img/icon/lua.png" alt="Modo escuro" class="moon-icon" style="width: 48px; height: 48px;">';
    toggle.setAttribute('aria-label', `Mudar para modo ${savedTheme === 'dark' ? 'claro' : 'escuro'}`);
  }
  
  console.log(`✅ Preferência de tema carregada: ${savedTheme}`);
}

// ============================================================================
// 4. NAVEGAÇÃO POR TECLADO
// ============================================================================

function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // ESC - Fechar menu
    if (e.key === 'Escape') {
      const submenu = document.querySelector('.submenu');
      if (submenu && submenu.classList.contains('open')) {
        toggleMenu();
      }
    }

    // TAB - Suporte nativo do navegador
    // ENTER - Ativar links
    if (e.key === 'Enter') {
      const focused = document.activeElement;
      if (focused && focused.tagName === 'A' && focused.closest('.submenu') && focused.hasAttribute('data-section')) {
        e.preventDefault();
        showSection(focused.dataset.section, focused);
      }
    }
  });
}

// ============================================================================
// 5. VALIDAÇÃO DE URLS
// ============================================================================

function validateURLs() {
  const banners = document.querySelectorAll('.banner');
  
  banners.forEach(banner => {
    const url = banner.getAttribute('href');
    
    if (!url) {
      console.warn('⚠️ Banner sem URL:', banner.textContent);
      banner.style.opacity = '0.5';
      banner.setAttribute('aria-disabled', 'true');
      return;
    }

    // Validar URL (simples)
    if (!isValidURL(url)) {
      console.warn('⚠️ URL inválida:', url);
      banner.style.pointerEvents = 'none';
      banner.style.opacity = '0.6';
    }

    // Adicionar rel="noopener noreferrer" para segurança
    if (banner.target === '_blank') {
      banner.rel = 'noopener noreferrer';
    }
  });
}

function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// ============================================================================
// 6. LAZY LOADING
// ============================================================================

function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const banners = document.querySelectorAll('.banner');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const banner = entry.target;
          banner.style.backgroundImage = banner.dataset.bg || 
            window.getComputedStyle(banner).backgroundImage;
          banner.classList.add('loaded');
          observer.unobserve(banner);
        }
      });
    });

    banners.forEach(banner => {
      imageObserver.observe(banner);
    });
  }
}

// ============================================================================
// 7. BUSCA DE DASHBOARDS
// ============================================================================

function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  const sections = document.querySelectorAll('.section');
  const titles = document.querySelectorAll('.section-title');
  
  if (!query) {
    // Se não há busca, restaurar estado normal (mostrar apenas a seção ativa)
    titles.forEach(title => title.style.display = '');
    
    // Restaurar display de todos os banners
    document.querySelectorAll('.banner').forEach(banner => {
      banner.style.display = '';
    });
    
    const activeLink = document.querySelector('.submenu a.active');
    if (activeLink) {
      const sectionId = activeLink.dataset.section;
      showSection(sectionId, activeLink);
    }
    return;
  }

  // Com busca, mostrar TODAS as seções e esconder títulos
  sections.forEach(section => {
    section.classList.add('active');
    section.setAttribute('aria-hidden', 'false');
  });
  
  titles.forEach(title => title.style.display = 'none');

  // Filtrar banners globalmente
  let foundResults = false;
  document.querySelectorAll('.banner').forEach(banner => {
    const text = banner.textContent.toLowerCase();
    const matches = text.includes(query);
    banner.style.display = matches ? '' : 'none';
    if (matches) foundResults = true;
  });

  if (!foundResults) {
    showToast('Nenhuma planilha encontrada', 'info');
  }
}

// ============================================================================
// 8. TOAST NOTIFICATIONS
// ============================================================================

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;
  
  container.appendChild(toast);
  
  // Animação de entrada
  setTimeout(() => toast.classList.add('show'), 10);
  
  // Remover após duração
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, TOAST_DURATION);
}

function showSuccessToast(message) {
  showToast(message, 'success');
}

function showErrorToast(message) {
  showToast(message, 'error');
}

function showInfoToast(message) {
  showToast(message, 'info');
}

function showLoadingToast(message) {
  showToast(message, 'loading');
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-atomic', 'true');
  document.body.appendChild(container);
  return container;
}

function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const hamburger = document.getElementById('hamburger');
  if (sidebar && hamburger) {
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('active');
  }
}

// ============================================================================
// 10. UTILITÁRIOS
// ============================================================================

// Debounce para otimizar eventos de input (ex: busca)
// Evita execuções excessivas em digitação rápida
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Log de performance
function logPerformance() {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    console.log(`⏱️ Tempo de carregamento: ${loadTime}ms`);
  }
}

// Executar ao carregar
window.addEventListener('load', logPerformance);

// ============================================================================
// 12. GERENCIAR PLANILHAS CUSTOMIZADAS
// ============================================================================

function setupConfigModal() {
  const closeBtn = document.getElementById('close-modal');
  const cancelBtn = document.getElementById('cancel-form');
  const modal = document.getElementById('config-modal');
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('add-sheet-form');

  if (!modal) {
    console.warn('⚠️ Modal não encontrado no DOM');
    return;
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeConfigModal);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeConfigModal);
  }

  if (overlay) {
    overlay.addEventListener('click', closeConfigModal);
  }

  if (form) {
    form.addEventListener('submit', handleAddSheet);
  }

  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.getElementById('config-modal');
      if (activeModal && activeModal.classList.contains('active')) {
        closeConfigModal();
      }
    }
  });
}

function openConfigModal() {
  const modal = document.getElementById('config-modal');
  const overlay = document.getElementById('modal-overlay');
  
  if (modal && overlay) {
    modal.classList.add('active');
    overlay.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Animar form-groups
    setTimeout(() => {
      const formGroups = modal.querySelectorAll('.form-group');
      formGroups.forEach((group, index) => {
        group.style.setProperty('--form-index', index);
        group.style.animationDelay = `${0.3 + index * 0.1}s`;
        group.style.opacity = '1';
      });
    }, 300);
  }
}

function closeConfigModal() {
  const modal = document.getElementById('config-modal');
  const overlay = document.getElementById('modal-overlay');
  const form = document.getElementById('add-sheet-form');
  
  if (modal && overlay) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  
  if (form) {
    form.reset();
  }
}

function handleAddSheet(e) {
  e.preventDefault();
  
  const name = document.getElementById('sheet-name').value.trim();
  const link = document.getElementById('sheet-link').value.trim();
  const category = document.getElementById('sheet-category').value.trim();
  const imageInput = document.getElementById('sheet-image');
  const messageDiv = document.getElementById('form-message');

  if (!name || !link || !category) {
    showFormMessage('Preencha todos os campos', 'error');
    return;
  }

  // Validar URL
  if (!isValidURL(link)) {
    showFormMessage('URL inválida. Verifique o link.', 'error');
    return;
  }

  // Se o usuário forneceu uma imagem, processa; senão usa a logo padrão
  const file = imageInput.files[0];

  const finalizeWithImage = (imageSrc) => {
    const sheet = {
      id: 'custom-' + Date.now(),
      name: name,
      link: link,
      category: category,
      image: imageSrc,
      timestamp: new Date().toISOString()
    };

    saveCustomSheet(sheet);
    addSheetToDOM(sheet);
    showFormMessage('✅ Planilha adicionada com sucesso!', 'success');

    setTimeout(() => {
      closeConfigModal();
      document.getElementById('add-sheet-form').reset();
    }, 2000);

    console.log('✅ Nova planilha adicionada:', sheet);
  };

  if (file) {
    showFormMessage('Processando imagem...', 'loading');
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = resizeImage(img, 1248, 375);
        const resizedBase64 = canvas.toDataURL('image/webp', 0.9);
        finalizeWithImage(resizedBase64);
      };

      img.onerror = () => {
        showFormMessage('Erro ao carregar imagem. Tente outro arquivo.', 'error');
      };

      img.src = event.target.result;
    };

    reader.onerror = () => {
      showFormMessage('Erro ao ler arquivo.', 'error');
    };

    reader.readAsDataURL(file);
  } else {
    // Usar logo padrão da pasta img/logos
    const defaultLogoPath = './img/logos/logo.webp';
    finalizeWithImage(defaultLogoPath);
  }
}

function resizeImage(img, maxWidth, maxHeight) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Calcular aspecto ratio
  const imgRatio = img.width / img.height;
  const targetRatio = maxWidth / maxHeight;

  let drawWidth, drawHeight, offsetX = 0, offsetY = 0;

  if (imgRatio > targetRatio) {
    // Imagem mais larga
    drawHeight = maxHeight;
    drawWidth = maxHeight * imgRatio;
    offsetX = (drawWidth - maxWidth) / 2;
  } else {
    // Imagem mais alta
    drawWidth = maxWidth;
    drawHeight = maxWidth / imgRatio;
    offsetY = (drawHeight - maxHeight) / 2;
  }

  canvas.width = maxWidth;
  canvas.height = maxHeight;

  // Desenhar imagem centralizada e cortada
  ctx.drawImage(img, -offsetX, -offsetY, drawWidth, drawHeight);

  return canvas;
}

function saveCustomSheet(sheet) {
  let sheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
  sheets.push(sheet);
  localStorage.setItem(STORAGE_KEY_SHEETS, JSON.stringify(sheets));
}

function loadCustomSheets() {
  const sheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
  const originalCategories = JSON.parse(localStorage.getItem(STORAGE_KEY_ORIGINAL_CATEGORIES) || '{}');
  
  // Aplicar categorias alteradas às planilhas originais
  const allBanners = document.querySelectorAll('.banner');
  allBanners.forEach(banner => {
    const sheetId = banner.getAttribute('data-sheet-id');
    if (sheetId && originalCategories[sheetId]) {
      const newCategory = originalCategories[sheetId];
      const sectionMap = {
        'assistencial': 'assistencial',
        'rh': 'rh',
        'planilhas': 'planilhas'
      };
      const newSectionId = sectionMap[newCategory] || 'planilhas';
      const newSection = document.getElementById(newSectionId);
      
      if (newSection && banner.parentElement.id !== newSectionId) {
        newSection.appendChild(banner);
      }
    }
  });
  
  sheets.forEach(sheet => {
    addSheetToDOM(sheet);
  });

  if (sheets.length > 0) {
    console.log(`✅ ${sheets.length} planilha(s) customizada(s) carregada(s)`);
  }
}

function addSheetToDOM(sheet) {
  // Mapear categoria para section ID
  const sectionMap = {
    'assistencial': 'assistencial',
    'rh': 'rh',
    'planilhas': 'planilhas'
  };

  const sectionId = sectionMap[sheet.category] || 'planilhas';
  const section = document.getElementById(sectionId);
  
  if (!section) {
    console.error('❌ Seção não encontrada:', sectionId);
    return;
  }

  // Criar elemento
  const banner = document.createElement('a');
  banner.href = sheet.link;
  banner.target = '_blank';
  banner.className = 'banner custom-banner';
  banner.style.backgroundImage = `url('${sheet.image}')`;
  banner.setAttribute('aria-label', `Abrir: ${sheet.name}`);
  banner.setAttribute('data-sheet-id', sheet.id);
  banner.innerHTML = `<div class="banner-text"><h2>${sheet.name}</h2></div>`;

  // Adicionar ao DOM
  section.appendChild(banner);

  // Aplicar eventos
  banner.addEventListener('click', () => {
    // Log opcional
    // console.log(`✅ Banner customizado clicado: ${sheet.name}`);
  });

  console.log(`✅ Planilha adicionada na seção: ${sheet.category}`);
}

function showFormMessage(message, type) {
  const messageDiv = document.getElementById('form-message');
  if (messageDiv) {
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';
  }
}

// ============================================================================
// EDITAR E DELETAR PLANILHAS CUSTOMIZADAS
// ============================================================================

function openEditModal() {
  // Listar TODOS os banners (originais + customizados)
  const allBanners = document.querySelectorAll('.banner');
  const customSheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
  
  if (allBanners.length === 0) {
    showToast('Nenhuma planilha para editar', 'info');
    return;
  }

  // Criar modal de seleção
  const modal = document.createElement('div');
  modal.className = 'edit-modal-overlay';
  modal.id = 'edit-modal-overlay';
  modal.setAttribute('aria-hidden', 'false');
  
  let content = `
    <div class="edit-modal-content">
      <div class="edit-modal-header">
        <h2>Editar Planilha</h2>
        <button class="close-modal" aria-label="Fechar">&times;</button>
      </div>
      <div class="edit-modal-list">
  `;

  allBanners.forEach(banner => {
    const sheetId = banner.getAttribute('data-sheet-id');
    const sheetName = banner.querySelector('h2')?.textContent || 'Sem nome';
    const isCustom = customSheets.some(s => s.id === sheetId);
    const typeLabel = isCustom ? '(Customizada)' : '(Original)';
    
    content += `
      <div class="edit-modal-item" data-id="${sheetId}" data-is-custom="${isCustom}">
        <div class="edit-item-info">
          <h3>${sheetName}</h3>
          <p>${typeLabel}</p>
        </div>
        <button class="edit-btn" aria-label="Editar ${sheetName}">Editar</button>
      </div>
    `;
  });

  content += `
      </div>
    </div>
  `;

  modal.innerHTML = content;
  document.body.appendChild(modal);

  // Event listeners - usar event delegation
  const closeBtn = modal.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    } else if (e.target.classList.contains('edit-btn')) {
      const item = e.target.closest('.edit-modal-item');
      const itemId = item.dataset.id;
      const isCustom = item.dataset.isCustom === 'true';
      const banner = document.querySelector(`[data-sheet-id="${itemId}"]`);
      
      if (banner) {
        const sheet = {
          id: itemId,
          name: banner.querySelector('h2')?.textContent || 'Sem nome',
          link: banner.href || '',
          image: banner.style.backgroundImage || '',
          category: banner.closest('section')?.id || 'planilhas',
          isOriginal: !isCustom
        };
        showEditForm(sheet, modal);
      }
    }
  });
}

function showEditForm(sheet, parentModal) {
  // Remover modal anterior
  const oldForm = document.getElementById('edit-form-modal');
  if (oldForm) oldForm.remove();

  const formModal = document.createElement('div');
  formModal.className = 'edit-form-modal-overlay';
  formModal.id = 'edit-form-modal';
  
  formModal.innerHTML = `
    <div class="edit-form-modal-content">
      <div class="edit-form-header">
        <h2>Editando: ${sheet.name}</h2>
        <button class="close-form" aria-label="Fechar">&times;</button>
      </div>
      <form id="edit-form" class="edit-form">
        <div class="form-group">
          <label for="edit-sheet-name">Nome:</label>
          <input type="text" id="edit-sheet-name" value="${sheet.name}" required>
        </div>
        <div class="form-group">
          <label for="edit-sheet-link">URL:</label>
          <input type="url" id="edit-sheet-link" value="${sheet.link}" required>
        </div>
        <div class="form-group">
          <label for="edit-sheet-category">Categoria:</label>
          <select id="edit-sheet-category" required>
            <option value="assistencial" ${sheet.category === 'assistencial' ? 'selected' : ''}>Assistencial</option>
            <option value="rh" ${sheet.category === 'rh' ? 'selected' : ''}>Recursos Humanos (RH)</option>
            <option value="planilhas" ${sheet.category === 'planilhas' ? 'selected' : ''}>Planilhas Compartilhadas</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-save">Salvar</button>
          <button type="button" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(formModal);

  formModal.querySelector('.close-form').addEventListener('click', () => {
    formModal.remove();
  });

  formModal.querySelector('.btn-cancel').addEventListener('click', () => {
    formModal.remove();
  });

  formModal.addEventListener('click', (e) => {
    if (e.target === formModal) {
      formModal.remove();
    }
  });

  formModal.querySelector('#edit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newName = document.getElementById('edit-sheet-name').value.trim();
    const newLink = document.getElementById('edit-sheet-link').value.trim();
    const newCategory = document.getElementById('edit-sheet-category').value.trim();

    if (!newName || !newLink || !newCategory) {
      showToast('Preencha todos os campos', 'error');
      return;
    }

    if (!isValidURL(newLink)) {
      showToast('URL inválida', 'error');
      return;
    }

    // Atualizar DOM
    const banner = document.querySelector(`[data-sheet-id="${sheet.id}"]`);
    if (banner) {
      banner.href = newLink;
      banner.querySelector('h2').textContent = newName;
      
      // Se mudou de categoria, mover para a nova seção
      const sectionMap = {
        'assistencial': 'assistencial',
        'rh': 'rh',
        'planilhas': 'planilhas'
      };
      const newSectionId = sectionMap[newCategory] || 'planilhas';
      const newSection = document.getElementById(newSectionId);
      
      if (newSection && banner.parentElement.id !== newSectionId) {
        newSection.appendChild(banner);
      }
    }

    // Se for customizado, atualizar localStorage com dados da planilha
    if (!sheet.isOriginal) {
      let customSheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
      const sheetIndex = customSheets.findIndex(s => s.id === sheet.id);
      
      if (sheetIndex !== -1) {
        customSheets[sheetIndex].name = newName;
        customSheets[sheetIndex].link = newLink;
        customSheets[sheetIndex].category = newCategory;
        localStorage.setItem(STORAGE_KEY_SHEETS, JSON.stringify(customSheets));
      }
    } else {
      // Para planilhas originais, apenas salvar a categoria alterada
      let originalCategories = JSON.parse(localStorage.getItem(STORAGE_KEY_ORIGINAL_CATEGORIES) || '{}');
      originalCategories[sheet.id] = newCategory;
      localStorage.setItem(STORAGE_KEY_ORIGINAL_CATEGORIES, JSON.stringify(originalCategories));
    }

    showToast('✅ Planilha atualizada com sucesso!', 'success');
    formModal.remove();
    parentModal.remove();
    
    // Recarregar página para atualizar
    setTimeout(() => location.reload(), 1500);
  });
}

function openDeleteModal() {
  // Listar TODOS os banners (originais + customizados)
  const allBanners = document.querySelectorAll('.banner');
  const customSheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
  
  if (allBanners.length === 0) {
    showToast('Nenhuma planilha para deletar', 'info');
    return;
  }

  // Criar modal de seleção
  const modal = document.createElement('div');
  modal.className = 'delete-modal-overlay';
  modal.id = 'delete-modal-overlay';
  modal.setAttribute('aria-hidden', 'false');
  
  let content = `
    <div class="delete-modal-content">
      <div class="delete-modal-header">
        <h2>Deletar Planilha</h2>
        <button class="close-modal" aria-label="Fechar">&times;</button>
      </div>
      <div class="delete-modal-list">
  `;

  allBanners.forEach(banner => {
    const sheetId = banner.getAttribute('data-sheet-id');
    const sheetName = banner.querySelector('h2')?.textContent || 'Sem nome';
    const isCustom = customSheets.some(s => s.id === sheetId);
    const typeLabel = isCustom ? '(Customizada)' : '(Original)';
    
    content += `
      <div class="delete-modal-item" data-id="${sheetId || 'default-' + sheetName}" data-is-custom="${isCustom}">
        <div class="delete-item-info">
          <h3>${sheetName}</h3>
          <p>${typeLabel}</p>
        </div>
        <button class="delete-btn" aria-label="Deletar ${sheetName}">Deletar</button>
      </div>
    `;
  });

  content += `
      </div>
    </div>
  `;

  modal.innerHTML = content;
  document.body.appendChild(modal);

  // Event listeners - usar event delegation
  const closeBtn = modal.querySelector('.close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    } else if (e.target.classList.contains('delete-btn')) {
      const item = e.target.closest('.delete-modal-item');
      const itemId = item.dataset.id;
      const isCustom = item.dataset.isCustom === 'true';
      const sheetName = item.querySelector('h3').textContent;
      
      // Nota: confirm() é síncrono e bloqueante, mas funcional para este caso.
      // Futuramente, substituir por modal customizado para melhor UX.
      if (confirm(`Tem certeza que quer deletar "${sheetName}"?`)) {
        if (isCustom) {
          // Deletar do localStorage
          let customSheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
          customSheets = customSheets.filter(s => s.id !== itemId);
          localStorage.setItem(STORAGE_KEY_SHEETS, JSON.stringify(customSheets));
        }

        // Remover do DOM
        const banner = document.querySelector(`[data-sheet-id="${itemId}"]`);
        if (banner) {
          banner.remove();
        }

        showToast('✅ Planilha deletada com sucesso!', 'success');
        item.remove();
        
        // Se não há mais planilhas, fechar o modal
        const remainingItems = modal.querySelectorAll('.delete-modal-item');
        if (remainingItems.length === 0) {
          setTimeout(() => modal.remove(), 1500);
        }
      }
    }
  });
}
