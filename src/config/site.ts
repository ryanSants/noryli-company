/**
 * Configuração central da Noryli. Edite aqui textos comerciais, contatos e preços.
 * Contatos vazios (null) nunca aparecem ao público.
 */
export const site = {
  name: "Noryli Company",
  domain: "noryli.company.com" as string | null, // informado pelo cliente; conexão pendente de revisão
  contacts: {
    whatsapp: "5561982646793" as string | null,
    whatsappLabel: "(61) 9 8264-6793",
    email: "noryli.company@gmail.com" as string | null,
    instagram: "noryli_company" as string | null,
  },
  /** Pedidos de orçamento são salvos no banco da Noryli. */
  formEndpoint: "database" as string | null,
  /** Quando true, a versão pública mostra "a partir de R$". */
  pricesApproved: true,
};

export type Price = { setup?: number; monthly?: number; optionalMaintenance?: number; onRequest?: boolean };

export type PackageId = "presenca" | "conteudo" | "operacao" | "loja";

export const packages: {
  id: PackageId;
  name: string;
  forWho: string;
  price: Price;
  billing: string;
  deliverables: string[];
  limits: string[];
  deadline: string;
  optional: string;
  cta: string;
}[] = [
  {
    id: "presenca",
    name: "Presença Profissional",
    forWho: "Para quem precisa de uma página clara para apresentar o negócio e receber contatos.",
    price: { setup: 1990, optionalMaintenance: 149 },
    billing: "por projeto",
    deliverables: [
      "Landing page de até 6 seções",
      "Texto de até 800 palavras baseado no briefing",
      "Logo tipográfico simples",
      "3 templates",
      "Layout responsivo",
      "2 rodadas de revisão",
    ],
    limits: ["Páginas adicionais, fotografia e identidade completa ficam fora deste escopo."],
    deadline: "7 a 10 dias úteis após materiais e condições de início.",
    optional: "Manutenção opcional planejada: R$ 149/mês, com escopo separado.",
    cta: "Estruturar minha presença",
  },
  {
    id: "conteudo",
    name: "Conteúdo Ativo",
    forWho: "Para marcas que precisam publicar com constância sem montar uma equipe interna.",
    price: { monthly: 990 },
    billing: "por mês",
    deliverables: [
      "8 publicações",
      "4 stories derivados",
      "2 vídeos de até 15 segundos",
      "Uma marca e um perfil",
      "Produção conforme briefing",
    ],
    limits: [
      "Cobrança antecipada.",
      "Filmagem presencial, atores, anúncios, gestão de comentários e publicação automática não estão incluídos.",
    ],
    deadline: "Calendário mensal definido após o briefing.",
    optional: "Itens fora do escopo são orçados separadamente.",
    cta: "Dar ritmo à minha marca",
  },
  {
    id: "operacao",
    name: "Operação Inteligente",
    forWho: "Para empresas que querem site, atendimento automatizado e dados organizados no mesmo fluxo.",
    price: { setup: 4490, monthly: 490 },
    billing: "implantação + mensalidade",
    deliverables: [
      "Site de até 5 páginas",
      "Agente no site",
      "Um fluxo de automação de até 5 etapas",
      "Conexão com CRM ou planilha conforme viabilidade",
      "Treinamento de até 60 minutos",
    ],
    limits: [
      "A mensalidade cobre o que for definido em proposta. Não inclui API, mensagens ou suporte ilimitados.",
    ],
    deadline: "15 a 20 dias úteis após requisitos de início.",
    optional: "Custos de plataformas e mensagens são discriminados separadamente.",
    cta: "Conectar minha operação",
  },
  {
    id: "loja",
    name: "Loja Pronta",
    forWho: "Para quem quer vender online usando uma plataforma de loja já existente.",
    price: { setup: 3990, optionalMaintenance: 249 },
    billing: "por projeto",
    deliverables: [
      "Configuração em plataforma existente",
      "Até 20 produtos simples e 5 categorias",
      "Uma configuração de pagamento e uma de frete",
      "Treinamento",
      "2 rodadas de revisão",
    ],
    limits: ["Taxas da plataforma, do meio de pagamento e do frete são do cliente."],
    deadline: "15 a 20 dias úteis após materiais e acessos.",
    optional: "Manutenção opcional planejada: R$ 249/mês.",
    cta: "Estruturar minha loja",
  },
];

export const singles: { name: string; price: Price; scope: string }[] = [
  { name: "Landing page", price: { setup: 1490 }, scope: "até 6 seções" },
  { name: "Site institucional", price: { setup: 2490 }, scope: "até 5 páginas" },
  { name: "Chatbot/agente", price: { setup: 1490, monthly: 249 }, scope: "1 canal e até 30 perguntas aprovadas" },
  { name: "Automação", price: { setup: 990, monthly: 199 }, scope: "até 5 etapas e 2 ferramentas existentes" },
  { name: "Conteúdo para redes", price: { monthly: 990 }, scope: "8 posts, 4 stories derivados e 2 vídeos curtos" },
  { name: "Identidade visual", price: { setup: 990 }, scope: "logo, paleta, tipografia, guia curto e 3 templates" },
  { name: "Loja virtual", price: { setup: 3990 }, scope: "até 20 produtos simples e 5 categorias" },
  { name: "Prompts personalizados", price: { onRequest: true }, scope: "conforme necessidade" },
  { name: "Noryli Connect", price: { onRequest: true }, scope: "conforme quantidade, formato e página" },
];

export const brl = (n: number) => `R$ ${n.toLocaleString("pt-BR")}`;

/** Formata o preço para exibição. showPlanned = prévia de revisão. */
export function formatPrice(p: Price, opts: { approved: boolean; showPlanned: boolean }): string {
  if (p.onRequest) return "Sob consulta";
  if (!opts.approved && !opts.showPlanned) return "Solicitar proposta";
  const parts: string[] = [];
  if (p.setup) parts.push(brl(p.setup));
  if (p.monthly) parts.push(`${p.setup ? "+ " : ""}${brl(p.monthly)}/mês`);
  const prefix = opts.approved ? "a partir de " : "Planejado: ";
  return prefix + parts.join(" ");
}

/** Identifica hosts de prévia (editor), nunca o site publicado. */
export function isPreviewHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h === "127.0.0.1") return true;
  const first = h.split(".")[0] ?? "";
  const okSuffix = /\.(lovable\.app|gpt-eng\.com|gptengineer\.run)$/.test(h);
  if (h.endsWith(".lovableproject.com") || h.endsWith(".lovableproject-dev.com")) return true;
  if (okSuffix && /^(?:id-preview|preview)(?:-[a-z0-9]+)?--.+$/.test(first)) return true;
  if (okSuffix && /^live--[0-9a-f-]{36}(?:-thr_[a-z0-9]+)?$/.test(first)) return true;
  if (/^project--[0-9a-f-]{36}-dev\.lovable\.app$/.test(h)) return true;
  return false;
}
