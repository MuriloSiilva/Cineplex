document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('filmes-grid');
    const loader = document.getElementById('loader');

    try {
        const response = await fetch('/api/filmes');
        const filmes = await response.json();

        loader.style.display = 'none';

        if (filmes.length === 0) {
            grid.innerHTML = '<p style="text-align:center; color: var(--color-text-muted); grid-column: 1/-1;">Nenhum filme em cartaz no momento.</p>';
            return;
        }

        filmes.forEach((filme, i) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.animationDelay = `${i * 0.08}s`;
            card.style.animation = `fadeInUp 0.6s var(--ease-out-expo) ${i * 0.08}s both`;
            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${filme.imagem}" alt="${filme.titulo}" class="card-img" loading="lazy">
                    <div class="card-img-overlay"></div>
                    <span class="card-badge">${filme.classificacao}</span>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${filme.titulo}</h3>
                    <div class="card-meta">
                        <span class="card-meta-tag">${filme.genero}</span>
                        <span class="card-meta-tag">${filme.duracao}</span>
                        <span class="card-meta-tag">🕐 ${filme.horario}</span>
                    </div>
                    <p class="card-sinopse">${filme.sinopse}</p>
                    <div class="card-footer">
                        <div class="card-price">
                            R$ ${filme.preco.toFixed(2).replace('.', ',')}
                            <small>por ingresso</small>
                        </div>
                        <a href="compra.html?id=${filme.id}" class="btn">Comprar</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (error) {
        loader.style.display = 'none';
        grid.innerHTML = '<p style="text-align:center; color: var(--color-text-muted); grid-column: 1/-1;">Erro ao carregar os filmes. Tente novamente mais tarde.</p>';
        console.error('Erro:', error);
    }
});
