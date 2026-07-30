document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('filmes-grid');
    const loader = document.getElementById('loader');

    try {
        const response = await fetch('/api/filmes');
        const filmes = await response.json();

        loader.style.display = 'none';

        if (filmes.length === 0) {
            grid.innerHTML = '<p>Nenhum filme em cartaz no momento.</p>';
            return;
        }

        filmes.forEach(filme => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${filme.imagem}" alt="${filme.titulo}" class="card-img">
                <div class="card-content">
                    <h3 class="card-title">${filme.titulo}</h3>
                    <p class="card-info"><strong>Gênero:</strong> ${filme.genero}</p>
                    <p class="card-info"><strong>Duração:</strong> ${filme.duracao} | <strong>Classificação:</strong> ${filme.classificacao}</p>
                    <p class="card-info"><strong>Horário:</strong> ${filme.horario}</p>
                    <p class="card-sinopse">${filme.sinopse}</p>
                    <p class="card-price">R$ ${filme.preco.toFixed(2).replace('.', ',')}</p>
                    <a href="compra.html?id=${filme.id}" class="btn">Comprar Ingresso</a>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        loader.style.display = 'none';
        grid.innerHTML = '<p>Erro ao carregar os filmes. Tente novamente mais tarde.</p>';
        console.error('Erro:', error);
    }
});
