# ElevateX Prospect

Ferramenta interna de prospecção comercial inteligente da ElevateX.

## Pré-requisitos

- Node.js 18+
- npm

## Setup rápido

```bash
# 1. Instalar dependências da raiz
npm install

# 2. Configurar variáveis de ambiente
cp .env.example apps/api/.env
# Edite apps/api/.env com sua GOOGLE_PLACES_API_KEY (opcional para modo demo)

# 3. Setup completo (instala deps, gera Prisma, cria DB, seed de usuários)
npm run setup

# 4. Rodar tudo
npm run dev
```

- **API**: http://localhost:3333
- **Frontend**: http://localhost:5173

## Usuários padrão

| Nome | Email | Senha |
|------|-------|-------|
| Vinícius | vinicius@elevatex.com | elevatex123 |
| Thiago Vasconcelos | thiago@elevatex.com | elevatex123 |
| Miguel | miguel@elevatex.com | elevatex123 |

## Scripts úteis

```bash
npm run dev          # Roda API + Frontend
npm run dev:api      # Só a API
npm run dev:web      # Só o Frontend
npm run db:studio    # Prisma Studio (visualizar banco)
npm run db:seed      # Re-seed do banco
```
