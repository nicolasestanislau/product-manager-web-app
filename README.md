# Aplicação de Gerenciamento de Produtos

Esta é uma aplicação front-end desenvolvida em ReactJS que permite o gerenciamento de produtos, incluindo operações de CRUD (Create, Read, Update, Delete) e autenticação de usuários. O projeto utiliza Tailwind CSS para estilização e segue boas práticas de UI/UX.

## Funcionalidades

- **Autenticação de Usuário**: Login e cadastro de usuários utilizando CPF/CNPJ, nome, e-mail, senha e número de celular.
- **CRUD de Produtos**: Criação, leitura, atualização e exclusão de produtos.
- **Interface Responsiva**: Estilizada com Tailwind CSS para garantir uma boa experiência em diferentes dispositivos.
- **Validações de Entrada**: Validações para CPF/CNPJ e telefone com máscaras de entrada.

## Tecnologias Utilizadas

- **ReactJS**: Biblioteca JavaScript para construir interfaces de usuário.
- **React Router**: Biblioteca para navegação entre páginas no React.
- **Axios**: Cliente HTTP para realizar requisições à API.
- **Tailwind CSS**: Framework CSS para estilização rápida e responsiva.
- **React Text Mask**: Biblioteca para aplicar máscaras de entrada em campos de texto.

## Configuração do Projeto

### Pré-requisitos

- Node.js instalado na máquina (versão 14 ou superior).
- NPM (Node Package Manager) ou Yarn.

### Passos para Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/seu-usuario/nome-do-repositorio.git
   cd nome-do-repositorio
   ```

2. **Instale as dependências**

   ```bash
   npm install
    ```
   
   ou, se estiver usando Yarn:
      ```bash
   yarn install
    ```

3. **Configuração**

   ```javascript
   const config = {
    apiBaseUrl: 'https://sua-api.com.br/api'
   };
   export default config;
   ```

4. **Execute a aplicação**

      ```bash
   npm start
   ```
   ou, se estiver usando Yarn:
   ```bash
   npm start
   ```
   A aplicação estará disponível em http://localhost:3000.


### Estrutura de Pastas

   ```bash
   src/
├── pages/
│   ├── Login.jsx
│   ├── NewProduct.jsx
│   ├── EditProduct.jsx
│   ├── Products.jsx
│   └── ... outros componentes
├── config.js
├── App.js
├── index.js
└── index.css
   ```
