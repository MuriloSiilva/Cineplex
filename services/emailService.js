const nodemailer = require('nodemailer');

exports.enviarComprovante = async (dadosCompra) => {
    const user = process.env.GMAIL_USER;
    const pass = process.env.GMAIL_PASS;

    if (!user || !pass || user === 'seu.email@gmail.com' || pass === 'sua_senha_de_app') {
        console.warn('⚠️  [EMAIL] GMAIL_USER ou GMAIL_PASS não configurados no arquivo .env.');
        console.warn('⚠️  [EMAIL] Para receber os comprovantes no e-mail, preencha o arquivo .env na raiz do projeto.');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a2e; color: #fff; padding: 20px; border-radius: 10px;">
            <div style="text-align: center; border-bottom: 2px solid #e50914; padding-bottom: 10px; margin-bottom: 20px;">
                <h1 style="color: #e50914; margin: 0;">Cinema Online</h1>
                <h2>Comprovante de Compra</h2>
            </div>
            
            <div style="background-color: #16213e; padding: 15px; border-radius: 5px;">
                <p><strong>Cliente:</strong> ${dadosCompra.cliente_nome}</p>
                <p><strong>Filme:</strong> ${dadosCompra.filme_titulo}</p>
                <p><strong>Horário:</strong> ${dadosCompra.filme_horario}</p>
                <p><strong>Assento:</strong> ${dadosCompra.assento}</p>
                <p><strong>Tipo:</strong> ${dadosCompra.tipo}</p>
                <p><strong>Valor:</strong> R$ ${dadosCompra.valor.toFixed(2).replace('.', ',')}</p>
                <p><strong>Data da Compra:</strong> ${dadosCompra.data}</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <p style="color: #66fcf1; font-size: 14px;">Obrigado pela preferência.</p>
            </div>
        </div>
    `;

    const mailOptions = {
        from: `"Cinema Online" <${user}>`,
        to: dadosCompra.cliente_email,
        subject: 'Comprovante de Compra - Cinema',
        html: htmlContent
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ [EMAIL] Comprovante enviado com sucesso para ${dadosCompra.cliente_email} (ID: ${info.messageId})`);
        return info;
    } catch (err) {
        console.error('❌ [EMAIL] Erro ao enviar e-mail:', err.message);
        throw err;
    }
};
