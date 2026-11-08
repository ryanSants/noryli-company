import { describe, it, expect } from "vitest";
import { recommend } from "./diagnostic";
import { formatPrice } from "@/config/site";

describe("diagnóstico", () => {
  it("atendimento lento indica bot", () => {
    expect(recommend({ difficulty: "atendimento", priority: "vender" }).solution).toBe("Bot inteligente de atendimento");
  });
  it("vender mais sozinho não recomenda tudo", () => {
    expect(recommend({ difficulty: "conteudo", priority: "vender" }).packageId).toBe("conteudo");
  });
  it("várias frentes indica solução integrada", () => {
    expect(recommend({ difficulty: "varias" }).packageId).toBe("operacao");
  });
  it("conexão físico/digital indica Connect", () => {
    expect(recommend({ difficulty: "connect" }).connect).toBe(true);
  });
  it("site fraco em loja indica Loja Pronta", () => {
    expect(recommend({ difficulty: "site", business: "loja" }).packageId).toBe("loja");
  });
});

describe("preços", () => {
  it("público sem aprovação mostra Solicitar proposta", () => {
    expect(formatPrice({ setup: 1990 }, { approved: false, showPlanned: false })).toBe("Solicitar proposta");
  });
  it("aprovado usa a partir de e separa mensalidade", () => {
    expect(formatPrice({ setup: 4490, monthly: 490 }, { approved: true, showPlanned: false })).toBe("a partir de R$ 4.490 + R$ 490/mês");
  });
});
