import { useRef, useState } from "react";
import { Check, Copy, Download, Loader2, MessageCircle } from "lucide-react";
import { recommend, type Answers } from "@/lib/diagnostic";
import { useStore } from "@/lib/store";
import { leadSchema } from "@/lib/leads";
import { site, packages } from "@/config/site";
import { supabase } from "@/integrations/supabase/client";

type Q = { key: keyof Answers; q: string; opts: { v: string; l: string }[] };
const questions: Q[] = [
  { key: "business", q: "Qual é o seu tipo de negócio?", opts: [
    { v: "servicos", l: "Serviços" }, { v: "restaurante", l: "Restaurante ou café" }, { v: "loja", l: "Loja / produtos" }, { v: "profissional", l: "Profissional autônomo" }, { v: "outro", l: "Outro" } ] },
  { key: "difficulty", q: "Qual é a principal dificuldade hoje?", opts: [
    { v: "atendimento", l: "Demora no atendimento" }, { v: "site", l: "Site que não gera contatos" }, { v: "conteudo", l: "Conteúdo inconsistente" }, { v: "manual", l: "Tarefas manuais repetidas" }, { v: "connect", l: "Ligar o presencial ao digital" }, { v: "varias", l: "Várias frentes" } ] },
  { key: "team", q: "Quantas pessoas atendem clientes?", opts: [
    { v: "1", l: "Só eu" }, { v: "2-5", l: "2 a 5" }, { v: "6+", l: "6 ou mais" } ] },
  { key: "priority", q: "O que é mais urgente?", opts: [
    { v: "vender", l: "Vender mais" }, { v: "tempo", l: "Ganhar tempo" }, { v: "experiencia", l: "Melhorar a experiência" }, { v: "marca", l: "Fortalecer a marca" }, { v: "crescimento", l: "Estruturar o crescimento" } ] },
];

type Status = "idle" | "sending" | "error" | "done";

