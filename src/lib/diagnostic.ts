import type { PackageId } from "@/config/site";

export type Answers = {
  business?: string;
  difficulty?: "atendimento" | "site" | "conteudo" | "manual" | "varias" | "connect";
  team?: string;
  priority?: "vender" | "tempo" | "experiencia" | "marca" | "crescimento";
};

export type Interest = { kind: "package"; id: PackageId; label: string } | { kind: "connect"; label: string } | null;

export type Recommendation = {
  solution: string;
  why: string;
  deliverables: string[];
  packageId: PackageId | null;
  connect: boolean;
};

const labelsDifficulty: Record<NonNullable<Answers["difficulty"]>, string> = {
  atendimento: "a demora no atendimento",
  site: "um site que não gera oportunidades",
  conteudo: "um conteúdo inconsistente",
  manual: "tarefas manuais repetidas",
  varias: "várias frentes que precisam melhorar",
  connect: "conectar o atendimento presencial ao digital",
};

/** A dificuldade principal pesa mais que a prioridade. Solução integrada só com múltiplas necessidades confirmadas. */
export function recommend(a: Answers, interest: Interest = null): Recommendation {
  const d = a.difficulty;
  const prio = a.priority;
  const ctx = `Você indicou ${d ? labelsDifficulty[d] : "uma necessidade"} como principal dificuldade`;
  const multipleConfirmed =
    d === "varias" || (d === "manual" && prio === "crescimento") || (interest?.kind === "package" && interest.id === "operacao" && d !== undefined && d !== "conteudo");

  if (d === "connect" || (interest?.kind === "connect" && d !== "varias")) {
    return {
      solution: "Noryli Connect",
      why: `${ctx}. Um cartão ou ponto de contato com NFC e QR Code leva quem está no seu espaço direto para cardápio, catálogo, localização ou atendimento.`,
      deliverables: ["Peça física personalizada com NFC e QR alternativo", "Configuração do destino digital", "Orientação de uso e instalação"],
      packageId: null,
      connect: true,
    };
  }
  if (multipleConfirmed) {
    return {
      solution: "Operação Inteligente",
      why: `${ctx}${prio === "crescimento" ? " e quer estruturar o crescimento" : ""}. Como há mais de uma frente envolvida, faz sentido conectar site, atendimento e organização dos contatos no mesmo fluxo.`,
      deliverables: ["Site de até 5 páginas", "Agente no site para o primeiro contato", "Automação levando contatos para CRM ou planilha"],
      packageId: "operacao",
      connect: false,
    };
  }
  if (d === "atendimento" || d === "manual") {
    return {
      solution: d === "atendimento" ? "Bot inteligente de atendimento" : "Automação de tarefas",
      why: `${ctx}. ${d === "atendimento" ? "Um bot responde perguntas aprovadas, coleta as informações iniciais e passa a conversa para sua equipe com contexto." : "Uma automação move informações entre as ferramentas que você já usa, sem que alguém precise copiar e colar."}`,
      deliverables:
        d === "atendimento"
          ? ["Bot em 1 canal com até 30 perguntas aprovadas", "Coleta e qualificação do contato", "Encaminhamento para uma pessoa com o histórico"]
          : ["Mapeamento da tarefa repetida", "Fluxo de até 5 etapas", "Conexão com até 2 ferramentas existentes"],
      packageId: null,
      connect: false,
    };
  }
  if (d === "site") {
    const store = a.business === "loja";
    return {
      solution: store ? "Loja virtual estruturada" : "Presença digital estratégica",
      why: `${ctx}. ${store ? "Uma loja organizada em plataforma existente ajuda o cliente a encontrar o produto e concluir a compra." : "Uma página com objetivo e navegação definidos leva o visitante de uma dúvida concreta até o pedido de contato."}`,
      deliverables: store
        ? ["Até 20 produtos e 5 categorias", "Pagamento e frete configurados", "Treinamento para operar a loja"]
        : ["Landing page de até 6 seções", "Texto orientado à decisão", "Layout responsivo com chamada clara para contato"],
      packageId: store ? "loja" : "presenca",
      connect: false,
    };
  }
  if (d === "conteudo") {
    return {
      solution: "Conteúdo com IA e direção humana",
      why: `${ctx}. Um processo editorial transforma uma pauta em post, story e vídeo curto, mantendo a identidade da marca.`,
      deliverables: ["8 publicações mensais", "4 stories derivados", "2 vídeos de até 15 segundos"],
      packageId: "conteudo",
      connect: false,
    };
  }
  return {
    solution: "Conversa de diagnóstico",
    why: "Ainda faltam informações para indicar uma solução específica.",
    deliverables: ["Entender a rotina e o público", "Definir escopo", "Apresentar investimento"],
    packageId: null,
    connect: false,
  };
}
