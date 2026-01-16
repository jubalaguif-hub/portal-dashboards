document.addEventListener('DOMContentLoaded', () => {
  let allDashboards = [];

  fetch('./dashboards.json')
    .then(res => res.json())
    .then(data => {
      allDashboards = data;
      criarFiltros(data);
      renderizarCards(data);
    })
    .catch(err => {
      console.error('Erro ao carregar JSON:', err);
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

        renderizarCards(allDashboards.filter(d => d.categoria === cat));
      };

      filtros.appendChild(btn);
    });

    filtros.querySelector('[data-cat="Todas"]').onclick = () => {
      document.querySelectorAll('.filters button')
        .forEach(b => b.classList.remove('active'));
      filtros.querySelector('[data-cat="Todas"]').classList.add('active');
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
        <span class="tag">${item.categoria}</span>
        <div class="panel-buttons">
          ${item.paineis.map(p =>
            `<button onclick="abrirModal('${p.iframe}')">${p.nome}</button>`
          ).join('')}
        </div>
      `;

      container.appendChild(card);
    });
  }

  window.abrirModal = function (url) {
    document.getElementById('iframeDashboard').src = url;
    document.getElementById('modal').style.display = 'flex';
  };

  window.fecharModal = function () {
    document.getElementById('iframeDashboard').src = '';
    document.getElementById('modal').style.display = 'none';
  };
});
