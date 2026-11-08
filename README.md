# Noryli Company — Site Institucional

Site institucional da Noryli Company em português (pt-BR): apresentação dos serviços, Diagnóstico Vivo, formulário de pedidos de orçamento e painel administrativo privado.

## Tecnologia

- **React 19 + TanStack Start** (aplicação full-stack com renderização no servidor)
- **Tailwind CSS v4** para estilos
- **Lovable Cloud** como backend: banco de dados PostgreSQL, autenticação e permissões
- Build com **Vite 7** (saída voltada a Cloudflare Workers)

> **Importante sobre hospedagem:** este projeto **não é um site estático**. Ele usa
> renderização no servidor e funções de backend, então precisa de um ambiente que
> execute Node.js ou Workers. Hospedagens compartilhadas comuns (só PHP/HTML) **não
> são compatíveis**.

## Como instalar e executar

Requisitos: Node.js 20+ (ou Bun).

```sh
npm install        # ou: bun install
cp .env.example .env   # preencha com os valores reais
npm run dev        # ambiente de desenvolvimento
```

## Como gerar a versão de produção

```sh
npm run build
npm run preview    # testa a versão de produção localmente
```

## Testes

```sh
npm run test       # 11 testes: diagnóstico, pedidos e rotas
```

## Hospedagem na Hostinger

A Hostinger oferece modalidades diferentes. Para este projeto:

- **Hospedagem compartilhada / site estático: NÃO compatível.** O site precisa de
  servidor Node.js em execução contínua.
- **VPS Hostinger com Node.js: compatível.** No VPS, instale Node.js 20+, clone o
  repositório, configure o `.env`, rode `npm run build` e mantenha o processo ativo
  (por exemplo com PM2). Configure o domínio e o HTTPS no painel da Hostinger.
- **Alternativa sem servidor próprio:** manter a publicação pelo Lovable (botão
  Publicar) e apenas apontar o domínio, ou usar uma plataforma compatível com
  Cloudflare Workers.

Nenhum serviço foi contratado — verifique seu plano antes de escolher.

## Banco de dados e formulários

Os dados ficam no **Lovable Cloud** (backend gerenciado, PostgreSQL):

- **Pedidos de orçamento:** tabela `leads`. Visitantes só podem **enviar** o próprio
  pedido; não leem nem alteram dados de outras pessoas.
- **Painel administrativo:** rota `/admin`, protegida por login + permissão de
  administrador. Permite acompanhar etapas (Novo pedido → Em conversa → Proposta
  enviada → Fechado / Arquivado) e marcar contatos fechados como cliente.
- **Permissões:** tabela `user_roles` + função `has_role`. A conta
  `noryli.company@gmail.com` vira administradora automaticamente ao se cadastrar.
- **Estrutura do banco:** migration em `drizzle/migrations/0000_migration.sql`
  (tabelas, permissões e políticas de acesso). Não há dados de clientes no
  repositório — apenas a estrutura.

Após a transferência, o backend Lovable Cloud precisa continuar conectado (as
variáveis do `.env` apontam para ele). Sem essas variáveis, o formulário e o painel
não funcionam.

## Configuração (.env)

Copie `.env.example` para `.env` e preencha:

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` / `SUPABASE_URL` | Endereço do backend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_PUBLISHABLE_KEY` | Chave pública (navegador) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave administrativa — **somente no servidor** |
| `LOVABLE_DB_MIGRATION_URL` | Apenas para aplicar migrações do banco |

O arquivo `.env` está no `.gitignore` e **nunca** deve ser enviado ao GitHub.

## Como atualizar o site pelo GitHub

1. Faça alterações no código e envie (`git push`) para a branch conectada.
2. O Lovable sincroniza automaticamente os commits da branch conectada.
3. Para publicar, use o botão **Publicar** no editor Lovable (ou o deploy do seu VPS).

Não reescreva o histórico publicado (sem force-push/rebase na branch conectada).

## Dependências do Lovable que permanecem

- **Lovable Cloud** (banco, autenticação, permissões) — necessário para formulário
  e painel funcionarem.
- Pacote de build `@lovable.dev/vite-tanstack-config` (dependência de
  desenvolvimento, instalada via npm).

## Pendências de configuração manual

- Conectar o repositório GitHub (botão em *Configurações do projeto → Git* no Lovable).
- Escolher e contratar a hospedagem compatível (VPS com Node.js) — **não contratado**.
- Configurar o domínio oficial e o HTTPS — **não conectado**.
- Publicar o site — **aguardando sua revisão**.
