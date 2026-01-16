let allDashboards = [];

fetch('./dashboards.json')
  .then(res => res.json())
  .then(data => {
    allDashboards = data;
    criarFiltros(data);
    renderizarCards(data);
  })
  .catch(err => {
    console.error(err);
  });

function criarFiltros(dashboards) {
  const filtros = document.querySelector('.filters');
  filtros.innerHTML = '<button data-cat="Todas" class="active">Todas</button>';

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

  filtros.querySelector('[data-cat="Todas"]').onclick = () => {
    document
