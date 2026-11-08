import { describe, it, expect } from "vitest";
import { leadSchema, canMarkClient } from "./leads";
const base = { name: "Ana", company: "Casa", channel: "email" as const, contact: "a@b.com", consent: true as const };
describe("pedido de orçamento", () => {
  it("exige autorização de contato", () => expect(leadSchema.safeParse({ ...base, consent: false }).success).toBe(false));
  it("aceita WhatsApp com DDD", () => expect(leadSchema.safeParse({ ...base, channel: "whatsapp", contact: "(61) 98264-6793" }).success).toBe(true));
  it("só fechado vira cliente", () => { expect(canMarkClient("fechado")).toBe(true); expect(canMarkClient("em_conversa")).toBe(false); });
});
