const CompraModel = require('../models/compraModel');
const AssentoModel = require('../models/assentoModel');
const emailService = require('../services/emailService');

// Funções auxiliares de validação
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validarCPF(cpf) {
    if (!cpf) return false;
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    // Elimina CPFs invalidos conhecidos (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    return true;
}

exports.realizarCompra = async (req, res) => {
    let { filme_id, assento, nome, cpf, email, tipo, valor } = req.body;

    // Validação de campos vazios
    if (!filme_id || !assento || !nome || !cpf || !email || !tipo || valor === undefined || valor === null) {
        return res.status(400).json({ erro: 'Todos os campos são de preenchimento obrigatório.' });
    }

    const filmeIdInt = parseInt(filme_id, 10);
    if (isNaN(filmeIdInt)) {
        return res.status(400).json({ erro: 'ID do filme inválido.' });
    }

    // Validação de E-mail
    if (!validarEmail(email)) {
        return res.status(400).json({ erro: 'Por favor, informe um endereço de e-mail válido.' });
    }

    // Validação de CPF
    if (!validarCPF(cpf)) {
        return res.status(400).json({ erro: 'Por favor, informe um CPF válido com 11 dígitos.' });
    }

    try {
        // Verificar se assento está disponível
        const disponivel = await AssentoModel.verificarDisponibilidade(filmeIdInt, assento);
        if (!disponivel) {
            return res.status(400).json({ erro: 'Este assento já foi vendido ou está indisponível.' });
        }

        // Registrar cliente
        const clienteId = await CompraModel.registrarCliente(nome, cpf, email);

        // Ocupar assento
        await AssentoModel.ocuparAssento(filmeIdInt, assento);

        // Registrar compra
        const dataCompra = new Date().toLocaleString('pt-BR');
        const compraId = await CompraModel.registrarCompra(
            clienteId, 
            filmeIdInt, 
            assento, 
            tipo, 
            parseFloat(valor), 
            dataCompra, 
            'Aprovado'
        );

        // Buscar comprovante para envio de e-mail
        const comprovante = await CompraModel.getComprovante(compraId);
        
        // Enviar E-mail de forma assíncrona (com log de erros amigável)
        emailService.enviarComprovante(comprovante).catch(err => {
            console.error("⚠️ [COMPRA] Falha ao enviar o comprovante por e-mail:", err.message);
        });

        res.status(201).json({ 
            mensagem: 'Compra realizada com sucesso!', 
            compra_id: compraId 
        });

    } catch (error) {
        console.error("❌ [COMPRA] Erro no servidor:", error);
        res.status(500).json({ erro: 'Erro interno ao realizar a compra. Tente novamente.' });
    }
};

exports.getComprovante = async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ erro: 'ID de comprovante inválido.' });
    }

    try {
        const comprovante = await CompraModel.getComprovante(id);
        if (comprovante) {
            res.json(comprovante);
        } else {
            res.status(404).json({ erro: 'Comprovante não encontrado.' });
        }
    } catch (error) {
        console.error("❌ [COMPROVANTE] Erro ao buscar comprovante:", error);
        res.status(500).json({ erro: 'Erro ao buscar comprovante.' });
    }
};
