import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";

const Label = () => <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Projeto conceitual demonstrativo</p>;

function ChatStudy() {
  const [path, setPath] = useState<null | "orc" | "acomp">(null);
  return (
    <div className="mt-4 space-y-2 text-sm" aria-live="polite">
      <p className="text-[10px] uppercase tracking-widest text-cyan">Demonstração roteirizada</p>
      <p className="w-fit rounded-md bg-ivory/10 px-3 py-2">Olá! Como posso ajudar?</p>
      {!path && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setPath("orc")} className="btn-line !min-h-[44px]">Pedir orçamento</button>
          <button onClick={() => setPath("acomp")} className="btn-line !min-h-[44px]">Acompanhar solicitação</button>
        </div>
      )}
      {path === "orc" && (<>
        <p className="ml-auto w-fit rounded-md bg-cyan/15 px-3 py-2 text-cyan">Pedir orçamento</p>
        <p className="w-fit rounded-md bg-ivory/10 px-3 py-2">Resposta aprovada: “Nossos orçamentos saem em até 1 dia útil. Pode me dizer o serviço e a cidade?”</p>
        <p className="rounded-md border border-gold/40 p-2 text-xs text-gold">Encaminhado para pessoa: equipe comercial recebe serviço, cidade e contato.</p>
      </>)}
      {path === "acomp" && (<>
        <p className="ml-auto w-fit rounded-md bg-cyan/15 px-3 py-2 text-cyan">Acompanhar solicitação</p>
        <p className="w-fit rounded-md bg-ivory/10 px-3 py-2">Resposta aprovada: “Informe o número do pedido para eu localizar.”</p>
        <p className="rounded-md border border-gold/40 p-2 text-xs text-gold">Se não localizar, encaminha para o atendimento humano com o número informado.</p>
      </>)}
      {path && <button onClick={() => setPath(null)} className="tap text-xs text-muted-foreground underline">Reiniciar</button>}
    </div>
  );
}

function ArchSite() {
  const [mode, setMode] = useState<"desk" | "mob">("desk");
  const [page, setPage] = useState<"home" | "proj" | "brief">("home");
  return (
    <div className="mt-4">
      <div className="flex gap-1" role="group" aria-label="Dispositivo">
        <button aria-pressed={mode === "desk"} onClick={() => setMode("desk")} className={`tap grid place-items-center rounded-sm ${mode === "desk" ? "bg-ink text-ivory" : ""}`} aria-label="Desktop"><Monitor size={18} /></button>
        <button aria-pressed={mode === "mob"} onClick={() => setMode("mob")} className={`tap grid place-items-center rounded-sm ${mode === "mob" ? "bg-ink text-ivory" : ""}`} aria-label="Celular"><Smartphone size={18} /></button>
      </div>
      <div className={`mx-auto mt-3 overflow-hidden rounded-md border border-ink/20 bg-[oklch(0.97_0.005_90)] transition-all ${mode === "desk" ? "w-full" : "w-[220px]"}`}>
        <div className="flex items-center justify-between border-b border-ink/10 px-3 py-2 text-[11px] tracking-widest">
          <span className="font-semibold">ATELIÊ LINHA</span>
          <button onClick={() => setPage("brief")} className="tap px-1 underline">Briefing</button>
        </div>
        <div className="min-h-[200px] p-4 text-ink">
          {page === "home" && (<>
            <p className="font-display text-3xl uppercase">Casas que respiram.</p>
            <button onClick={() => setPage("proj")} className="mt-3 block w-full rounded-sm bg-[linear-gradient(135deg,oklch(0.8_0.03_80),oklch(0.6_0.04_60))] p-3 text-left text-xs text-ink">Projeto · Casa Mirante → abrir</button>
          </>)}
          {page === "proj" && (<>
            <p className="text-[10px] uppercase tracking-widest">Casa Mirante · 240 m²</p>
            <p className="mt-2 text-sm">Desafio: luz natural em terreno estreito. Solução: pátio central e brises de madeira.</p>
            <button onClick={() => setPage("brief")} className="mt-4 rounded-sm bg-ink px-3 py-2 text-xs text-ivory">Quero um projeto assim</button>
          </>)}
          {page === "brief" && (<>
            <p className="font-display text-2xl uppercase">Briefing</p>
            <p className="mt-1 text-xs">Etapas: tipo de obra → metragem → prazo → contato.</p>
            <button onClick={() => setPage("home")} className="mt-4 text-xs underline">Voltar ao início</button>
          </>)}
        </div>
      </div>
    </div>
  );
}

