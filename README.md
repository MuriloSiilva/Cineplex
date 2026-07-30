# Sistema de Compra de Ingressos de Cinema - Cineplex

Este é um sistema completo para compra de ingressos de cinema online desenvolvido inteiramente em **Node.js, Express, SQLite3** (Back-end) e **Vanilla HTML/CSS/JS** (Front-end), sem a utilização de frameworks no client-side, priorizando performance, organização e modularização.

## 🚀 Funcionalidades

- Visualização de catálogo de filmes em cartaz.
- Detalhes dinâmicos de cada filme.
- Mapa de Assentos com seleção interativa e bloqueio em tempo real de assentos vendidos.
- Cálculo automático de preços (Inteira vs. Estudante).
- Validação de CPF (com formatação automática em tempo real).
- Persistência em banco de dados leve (`SQLite3`).
- Geração de Comprovante de Compra na tela.
- Envio do Comprovante de Compra por E-mail (via `Nodemailer`).

## 🛠️ Tecnologias Utilizadas

- **Front-end**: HTML5, CSS3, JavaScript ES6+ (Fetch API, Async/Await)
- **Back-end**: Node.js, Express.js
- **Banco de Dados**: SQLite3
- **Outras Libs**: Nodemailer (E-mail), CORS, Body-parser

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/en/download/) instalado na máquina (versão 14+).

## ⚙️ Como Instalar e Rodar o Projeto

1. Abra o terminal na pasta raiz do projeto (`cinema`).
2. Instale as dependências executando o comando:
   ```bash
   npm install
   ```
3. (Opcional) **Como configurar o Gmail no Nodemailer**:
   - Para que o envio de e-mail funcione, acesse o arquivo `services/emailService.js`.
   - Você precisará de uma **Senha de App** do Google.
   - Vá em "Gerenciar sua Conta do Google" -> "Segurança" -> "Verificação em duas etapas" -> "Senhas de app".
   - Gere uma senha e coloque no arquivo `emailService.js` junto do seu e-mail.
   - Caso você pule esta etapa, a compra continuará funcionando e o sistema informará no terminal que o e-mail não pôde ser enviado, mas você verá o comprovante na tela normalmente.

4. Inicie o servidor:
   ```bash
   npm start
   ```
   *Na primeira vez que for rodado, o banco de dados `database.db` será criado automaticamente na pasta anterior (conforme definido nas regras) e alimentado com os 5 filmes e os assentos padrões (A1 a E5).*

5. Acesse o sistema pelo navegador:
   ```
   http://localhost:3000
   ```

## 🎮 Como Utilizar o Sistema

1. **Página Inicial**: Veja o banner principal e os filmes em cartaz. Clique em "Comprar Ingresso" em um filme.
2. **Seleção de Assentos**: No formulário de compra, observe os assentos disponíveis (verdes). Clique em um assento para selecioná-lo (ficará azul). Assentos vermelhos já foram comprados.
3. **Dados do Cliente**: Preencha seu Nome, CPF e E-mail.
4. **Tipo de Ingresso**: Selecione "Inteira" ou "Estudante". O valor no "Resumo de Valores" atualizará na hora, calculando o desconto automaticamente.
5. **Finalizar**: Clique em "Revisar e Comprar", veja o modal de resumo, confira se os dados estão corretos e clique em "Confirmar Compra".
6. **Comprovante**: Você será redirecionado para a tela de comprovante. O sistema fará um *insert* na tabela `Compras`, fará um *update* na tabela `Assentos` para ocupado e enviará o e-mail.

## 🗂️ Estrutura do Projeto

O projeto foi organizado de forma escalável e seguindo os padrões MVC (Model-View-Controller) simplificados no backend.

```
cinema/
│
├── server.js               # Entrypoint do backend
├── package.json            # Dependências
├── database.db             # Banco gerado (ficará um nível acima)
│
├── database/
│     └── database.js       # Configuração e seeders do banco
│
├── routes/
│     ├── filmes.js         # Rotas da API de filmes
│     ├── compras.js        # Rotas da API de compras/comprovante
│     └── assentos.js       # Rotas da API de assentos
│
├── controllers/
│     ├── filmesController.js  # Lógica de negócio de filmes
│     └── comprasController.js # Lógica de negócio de compras
│
├── models/
│     ├── filmeModel.js     # Interação BD - Filmes
│     ├── compraModel.js    # Interação BD - Compras
│     └── assentoModel.js   # Interação BD - Assentos
│
├── services/
│     └── emailService.js   # Serviço utilitário do Nodemailer
│
└── public/                 # FRONTEND estático
      ├── index.html
      ├── filmes.html
      ├── compra.html
      ├── comprovante.html
      ├── css/
      │     └── style.css
      └── js/
            ├── script.js
            ├── filmes.js
            └── compra.js
```
