import { useRef, useState } from "react";

const rows = [
  ["Atendimento", "Respostas manuais, horas depois", "Primeiro contato automatizado em minutos"],
  ["Contatos", "Leads espalhados em conversas", "Oportunidades organizadas por etapa"],
  ["Site", "Desatualizado, sem chamada clara", "Preparado para converter visitas"],
  ["Redes", "Publicações irregulares", "Processo editorial com calendário"],
  ["Equipe", "Repetindo as mesmas tarefas", "Concentrada nas decisões"],
];

function Side({ after }: { after: boolean }) {
  return (
    <div className={`h-full p-5 md:p-8 ${after ? "bg-plum" : "bg-[oklch(0.13_0.01_300)]"}`}>
      <p className={`eyebrow ${after ? "" : "!text-muted-foreground"}`}>{after ? "Depois" : "Antes"} · Padaria Trigo Alto (fictícia)</p>
      <ul className="mt-5 space-y-4">
        {rows.map((r) => (
          <li key={r[0]} className="grid grid-cols-[6.5rem_1fr] gap-3 text-sm md:grid-cols-[9rem_1fr]">
            <span className="text-muted-foreground">{r[0]}</span>
            <span className={after ? "text-ivory" : "text-muted-foreground line-through decoration-pink/60"}>{after ? r[2] : r[1]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (x: number) => {
    const r = box.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((x - r.left) / r.width) * 100)));
  };
  return (
    <section id="transformacao" aria-labelledby="ba-t" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
      <h2 id="ba-t" className="reveal max-w-4xl text-[clamp(2.2rem,4.6vw,4rem)] uppercase">A tecnologia certa não muda apenas a aparência. Muda a operação.</h2>
      <div className="mt-6 flex gap-2">
        <button onClick={() => setPos(100)} className="btn-line !min-h-[44px]">Ver antes</button>
        <button onClick={() => setPos(0)} className="btn-line !min-h-[44px]">Ver depois</button>
      </div>
      <div ref={box} className="relative mt-6 select-none overflow-hidden rounded-md border border-border touch-pan-y"
        onPointerDown={(e) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); drag(e.clientX); }}
        onPointerMove={(e) => e.buttons === 1 && drag(e.clientX)}>
        <Side after />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><Side after={false} /></div>
        <div className="absolute inset-y-0 w-px bg-gold" style={{ left: `${pos}%` }}>
          <div role="slider" tabIndex={0} aria-label="Divisória antes e depois" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pos)} aria-valuetext={`${Math.round(pos)}% antes`}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
              if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
              if (e.key === "Home") setPos(0);
              if (e.key === "End") setPos(100);
            }}
            className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border border-gold bg-deep text-gold">↔</div>
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Simulação ilustrativa de transformação operacional.</p>
    </section>
  );
}