function ContentStudy() {
  const t = { Post: "Café de origem, torra da semana: Mantiqueira, notas de caramelo. Disponível até sábado.", Story: "Enquete: você prefere coado ou espresso para essa torra? 👇", Roteiro: "Cena 1: grãos caindo. Texto: “Torrado terça”. Cena 2: xícara. Texto: “Na sua mesa até sábado”." };
  const [k, setK] = useState<keyof typeof t>("Post");
  return (
    <div className="mt-4">
      <p className="text-xs text-muted-foreground">Marca fictícia <b className="text-ivory">Grão Norte</b> · pauta: torra da semana</p>
      <div className="mt-2 flex gap-1">{(Object.keys(t) as (keyof typeof t)[]).map((x) => <button key={x} aria-pressed={k === x} onClick={() => setK(x)} className={`tap rounded-sm px-3 text-xs ${k === x ? "bg-gold text-deep" : "bg-ivory/10"}`}>{x}</button>)}</div>
      <div className={`mt-3 grid place-items-center rounded-md bg-[linear-gradient(160deg,oklch(0.35_0.08_50),oklch(0.2_0.05_40))] p-5 text-center ${k === "Story" ? "aspect-[9/12] max-w-[200px]" : "aspect-square max-w-[260px]"}`}>
        <p className="font-display text-xl uppercase text-ivory">{t[k]}</p>
      </div>
    </div>
  );
}

function OpsStudy() {
  const steps = [
    { n: "Entrada", keep: "Nome, canal, pedido: troca de tamanho", recv: "" },
    { n: "Triagem", keep: "+ número do pedido, prazo de troca válido", recv: "" },
    { n: "Retorno", keep: "+ etiqueta de envio gerada", recv: "Equipe recebe: resumo completo e ação sugerida — enviar etiqueta." },
  ];
  const [i, setI] = useState(0);
  return (
    <div className="mt-4">
      <ol className="flex gap-1">
        {steps.map((s, n) => <li key={s.n} className="flex-1"><button onClick={() => setI(n)} aria-current={i === n ? "step" : undefined} className={`tap w-full rounded-sm text-xs font-semibold ${n <= i ? "bg-cyan text-deep" : "bg-ivory/10"}`}>{s.n}</button></li>)}
      </ol>
      <p className="mt-3 text-sm"><span className="text-muted-foreground">Preservado:</span> {steps[i]!.keep}</p>
      {steps[i]!.recv && <p className="mt-2 rounded-md border border-gold/40 p-2 text-xs text-gold">{steps[i]!.recv}</p>}
    </div>
  );
}

const studies = [
  { t: "Atendimento que não dorme.", obj: "Responder pedidos fora do horário.", sol: "Bot com respostas aprovadas e passagem para pessoa.", imp: "Menos contatos perdidos à noite.", C: ChatStudy, cls: "glass md:col-span-7" },
  { t: "Uma presença criada para converter.", obj: "Levar o visitante do portfólio ao briefing.", sol: "Site de estúdio de arquitetura com caminho até o pedido.", imp: "Briefings mais completos.", C: ArchSite, cls: "light-surface md:col-span-5 md:mt-20" },
  { t: "Conteúdo que encontra seu ritmo.", obj: "Publicar toda semana sem perder identidade.", sol: "Uma pauta desdobrada em três formatos.", imp: "Constância com menos esforço.", C: ContentStudy, cls: "border border-border md:col-span-5" },
  { t: "Uma operação mais conectada.", obj: "Não perder informação entre etapas.", sol: "Fluxo Entrada → Triagem → Retorno.", imp: "Equipe recebe o caso pronto para agir.", C: OpsStudy, cls: "bg-plum md:col-span-7 md:-mt-12" },
];

export function Projects() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="projetos" aria-labelledby="proj-t" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <h2 id="proj-t" className="reveal text-[clamp(2.6rem,5.5vw,5rem)] uppercase">Veja a ideia funcionando.</h2>
      <div className="mt-12 grid gap-6 md:grid-cols-12 md:items-start">
        {studies.map((s, i) => (
          <article key={s.t} className={`reveal rounded-md p-6 ${s.cls}`}>
            <Label />
            <h3 className="mt-2 text-3xl uppercase md:text-4xl">{String(i + 1).padStart(2, "0")}. {s.t}</h3>
            <dl className="mt-3 grid gap-1 text-sm opacity-90">
              <div><dt className="inline font-semibold">Objetivo: </dt><dd className="inline">{s.obj}</dd></div>
              <div><dt className="inline font-semibold">Solução: </dt><dd className="inline">{s.sol}</dd></div>
              <div><dt className="inline font-semibold">Impacto esperado: </dt><dd className="inline">{s.imp}</dd></div>
            </dl>
            <button aria-expanded={open === i} aria-controls={`study-${i}`} onClick={() => setOpen(open === i ? null : i)} className="btn-line mt-4 !min-h-[44px]">{open === i ? "Fechar estudo" : "Abrir estudo"}</button>
            {open === i && <div id={`study-${i}`}><s.C /></div>}
          </article>
        ))}
      </div>
    </section>
  );
}
