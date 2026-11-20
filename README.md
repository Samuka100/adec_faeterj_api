# ADEC FAETERJ API

API REST desenvolvida como parte do projeto acadêmico da disciplina **Abordagem DevOps e Entregas Contínuas**, do curso de Análise e Desenvolvimento de Sistemas da FAETERJ.

O projeto tem como objetivo aplicar conceitos de desenvolvimento, testes automatizados, integração contínua (CI) e entrega contínua (CD).

## Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| Node.js 22 | Ambiente de execução |
| TypeScript | Linguagem de desenvolvimento |
| Express 5 | Construção da API REST |
| MongoDB | Banco de dados |
| Mongoose | Integração com MongoDB |
| Vitest | Testes automatizados |
| Supertest | Testes HTTP |
| Docker | Containerização |
| GitHub Actions | Automação da pipeline CI/CD |
| Render | Hospedagem e deploy |

## Funcionalidades da API

A aplicação disponibiliza endpoints para monitoramento e gerenciamento de usuários.

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/health` | Verifica a disponibilidade da API |
| GET | `/users` | Consulta os usuários cadastrados |
| POST | `/users` | Cadastra um novo usuário |

### Exemplo de requisição

`POST /users`

```json
{
  "name": "João",
  "password": "senha123"
}
```

## Configuração do ambiente

### Pré-requisitos

- Node.js 22 ou superior, compatível com a versão utilizada no projeto.
- npm.
- Instância MongoDB acessível pela aplicação.
- Docker (opcional, para execução em containers).

### Instalação

Clone o repositório:

```bash
git clone https://github.com/Samuka100/adec_faeterj_api.git
```

Acesse a pasta:

```bash
cd adec_faeterj_api
```

Instale as dependências:

```bash
npm ci
```

Configure as variáveis de ambiente copiando `.env.example` para `.env`.

No Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

No Linux:

```bash
cp .env.example .env
```

Configure:

```env
CONNECTSTRING=sua_connection_string
DB_NAME=nome_do_banco
PORT=8080
```

### Executar em desenvolvimento

```bash
npm run dev
```

A API estará disponível em:

`http://localhost:8080`

### Build e testes

Executar os testes:

```bash
npm test
```

Compilar o TypeScript:

```bash
npm run build
```

Executar a aplicação compilada:

```bash
npm start
```

## Docker

O projeto possui um Dockerfile multi-stage, com estágios destinados ao desenvolvimento, compilação e execução em produção.

Construir a imagem:

```bash
docker build -f dockerfile -t adec-faeterj-api .
```

Executar o container:

```bash
docker run --rm --name adec-faeterj-api --env-file .env -p 8080:8080 adec-faeterj-api
```

## Pipeline CI/CD

A automação é realizada pelo GitHub Actions, por meio do arquivo:

`.github/workflows/ci-cd.yml`

O pipeline possui dois gatilhos principais:

**Pull Request para a branch `main`:**

1. Checkout do repositório.
2. Configuração do Node.js.
3. Instalação das dependências.
4. Build da aplicação.
5. Execução dos testes automatizados.

**Push na branch `main`:**

1. Executa novamente o build e os testes.
2. Após a aprovação, executa o job de deploy.
3. Aciona o Deploy Hook do Render.

A URL do Deploy Hook deve ser armazenada nos Secrets do GitHub com o nome:

`RENDER_DEPLOY_HOOK_URL`

## Objetivo acadêmico

Demonstrar, na prática, como automatizar a validação e a entrega de uma aplicação utilizando GitHub Actions, garantindo que alterações passem pelo processo de build e testes antes de serem disponibilizadas.

## Status

Projeto em desenvolvimento.