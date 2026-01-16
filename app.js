let allDashboards = [];

fetch('./dashboards.json')
  .then(res => res.json())
  .then(data => {
    allDashboards = data;
    criarFiltros(data);
    renderizarCards(data);
  });

function criarFiltros(dashboards) {
  const filtros = document.querySelector('.filters');
  const categorias = [...new Set(dashboards.map(d => d.categoria))];

  categorias.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.dataset.cat = cat;

    btn.onclick = () => {
      document.querySelectorAll('.filters button')
        .forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filtrados = allDashboards.filter(d => d.categoria === cat);
      renderizarCards(filtrados);
    };

    filtros.appendChild(btn);
  });

  filtros.querySelector('button[data-cat="Todas"]').onclick = () => {
    document.querySelectorAll('.filters button')
      .forEach(b => b.classList.remove('active'));
    filtros.querySelector('button[data-cat="Todas"]').classList.add('active');
    renderizarCards(allDashboards);
  };
}

function renderizarCards(lista) {
  const container = document.getElementById('cards');
  container.innerHTML = '';

  lista.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
  <h2>${item.titulo}</h2>
  <p>${item.descricao}</p>
  <small>Painéis: ${item.paineis.join(', ')}</small>
  <span class="tag">${item.categoria}</span>
  <a href="#" onclick="abrirModal('${item.iframe}')">Acessar</a>
`;

    container.appendChild(card);
  });
}
