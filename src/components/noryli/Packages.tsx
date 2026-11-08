import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { packages, singles, formatPrice, site } from "@/config/site";
import { goDiagnostic, store, useStore } from "@/lib/store";

export function Packages() {
  const { showPlanned, isPreview } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const opts = { approved: site.pricesApproved, showPlanned: isPreview && showPlanned };
  return (
    <section id="pacotes" aria-labelledby="pac-t" className="light-surface py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <p className="eyebrow !text-[color:var(--violet)]">Pacotes e investimento</p>
        <h2 id="pac-t" className="mt-3 max-w-4xl text-[clamp(2.2rem,4.6vw,4rem)] uppercase">Comece pelo que faz diferença agora. Evolua com estrutura.</h2>
        {isPreview && !site.pricesApproved && (
          <label className="mt-6 inline-flex min-h-[44px] items-center gap-3 rounded-md border border-ink/20 px-3 text-sm">
            <input type="checkbox" checked={showPlanned} onChange={(e) => store.set({ showPlanned: e.target.checked })} className="h-5 w-5 accent-[color:var(--violet)]" />
            Prévia de revisão: mostrar valores planejados (não aprovados)
          </label>
        )}
        <p className="mt-4 max-w-3xl text-sm opacity-80">Valores a partir de, sujeitos ao escopo. Domínio, hospedagem, plataformas, licenças, mensagens, APIs, anúncios, taxas e frete, quando aplicáveis, são discriminados separadamente.</p>

        <ul className="mt-10 border-t border-ink/15">
          {packages.map((p) => (
            <li key={p.id} className="border-b border-ink/15">
              <div className="grid gap-3 py-6 md:grid-cols-[1.2fr_1.6fr_1fr_auto] md:items-center">
                <h3 className="text-3xl uppercase">{p.name}</h3>
                <p className="text-sm opacity-80">{p.forWho}</p>
                <p className="font-semibold">{formatPrice(p.price, opts)}<span className="block text-xs font-normal opacity-70">{p.billing}</span></p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => goDiagnostic({ kind: "package", id: p.id, label: p.name })} className="btn-gold !min-h-[44px] !text-xs">{p.cta}</button>
                  <button aria-expanded={open === p.id} aria-controls={`pk-${p.id}`} onClick={() => setOpen(open === p.id ? null : p.id)} className="btn-line !min-h-[44px] !text-xs">
                    Detalhes <ChevronDown size={14} className={open === p.id ? "rotate-180" : ""} />
                  </button>
                </div>
              </div>
              {open === p.id && (
                <div id={`pk-${p.id}`} className="grid gap-6 pb-8 text-sm md:grid-cols-3">
                  <div><p className="font-semibold">Entregáveis</p><ul className="mt-2 space-y-1 opacity-80">{p.deliverables.map((d) => <li key={d}>— {d}</li>)}</ul></div>
                  <div><p className="font-semibold">Limites</p><ul className="mt-2 space-y-1 opacity-80">{p.limits.map((d) => <li key={d}>— {d}</li>)}</ul></div>
                  <div><p className="font-semibold">Prazo previsto</p><p className="mt-2 opacity-80">{p.deadline}</p><p className="mt-3 font-semibold">Opcional</p><p className="mt-1 opacity-80">{opts.showPlanned || opts.approved ? p.optional : "Manutenção e itens opcionais orçados em proposta."}</p></div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <h3 className="mt-16 text-3xl uppercase">Serviços avulsos</h3>
        <ul className="mt-4 grid gap-x-10 md:grid-cols-2">
          {singles.map((s) => (
            <li key={s.name} className="flex items-baseline justify-between gap-4 border-b border-ink/15 py-3 text-sm">
              <span><b>{s.name}</b> <span className="opacity-70">· {s.scope}</span></span>
              <span className="shrink-0 font-semibold">{formatPrice(s.price, opts)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-sm opacity-80">
          <b>Por que a landing page avulsa custa menos que a Presença Profissional?</b> A avulsa entrega só a página. O pacote soma texto baseado no briefing, logo tipográfico simples e 3 templates — tudo para você começar com uma presença completa.
        </p>
      </div>
    </section>
  );
}
