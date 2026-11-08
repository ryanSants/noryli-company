const steps = ["Entender a rotina e o público", "Definir escopo e investimento", "Construir com materiais aprovados", "Validar conteúdo e funcionamento", "Colocar em operação e orientar a equipe"];
const principles = ["Estratégia antes da ferramenta", "Design com função", "IA aplicada a problemas reais", "Soluções que podem evoluir", "Comunicação clara durante o projeto"];
const metrics = [
  ["24/7", "possibilidade de atendimento inicial automatizado"],
  ["3 frentes", "automação, presença digital e conteúdo"],
  ["1 estratégia", "entregas ligadas ao mesmo objetivo"],
  ["Menos repetição", "mais tempo para decisões"],
  ["Mais clareza", "cada solução responde a uma necessidade"],
];

export function About() {
  return (
    <>
      <section id="sobre" aria-labelledby="sobre-t" className="mx-auto max-w-7xl px-5 py-24 md:px-8">
        <p className="eyebrow reveal">Manifesto</p>
        <h2 id="sobre-t" className="reveal mt-3 max-w-5xl text-[clamp(2.6rem,6vw,5.4rem)] uppercase">Não criamos tecnologia para impressionar. Criamos para fazer avançar.</h2>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <p className="reveal text-lg leading-relaxed text-muted-foreground">A Noryli aproxima empresas do futuro sem transformar tecnologia em complicação. Reunimos IA, automação, estratégia e design para enfrentar demora, desorganização, presença digital fraca e trabalho repetitivo. Começamos pelo que impede o negócio de crescer.</p>
          <ul className="reveal space-y-2">{principles.map((p) => <li key={p} className="border-b border-border pb-2 font-display text-2xl uppercase">{p}</li>)}</ul>
        </div>
        <p className="sign mt-10 text-2xl text-gold">Noryli Company — designed for what comes next.</p>

        <h3 className="mt-20 text-4xl uppercase">Processo</h3>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-5">
          {steps.map((s, i) => <li key={s} className="bg-deep p-5"><span className="font-display text-4xl text-violet">0{i + 1}</span><p className="mt-2 text-sm">{s}</p></li>)}
        </ol>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">Você fornece: informações do negócio, materiais da marca, acessos necessários e um responsável pelas aprovações. Prazos começam após as condições de início acordadas.</p>
      </section>
      <section id="resultados" aria-labelledby="res-t" className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <h2 id="res-t" className="sr-only">Capacidades</h2>
        <ul className="grid gap-6 md:grid-cols-6">
          {metrics.map(([a, b], i) => (
            <li key={a} className={`reveal border-t border-gold/40 pt-4 ${i < 2 ? "md:col-span-3" : "md:col-span-2"}`}>
              <p className={`font-display uppercase ${i < 2 ? "text-6xl md:text-7xl" : "text-4xl"} ${i === 0 ? "text-cyan" : ""}`}>{a}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-muted-foreground">Resultados específicos variam conforme o projeto, a operação e a implementação.</p>
      </section>
    </>
  );
}
