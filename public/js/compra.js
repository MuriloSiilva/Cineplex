document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filmeId = urlParams.get('id');

    if (!filmeId) {
        window.location.href = 'filmes.html';
        return;
    }

    let filmeSelecionado = null;
    let assentoSelecionado = null;

    const loader = document.getElementById('loader');
    const container = document.getElementById('compra-container');
    const tipoSelect = document.getElementById('tipo');

    // Função de Cálculo de Valores
    function atualizarValores() {
        if (!filmeSelecionado) return;

        const precoOriginal = filmeSelecionado.preco;
        const tipo = tipoSelect.value;
        let desconto = 0;
        let valorFinal = precoOriginal;

        if (tipo === 'Estudante') {
            desconto = precoOriginal * 0.5;
            valorFinal = precoOriginal - desconto;
        }

        document.getElementById('preco-original').textContent = `R$ ${precoOriginal.toFixed(2).replace('.', ',')}`;
        document.getElementById('desconto').textContent = `R$ ${desconto.toFixed(2).replace('.', ',')}`;
        document.getElementById('valor-final').textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;
    }

    tipoSelect.addEventListener('change', atualizarValores);

    try {
        // Carregar detalhes do filme
        const resFilme = await fetch(`/api/filmes/${filmeId}`);
        if (!resFilme.ok) {
            throw new Error('Filme não encontrado ou removido.');
        }
        filmeSelecionado = await resFilme.json();

        // Renderizar detalhes na lateral
        document.getElementById('detalhes-filme').innerHTML = `
            <img src="${filmeSelecionado.imagem}" alt="${filmeSelecionado.titulo}">
            <h3>${filmeSelecionado.titulo}</h3>
            <p>${filmeSelecionado.genero}</p>
            <p><strong>Horário:</strong> ${filmeSelecionado.horario}</p>
            <p style="margin-top: 10px; color: var(--color-gold); font-weight: bold; font-size: 1.2rem;">
                R$ ${filmeSelecionado.preco.toFixed(2).replace('.', ',')}
            </p>
        `;

        // Carregar assentos
        const resAssentos = await fetch(`/api/assentos/${filmeId}`);
        if (!resAssentos.ok) {
            throw new Error('Erro ao carregar assentos do filme.');
        }
        const assentos = await resAssentos.json();

        const gridAssentos = document.getElementById('grid-assentos');
        gridAssentos.innerHTML = '';
        
        // Agrupar por fileira para desenhar o grid
        const fileiras = {};
        assentos.forEach(a => {
            const letra = a.codigo.charAt(0);
            if (!fileiras[letra]) fileiras[letra] = [];
            fileiras[letra].push(a);
        });

        Object.keys(fileiras).sort().forEach(letra => {
            const row = document.createElement('div');
            row.className = 'fileira';
            fileiras[letra].sort((a,b) => a.codigo.localeCompare(b.codigo)).forEach(a => {
                const btn = document.createElement('div');
                btn.className = `assento ${a.ocupado ? 'ocupado' : 'disponivel'}`;
                btn.textContent = a.codigo;
                
                if (!a.ocupado) {
                    btn.addEventListener('click', () => selecionarAssento(btn, a.codigo));
                }
                
                row.appendChild(btn);
            });
            gridAssentos.appendChild(row);
        });

        loader.style.display = 'none';
        container.style.display = 'grid';

        atualizarValores(); // Inicializa os valores

    } catch (error) {
        console.error("Erro na página de compra:", error);
        alert(error.message || 'Erro ao carregar os dados. Tente novamente.');
        window.location.href = 'filmes.html';
    }

    function selecionarAssento(element, codigo) {
        // Remove a seleção anterior
        document.querySelectorAll('.assento.selecionado').forEach(el => el.classList.remove('selecionado'));
        
        // Adiciona a nova seleção
        element.classList.add('selecionado');
        assentoSelecionado = codigo;
    }

    // Formatar CPF em tempo real
    const cpfInput = document.getElementById('cpf');
    cpfInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);
        if (val.length > 9) val = val.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        else if (val.length > 6) val = val.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
        else if (val.length > 3) val = val.replace(/(\d{3})(\d{3})/, "$1.$2");
        e.target.value = val;
    });

    // Revisar e Comprar (Abrir Modal)
    const btnRevisar = document.getElementById('btn-revisar');
    btnRevisar.addEventListener('click', () => {
        const nome = document.getElementById('nome').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const email = document.getElementById('email').value.trim();
        const tipo = tipoSelect.value;

        if (!assentoSelecionado) {
            alert('Por favor, selecione um assento.');
            return;
        }

        if (!nome || !cpf || !email) {
            alert('Por favor, preencha todos os dados.');
            return;
        }

        if (cpf.length < 14) {
            alert('Por favor, informe um CPF válido no formato 000.000.000-00.');
            return;
        }

        // Preencher modal
        const valorFinal = (tipo === 'Estudante') ? filmeSelecionado.preco * 0.5 : filmeSelecionado.preco;
        
        document.getElementById('modal-filme').textContent = filmeSelecionado.titulo;
        document.getElementById('modal-horario').textContent = filmeSelecionado.horario;
        document.getElementById('modal-assento').textContent = assentoSelecionado;
        document.getElementById('modal-nome').textContent = nome;
        document.getElementById('modal-tipo').textContent = tipo;
        document.getElementById('modal-valor').textContent = `R$ ${valorFinal.toFixed(2).replace('.', ',')}`;

        document.getElementById('modal-confirmacao').style.display = 'flex';
    });

    // Fechar Modal
    document.getElementById('btn-cancelar').addEventListener('click', () => {
        document.getElementById('modal-confirmacao').style.display = 'none';
    });

    // Confirmar Compra via API
    document.getElementById('btn-confirmar').addEventListener('click', async () => {
        const btn = document.getElementById('btn-confirmar');
        btn.disabled = true;
        btn.textContent = 'Processando...';

        const nome = document.getElementById('nome').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const email = document.getElementById('email').value.trim();
        const tipo = tipoSelect.value;
        const valorFinal = (tipo === 'Estudante') ? filmeSelecionado.preco * 0.5 : filmeSelecionado.preco;

        try {
            const response = await fetch('/api/compras', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filme_id: parseInt(filmeId, 10),
                    assento: assentoSelecionado,
                    nome,
                    cpf,
                    email,
                    tipo,
                    valor: valorFinal
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Redirecionar para o comprovante
                window.location.href = `comprovante.html?id=${data.compra_id}`;
            } else {
                alert(`Erro: ${data.erro || 'Não foi possível finalizar a compra.'}`);
                btn.disabled = false;
                btn.textContent = 'Confirmar Compra';
                document.getElementById('modal-confirmacao').style.display = 'none';
                
                if (data.erro && data.erro.includes('assento')) {
                    // Recarregar a página para atualizar os assentos ocupados
                    window.location.reload();
                }
            }

        } catch (error) {
            console.error("Erro na confirmação da compra:", error);
            alert('Erro de conexão com o servidor. Tente novamente.');
            btn.disabled = false;
            btn.textContent = 'Confirmar Compra';
        }
    });
});