export function Diagnostic() {
  const { interest } = useStore();
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>({});
  const [quote, setQuote] = useState(false);
  const [f, setF] = useState({ name: "", company: "", channel: "whatsapp" as "whatsapp" | "email", contact: "", consent: false, website: "" });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState(false);
  const requestId = useRef<string | null>(null);
  const sending = useRef(false);

  const done = step >= questions.length;
  const rec = recommend(a, interest);
  const pkg = rec.packageId ? packages.find((p) => p.id === rec.packageId)?.name : null;
  const interestLabel = interest?.label ?? pkg ?? rec.solution;

  const summary = () => {
    const lines = questions.map((q) => `${q.q} ${q.opts.find((o) => o.v === a[q.key])?.l ?? "-"}`);
    return `Diagnóstico Noryli\n\n${lines.join("\n")}\n\nSolução recomendada: ${rec.solution}\n${rec.why}\n\nEntregas sugeridas:\n${rec.deliverables.map((d) => `- ${d}`).join("\n")}\n\nInteresse: ${interestLabel}`;
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending.current || status === "done") return;
    if (f.website) return; // armadilha antispam
    const parsed = leadSchema.safeParse(f);
    if (!parsed.success) {
      const m: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (m[String(i.path[0])] = i.message));
      setErrs(m);
      return;
    }
    setErrs({});
    sending.current = true;
    setStatus("sending");
    requestId.current ??= crypto.randomUUID();
    const v = parsed.data;
    const { error } = await supabase.from("leads").insert({
      request_id: requestId.current,
      name: v.name,
      company: v.company,
      channel: v.channel,
      contact: v.channel === "whatsapp" ? v.contact.replace(/\D/g, "") : v.contact.toLowerCase(),
      consent: true,
      answers: a as Record<string, string>,
      recommendation: rec.solution,
      package_interest: interestLabel,
    });
    sending.current = false;
    // 23505 = mesmo pedido já salvo (toque repetido): já está no banco
    if (!error || error.code === "23505") setStatus("done");
    else setStatus("error");
  }

  const wa = site.contacts.whatsapp
    ? `https://wa.me/${site.contacts.whatsapp}?text=${encodeURIComponent(`Olá, Noryli! Acabei de enviar um pedido de orçamento (${rec.solution}).`)}`
    : null;

  return (
    <section id="diagnostico" aria-labelledby="diag-t" className="mx-auto max-w-4xl px-5 py-24 md:px-8">
      <p className="eyebrow">Diagnóstico Vivo</p>
      <h2 id="diag-t" className="mt-3 text-[clamp(2.4rem,5vw,4.2rem)] uppercase">Quatro perguntas. Uma direção clara.</h2>
      <p className="mt-3 text-sm text-muted-foreground">Sem identificação. Você vê o resultado antes de decidir qualquer coisa.</p>

      <div className="mt-10 rounded-md border border-border bg-plum/60 p-5 md:p-8">
        {!done ? (
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Pergunta {step + 1} de {questions.length}</p>
            <h3 className="mt-2 text-3xl uppercase">{questions[step]!.q}</h3>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {questions[step]!.opts.map((o) => (
                <button key={o.v} onClick={() => { setA({ ...a, [questions[step]!.key]: o.v }); setStep(step + 1); }}
                  className="tap rounded-md border border-border px-4 py-3 text-left text-sm hover:border-gold">{o.l}</button>
              ))}
            </div>
            {step > 0 && <button onClick={() => setStep(step - 1)} className="tap mt-4 text-sm text-muted-foreground">← Voltar</button>}
          </div>
        ) : (
          <div>
            <p className="text-xs uppercase tracking-widest text-gold">Solução recomendada</p>
            <h3 className="mt-2 text-4xl uppercase">{rec.solution}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{rec.why}</p>
            <ul className="mt-4 space-y-1 text-sm">{rec.deliverables.map((d) => <li key={d}>— {d}</li>)}</ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="btn-line !text-sm" onClick={async () => { await navigator.clipboard.writeText(summary()); setCopied(true); }}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copiado" : "Copiar resumo"}
              </button>
              <button className="btn-line !text-sm" onClick={() => {
                const url = URL.createObjectURL(new Blob([summary()], { type: "text/plain" }));
                const el = document.createElement("a"); el.href = url; el.download = "diagnostico-noryli.txt"; el.click(); URL.revokeObjectURL(url);
              }}><Download size={16} /> Baixar</button>
              <button className="tap text-sm text-muted-foreground" onClick={() => { setStep(0); setA({}); setQuote(false); setStatus("idle"); requestId.current = null; }}>Refazer</button>
            </div>

            {status === "done" ? (
              <div role="status" className="mt-8 rounded-md border border-gold/60 p-5">
                <p className="font-display text-3xl uppercase text-gold">Pedido recebido pela Noryli</p>
                <p className="mt-1 text-sm text-muted-foreground">Vamos responder pelo canal que você escolheu.</p>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-line mt-4 !text-sm"><MessageCircle size={16} /> Conversar pelo WhatsApp</a>}
              </div>
            ) : !quote ? (
              <button className="btn-gold mt-8" onClick={() => setQuote(true)}>Pedir orçamento</button>
            ) : (
              <form onSubmit={submit} noValidate className="mt-8 grid gap-4 border-t border-border pt-6">
                <p className="text-sm">Interesse: <span className="text-gold">{interestLabel}</span></p>
                <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
                <Field label="Nome" err={errs["name"]}><input className="field" maxLength={100} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" /></Field>
                <Field label="Empresa" err={errs["company"]}><input className="field" maxLength={120} value={f.company} onChange={(e) => setF({ ...f, company: e.target.value })} autoComplete="organization" /></Field>
                <fieldset>
                  <legend className="text-sm">Como prefere o retorno?</legend>
                  <div className="mt-2 flex gap-2">
                    {(["whatsapp", "email"] as const).map((c) => (
                      <label key={c} className={`tap flex cursor-pointer items-center rounded-md border px-4 text-sm ${f.channel === c ? "border-gold text-gold" : "border-border"}`}>
                        <input type="radio" name="channel" className="sr-only" checked={f.channel === c} onChange={() => setF({ ...f, channel: c, contact: "" })} />
                        {c === "whatsapp" ? "WhatsApp" : "E-mail"}
                      </label>
                    ))}
                  </div>
                </fieldset>
                <Field label={f.channel === "whatsapp" ? "WhatsApp com DDD" : "E-mail"} err={errs["contact"]}>
                  <input className="field" maxLength={160} inputMode={f.channel === "whatsapp" ? "tel" : "email"} type={f.channel === "whatsapp" ? "tel" : "email"} value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
                </Field>
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" className="mt-1 h-5 w-5 accent-[color:var(--gold)]" checked={f.consent} onChange={(e) => setF({ ...f, consent: e.target.checked })} />
                  <span>Autorizo a Noryli a entrar em contato comigo sobre este pedido.</span>
                </label>
                {errs["consent"] && <p className="text-sm text-destructive">{errs["consent"]}</p>}
                {status === "error" && <p role="alert" className="text-sm text-destructive">Não foi possível salvar agora. Seus dados continuam aqui; tente novamente.</p>}
                <button type="submit" disabled={status === "sending"} className="btn-gold disabled:opacity-60">
                  {status === "sending" ? <><Loader2 className="animate-spin" size={16} /> Enviando…</> : status === "error" ? "Tentar novamente" : "Enviar pedido"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, err, children }: { label: string; err?: string | undefined; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span>{label}</span>
      {children}
      {err && <span className="text-destructive">{err}</span>}
    </label>
  );
}
