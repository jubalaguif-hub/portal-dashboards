// ============================================================================
// PORTAL DASHBOARDS - SCRIPT CORRIGIDO
// ============================================================================

const STORAGE_KEY_SECTION = 'lastActiveSection';
const STORAGE_KEY_THEME = 'preferredTheme';
const STORAGE_KEY_SHEETS = 'customSheets'; // AQUI É ONDE OS DADOS FICAM PRESOS NO PC LOCAL
const DEFAULT_CATEGORIES = ['assistencial', 'rh', 'planilhas'];

// -------- CARREGAMENTO IMEDIATO DO TEMA --------
(function() {
  const savedTheme = localStorage.getItem(STORAGE_KEY_THEME) || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  setupEventListeners();
  loadThemePreference();
  loadLastSection();
  loadCustomSheets(); // Esta função será a que você conectará ao Banco de Dados futuramente
  setupMenuAnimations();
  setupNestedMenus();
  console.log('✅ App HOB inicializado');
}

// ============================================================================
// NAVEGAÇÃO E FILTROS
// ============================================================================

function showSection(id, element) {
  const section = document.getElementById(id);
  if (!section) return;
  
  // Esconde todas as seções
  document.querySelectorAll('.section').forEach(sec => {
    sec.classList.remove('active');
    sec.style.display = 'none'; // Garante que não ocupem espaço
  });

  // Mostra a seção correta em modo GRID
  section.classList.add('active');
  section.style.display = 'grid'; 

  // Atualiza estado visual do menu
  document.querySelectorAll('.submenu a').forEach(a => a.classList.remove('active'));
  if (element) element.classList.add('active');

  localStorage.setItem(STORAGE_KEY_SECTION, id);
}

// ============================================================================
// LÓGICA DE PERSISTÊNCIA (O que faz o site "resetar")
// ============================================================================

function saveCustomSheet(sheet) {
  // ATENÇÃO: O código abaixo salva apenas no SEU computador.
  // Para salvar para todos, aqui você faria um: fetch('SUA_API_DO_SUPABASE', { method: 'POST' ... })
  let sheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
  sheets.push(sheet);
  localStorage.setItem(STORAGE_KEY_SHEETS, JSON.stringify(sheets));
}

function loadCustomSheets() {
  // ATENÇÃO: O código abaixo lê apenas do SEU computador.
  // Para ler de todos, aqui você faria um: fetch('SUA_API_DO_SUPABASE').then(...)
  const sheets = JSON.parse(localStorage.getItem(STORAGE_KEY_SHEETS) || '[]');
  
  sheets.forEach(sheet => {
    // Só adiciona se a categoria existir para evitar o erro de aparecer em tudo
    const targetSection = document.getElementById(sheet.category);
    if (targetSection) {
      addSheetToDOM(sheet);
    }
  });
}

function addSheetToDOM(sheet) {
  const section = document.getElementById(sheet.category);
  if (!section) return;

  const banner = document.createElement('a');
  banner.href = sheet.link;
  banner.target = '_blank';
  banner.className = 'banner'; // Agora usa o estilo de grade do CSS
  banner.style.backgroundImage = `url('${sheet.image}')`;
  banner.setAttribute('data-sheet-id', sheet.id);
  banner.innerHTML = `<div class="banner-text"><h2>${sheet.name}</h2></div>`;

  section.appendChild(banner);
}

// ============================================================================
// COMPORTAMENTO DO TEMA E MENU (Mantidos do seu original)
// ============================================================================

function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'dark';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem(STORAGE_KEY_THEME, newTheme);
  
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.innerHTML = newTheme === 'dark' 
      ? '<img src="./img/icon/sol.png" style="width: 32px;">' 
      : '<img src="./img/icon/lua.png" style="width: 32px;">';
  }
}

// Restante das suas funções de animação e busca permanecem as mesmas...
// (setupMenuAnimations, toggleMenu, toggleMenuConfig, setupNestedMenus...)
