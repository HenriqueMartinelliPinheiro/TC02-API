# TC02-API

Repositório para uma API para gerenciamento e registro de frequência em eventos do IFC Videira.

## Guia de Execução da API

### Pré-requisitos

1. **Node.js**: Instale a versão mais recente do [Node.js](https://nodejs.org/).
2. **npm**: npm vem com o Node.js, então ao instalar o Node, você terá o npm disponível.
3. **PostgreSQL**: Instale e configure o PostgreSQL, e crie um banco de dados para a aplicação.

### Passo a Passo

#### 1. Clone o Repositório

4. No terminal, clone o repositório da aplicação:

```bash
git clone <link-do-repositorio>
```

5. Navegue até a pasta do projeto e instale as dependências utilizando npm:

```bash
cd <nome-do-projeto>
npm install
```

6. Na raiz do projeto, crie um arquivo .env. Esse arquivo contém as variáveis de ambiente necessárias para a aplicação funcionar. Aqui está um exemplo do conteúdo que ele deve ter:

```bash
# Conexão com o banco de dados PostgreSQL
DATABASE_URL="postgresql://<usuário>:<senha>@localhost:5432/<nome_do_banco>?schema=public"

# Token de Acesso JWT
JWT_ACCESS_SECRET="<chave_secreta_do_jwt>"
JWT_ACCESS_TOKEN_EXPIRES="1h"
```

7. Gere o Cliente Prisma e Execute as Migrações do Prisma

```bash
npx prisma generate

npx prisma migrate dev --name init
```
8. Inicie a API

```bash
npm run dev
```
