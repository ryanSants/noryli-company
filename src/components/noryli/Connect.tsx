import { Nfc, QrCode } from "lucide-react";
import { goDiagnostic } from "@/lib/store";

const offers = [
  { n: "Connect Essencial", s: "Apresentação individual", d: ["Uma unidade física com material a definir", "Personalização visual", "Configuração do destino NFC e QR alternativo", "Página básica conforme proposta", "Orientação de uso"] },
  { n: "Connect Negócios", s: "Mesas, recepções e balcões", d: ["Formatos e quantidades conforme orçamento", "Destino: cardápio, catálogo, localização ou atendimento", "Personalização por ponto de uso", "Orientação de instalação"] },
  { n: "Connect Equipes", s: "Apresentação comercial padronizada", d: ["Identidade compartilhada", "Identificação individual", "Quantidade conforme proposta", "Páginas individuais e gestão centralizada apenas quando contratadas"] },
];

export function Connect() {
  return (
    <section id="connect" aria-labelledby="con-t" className="relative mx-auto max-w-7xl px-5 py-24 md:px-8">
      <p className="eyebrow reveal">Noryli Connect · NFC + QR Code</p>
      <h2 id="con-t" className="reveal mt-3 max-w-4xl text-[clamp(2.4rem,5vw,4.4rem)] uppercase">Seu próximo contato pode começar com uma aproximação.</h2>
      <p className="reveal mt-3 text-xs text-muted-foreground">Simulação visual. A leitura real depende de um dispositivo compatível.</p>
      <div className="mt-12 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
        {offers.map((o, i) => (
          <article key={o.n} className={`reveal p-6 ${i === 1 ? "bg-plum" : "bg-deep"}`}>
            <h3 className="text-3xl uppercase">{o.n}</h3>
            <p className="text-sm text-gold">{o.s}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">{o.d.map((x) => <li key={x}>— {x}</li>)}</ul>
            <p className="mt-5 font-display text-2xl">Sob consulta</p>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Escopos propostos sujeitos à validação comercial.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <ul className="reveal space-y-3 text-sm">
          <li className="flex gap-3"><Nfc className="shrink-0 text-cyan" size={18} /> NFC depende de aparelho compatível; o QR Code é a alternativa.</li>
          <li className="flex gap-3"><QrCode className="shrink-0 text-cyan" size={18} /> O conteúdo online exige internet.</li>
          <li className="flex gap-3"><span className="w-[18px] shrink-0 text-center text-cyan">↻</span> Atualizar o destino sem reimprimir depende de uma página ou URL gerenciável.</li>
          <li className="flex gap-3"><span className="w-[18px] shrink-0 text-center text-cyan">+</span> Cartão físico, manutenção da página, personalização adicional, reposição e frete podem ter custos separados.</li>
        </ul>
        <div className="reveal flex items-end md:justify-end">
          <button onClick={() => goDiagnostic({ kind: "connect", label: "Noryli Connect" })} className="btn-gold">Desenhar meu Connect</button>
        </div>
      </div>
    </section>
  );
}
