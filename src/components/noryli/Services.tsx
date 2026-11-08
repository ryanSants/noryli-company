import { useState } from "react";
import { Bot, Globe, PenTool } from "lucide-react";

export function Pains() {
  const items = [
    { t: "22h47", m: "“Ainda tem horário pra amanhã?” — visualizada, sem resposta até o meio-dia." },
    { t: "Quarta", m: "O orçamento pedido no Instagram se perdeu entre o WhatsApp do sócio e um áudio." },
    { t: "7 dias", m: "Última publicação: segunda passada. A semana ficou corrida de novo." },
  ];
  return (
    <section aria-labelledby="pains-t" className="reveal mx-auto max-w-7xl px-5 py-24 md:px-8">
      <h2 id="pains-t" className="max-w-4xl text-[clamp(2.4rem,5vw,4.6rem)] uppercase">O próximo cliente não deveria esperar sua operação se organizar.</h2>
      <ul className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
        {items.map((i) => (
          <li key={i.t} className="bg-deep p-6">
            <span className="font-display text-3xl text-pink">{i.t}</span>
            <p className="mt-3 text-muted-foreground">{i.m}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BotHandoff() {
  const [handed, setHanded] = useState(false);
  return (
    <div className="mt-6 space-y-2 text-sm" aria-live="polite">
      <p className="w-fit max-w-[85%] rounded-md bg-ivory/10 px-3 py-2">Queria um orçamento para 3 ambientes.</p>
      <p className="ml-auto w-fit max-w-[85%] rounded-md bg-cyan/15 px-3 py-2 text-cyan">Claro! Qual o bairro e o prazo desejado?</p>
      <p className="w-fit max-w-[85%] rounded-md bg-ivory/10 px-3 py-2">Pinheiros, até março.</p>
      {handed ? (
        <div className="rounded-md border border-gold/40 bg-gold/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">Passado para Ana · atendente</p>
          <p className="mt-1 text-xs text-muted-foreground">Contexto: orçamento · 3 ambientes · Pinheiros · prazo março · origem Instagram</p>
        </div>
      ) : (
        <button onClick={() => setHanded(true)} className="btn-line !min-h-[44px] w-full">Ver passagem para atendente</button>
      )}
    </div>
  );
}

function SitePath() {
  const steps = ["Dúvida: “Vocês atendem minha região?”", "Página de área atendida", "Prova do trabalho", "Pedido de contato"];
  const [i, setI] = useState(0);
  return (
    <div className="mt-6">
      <ol className="space-y-2">
        {steps.map((s, n) => (
          <li key={s} className={`border-l-2 py-1 pl-3 text-sm transition-colors ${n <= i ? "border-gold text-ivory" : "border-border text-muted-foreground"}`}>{s}</li>
        ))}
      </ol>
      <button onClick={() => setI((i + 1) % steps.length)} className="btn-line mt-4 !min-h-[44px]">{i < steps.length - 1 ? "Próximo passo" : "Recomeçar"}</button>
      <dl className="mt-6 grid grid-cols-2 gap-3 text-xs">
        {[["Site", "apresenta e convence"], ["Loja", "vende e cobra"], ["Página de contato", "capta o pedido"], ["Produto NFC", "conecta o presencial"]].map(([a, b]) => (
          <div key={a} className="border-t border-border pt-2"><dt className="font-semibold text-ivory">{a}</dt><dd className="text-muted-foreground">{b}</dd></div>
        ))}
      </dl>
    </div>
  );
}

function ContentFormats() {
  const f = {
    Post: "Pão de fermentação natural leva 36 horas. Por isso a casca canta quando você corta. Peça o seu até quinta.",
    Story: "Bastidor: 5h da manhã, a primeira fornada. Enquete — casca mais escura ou mais clara?",
    "Vídeo curto": "0–3s: faca cortando a casca (som). 3–10s: “36 horas para isso”. 10–15s: “Encomendas até quinta”.",
  };
  const [k, setK] = useState<keyof typeof f>("Post");
  return (
    <div className="mt-6">
      <p className="text-xs text-muted-foreground">Pauta: <b className="text-ivory">por que nosso pão demora 36 horas</b></p>
      <div className="mt-3 flex gap-1" role="tablist" aria-label="Formato">
        {(Object.keys(f) as (keyof typeof f)[]).map((x) => (
          <button key={x} role="tab" aria-selected={k === x} onClick={() => setK(x)} className={`tap rounded-sm px-3 text-xs font-semibold ${k === x ? "bg-pink text-deep" : "bg-ivory/10"}`}>{x}</button>
        ))}
      </div>
      <p className="mt-3 min-h-[5.5rem] rounded-md border border-pink/30 p-3 text-sm">{f[k]}</p>
      <p className="mt-2 text-[11px] text-muted-foreground">IA acelera o rascunho; a direção é humana.</p>
    </div>
  );
}

export function Services() {
  return (
    <section id="servicos" aria-labelledby="serv-t" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <p className="eyebrow reveal">Três frentes</p>
      <h2 id="serv-t" className="reveal mt-3 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)] uppercase">O que a Noryli resolve</h2>
      <div className="mt-14 grid gap-6 md:grid-cols-12">
        <article className="reveal glass hairline-hover rounded-md p-7 md:col-span-7 md:row-span-2">
          <Bot className="text-cyan" aria-hidden />
          <p className="eyebrow mt-4 !text-cyan">Bots inteligentes</p>
          <h3 className="mt-2 text-4xl uppercase md:text-5xl">Atendimento que continua mesmo quando sua equipe para.</h3>
          <p className="mt-4 max-w-lg text-muted-foreground">Bots para WhatsApp, Instagram e sites, conforme integração contratada. Respondem perguntas aprovadas, coletam informações, qualificam oportunidades e encaminham para pessoas.</p>
          <BotHandoff />
        </article>
        <article className="reveal hairline-hover rounded-md border border-border p-7 md:col-span-5 md:mt-16">
          <Globe className="text-gold" aria-hidden />
          <p className="eyebrow mt-4">Sites estratégicos</p>
          <h3 className="mt-2 text-3xl uppercase md:text-4xl">Sua presença digital deve trabalhar pelo seu negócio.</h3>
          <p className="mt-3 text-sm text-muted-foreground">Landing pages, sites institucionais e lojas virtuais com objetivo, navegação e escopo definidos.</p>
          <SitePath />
        </article>
        <article className="reveal light-surface rounded-md p-7 md:col-span-8 md:col-start-3">
          <PenTool className="text-pink" aria-hidden />
          <p className="eyebrow mt-4 !text-[color:var(--violet)]">Conteúdo com IA</p>
          <h3 className="mt-2 text-3xl uppercase md:text-5xl">Consistência criativa sem transformar sua rotina em uma fábrica de posts.</h3>
          <p className="mt-3 text-sm opacity-80">Estratégia editorial, textos, roteiros, prompts, templates e identidade visual. Sem promessa de volume ilimitado.</p>
          <div className="rounded-md bg-ink p-4 text-ivory"><ContentFormats /></div>
        </article>
      </div>
    </section>
  );
}
