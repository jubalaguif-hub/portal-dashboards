./dashboards.json')
  .then(res => res.json())
  .then(data => {
    console.log('JSON carregado:', data);
  })
  .catch(err => {
    document.body.innerHTML = '<h2>Erro ao carregar dashboards.json</h2>';
    console.error(err);
  });
