fetch('dashboards.json')
  .then(response => response.json())
  .then(dashboards => {
    const container = document.getElementById('cards');

    dashboards.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <h2>${item.titulo}</h2>
        <p>${item.descricao}</p>
        <a href="${item.url}" target="_blank">Acessar</a>
      `;

      container.appendChild(card);
    });
  });
