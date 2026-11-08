import { z } from "zod";

export const leadSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome").max(100, "Nome muito longo"),
    company: z.string().trim().min(1, "Informe a empresa").max(120, "Nome muito longo"),
    channel: z.enum(["whatsapp", "email"]),
    contact: z.string().trim().max(160),
    consent: z.literal(true, { errorMap: () => ({ message: "Autorize o contato para enviar" }) }),
  })
  .superRefine((v, ctx) => {
    if (v.channel === "email" && !z.string().email().safeParse(v.contact).success)
      ctx.addIssue({ code: "custom", path: ["contact"], message: "E-mail inválido" });
    if (v.channel === "whatsapp" && !/^\d{10,13}$/.test(v.contact.replace(/\D/g, "")))
      ctx.addIssue({ code: "custom", path: ["contact"], message: "WhatsApp com DDD, só números" });
  });

export type LeadInput = z.infer<typeof leadSchema>;

export const stages = [
  { id: "novo", label: "Novo pedido" },
  { id: "em_conversa", label: "Em conversa" },
  { id: "proposta_enviada", label: "Proposta enviada" },
  { id: "fechado", label: "Fechado" },
  { id: "arquivado", label: "Arquivado" },
] as const;
export type StageId = (typeof stages)[number]["id"];
export const stageLabel = (s: string) => stages.find((x) => x.id === s)?.label ?? s;

/** Só pedidos fechados podem virar cliente. */
export const canMarkClient = (stage: string) => stage === "fechado";
