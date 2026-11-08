# Publicar no Hostinger Premium

Esta versão adicional é uma SPA estática. Não precisa de Node.js em produção.
O modo original Lovable permanece disponível; use os comandos com `:premium` para esta versão.

## Gerar

1. Instale Node.js compatível com Vite 8 (22.12+ ou 24) no computador de build.
2. Execute `npm install` e `npm run build:premium`.
3. Envie o CONTEÚDO de `dist-premium` à pasta pública do site escolhido na Hostinger, incluindo `.htaccess` e `config.js`.
4. Não envie o código-fonte, node_modules, arquivos .env ou credenciais administrativas.

## Backend existente

Edite `config.js` na pasta publicada: informe `supabaseUrl` e `supabasePublishableKey` do backend existente no Lovable/Supabase. São dados públicos. Não use a chave service_role ou sb_secret_. Não crie outro banco sem migrar os dados.
No backend, cadastre o endereço final do site e `/admin` nas URLs de redirecionamento de autenticação. Google exige provedor configurado no Supabase; e-mail/senha permanece disponível.
As políticas RLS do backend devem continuar ativas: visitante insere pedidos; somente administradores leem e alteram. O bloqueio de rota no navegador não substitui essas políticas.

## Imagens e domínio

O ZIP original inclui referências a três imagens em `/__l5e/assets-v1/`, mas não os arquivos. Obtenha as imagens no Lovable e substitua os campos `url` em `src/assets/*.asset.json` por caminhos locais de arquivos incluídos em `public/`, depois gere novamente. Até lá, a marca tem fallback tipográfico, sem inventar uma nova logo.
Conecte o domínio/subdomínio no painel da Hostinger e no backend. Nenhuma alteração de DNS foi realizada nesta adaptação.

## Validar antes de divulgar

Abra `/`, `/auth` e `/admin` diretamente e recarregue cada página. Teste o diagnóstico, envio real de pedido, acesso do administrador e recusa para uma conta sem permissão. Verifique logotipo e versão móvel. O HTML inicial tem metadados básicos; esta versão não usa renderização no servidor.

Sem configurar o backend, a página institucional pode abrir, mas pedidos e login não funcionarão. O envio mostra falha em vez de confirmar recebimento inexistente.
