import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Nfc } from "lucide-react";
import mesa from "@/assets/mesa-cena.jpg";
import simbolo from "@/assets/noryli-simbolo.png.asset.json";
import lettering from "@/assets/noryli-lettering.png.asset.json";
import { PhoneDemo, scenarios, type Scenario } from "./PhoneDemo";

const sceneNames = ["A mesa", "A aproximação", "O destino", "O que acontece depois"];
const headline = "Seu negócio pode operar como o futuro.";

function useMotionMode() {
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    const mq = matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const f = () => setPinned(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return pinned;
}

/** Abertura em quatro cenas: mesa → aproximação → destino → depois. */
export function TableExperience() {
  const pinned = useMotionMode();
  const [scene, setScene] = useState(0);
  const [scenario, setScenario] = useState<Scenario>("restaurante");
  const ref = useRef<HTMLElement>(null);

  // No desktop, a rolagem natural conduz a câmera (sem prender o visitante).
  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const f = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const total = el.offsetHeight - innerHeight;
        const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total));
        setScene(Math.min(3, Math.floor(p * 4)));
      });
    };
    f();
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, [pinned]);

  const go = (i: number) => {
    const n = Math.max(0, Math.min(3, i));
    if (pinned && ref.current) {
      const el = ref.current;
      const total = el.offsetHeight - innerHeight;
      scrollTo({ top: el.offsetTop + (total * (n + 0.5)) / 4, behavior: "smooth" });
    } else setScene(n);
  };

  const skip = () => document.getElementById("servicos")?.scrollIntoView();

  // Câmera: transformações por cena
  const bg = ["scale(1.05)", "scale(1.6) translate(-8%, -4%)", "scale(2.2) translate(-10%, -6%)", "scale(1.2)"][scene];
  const card = [
    "translate(-50%,-50%) rotateX(58deg) rotateZ(-16deg) scale(1)",
    "translate(-50%,-30%) rotateX(38deg) rotateZ(-8deg) scale(1.7)",
    "translate(-130%,-10%) rotateX(30deg) rotateZ(-6deg) scale(.9)",
    "translate(-50%,40%) rotateX(60deg) scale(.6)",
  ][scene];
  const phone = [
    "translate(60%,-30%) rotateX(58deg) rotateZ(14deg) scale(.75)",
    "translate(-10%,-75%) rotateX(22deg) rotateZ(4deg) scale(.95)",
    "translate(-50%,-52%) rotateX(0deg) rotateZ(0deg) scale(1.15)",
    "translate(-260%,-52%) rotateX(0deg) scale(1)",
  ][scene];

  return (
    <section
      id="inicio"
      ref={ref}
      aria-label="Abertura: a mesa é a interface"
      className="relative"
      style={{ height: pinned ? "420vh" : undefined }}
    >
      <div className={`${pinned ? "sticky top-0 h-screen" : "relative min-h-[100svh] pt-16"} overflow-hidden`}>
        {/* Palco */}
        <div className={`stage absolute inset-0 ${pinned ? "" : "h-[56svh] top-16"}`} aria-hidden={scene === 2 ? undefined : true}>
          <div className="cam absolute inset-0 origin-[65%_55%]" style={{ transform: bg, opacity: scene === 3 ? 0.18 : 1 }}>
            <img src={mesa} alt="" width={1920} height={1088} fetchPriority="high" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--deep)_0%,transparent_55%)]" />
          </div>
          <div className="absolute left-[64%] top-[58%] md:left-[62%]" style={{ transformStyle: "preserve-3d" }}>
            {/* Cartão Noryli Connect */}
            <div className="card-3d absolute flex h-[104px] w-[168px] items-center gap-2 rounded-md px-3 md:h-[130px] md:w-[210px]" style={{ transform: card, opacity: scene === 3 ? 0 : 1 }}>
              <img src={simbolo.url} alt="" width={64} height={64} className="h-14 w-14 rounded-sm md:h-16 md:w-16" />
              <div className="flex flex-col gap-1">
                <img src={lettering.url} alt="" width={120} height={25} className="w-[88px] md:w-[110px]" />
                <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-gold"><Nfc size={10} /> Aproxime</span>
              </div>
            </div>
            {/* Celular */}
            <div className="phone absolute h-[300px] w-[150px] rounded-[26px] p-[6px] md:h-[440px] md:w-[220px]" style={{ transform: phone, opacity: scene === 3 && !pinned ? 0 : 1, pointerEvents: scene === 2 ? "auto" : "none" }}>
              <div className={`relative h-full overflow-hidden rounded-[20px] transition-colors duration-700 ${scene >= 1 ? "bg-plum" : "bg-deep"}`}>
                {scene === 1 && (
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="nfc-ring absolute h-20 w-20 rounded-full border border-cyan" />
                    <Nfc className="text-cyan" />
                  </div>
                )}
                {scene >= 2 && (
                  <div className="h-full text-ivory" style={{ fontSize: 14 }}>
                    <PhoneDemo key={scenario} scenario={scenario} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Texto por cena */}
        <div className={`relative z-10 mx-auto flex max-w-7xl flex-col px-5 md:px-8 ${pinned ? "h-full justify-center" : "pt-[52svh]"}`}>
          {scene === 0 && (
            <div className="max-w-xl pb-10">
              <p className="eyebrow">Inteligência aplicada ao crescimento</p>
              <h1 className="mt-4 text-[clamp(3rem,7vw,6.2rem)] uppercase">
                <span className="sr-only">{headline}</span>
                <span aria-hidden>
                  {headline.split(" ").map((w, i) => (
                    <span key={i} className="hl-word mr-[0.22em]" style={{ animationDelay: `${300 + i * 90}ms` }}>{w}</span>
                  ))}
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                Bots que organizam o primeiro contato. Sites que apresentam seu valor. Conteúdo que mantém sua marca em movimento. Tudo conectado ao que seu negócio precisa resolver.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="#diagnostico" className="btn-gold">Transformar meu negócio <ArrowRight size={16} /></a>
                <a href="#servicos" className="btn-line">Conhecer as soluções</a>
              </div>
              <p className="sign mt-6 text-lg text-gold/90">Um projeto Noryli para o que vem depois.</p>
            </div>
          )}
          {scene === 1 && (
            <div className="max-w-md pb-10">
              <p className="eyebrow !text-cyan">Cena 2 · A aproximação</p>
              <h2 className="mt-3 text-5xl uppercase md:text-6xl">Um cartão sobre a mesa. Uma experiência inteira.</h2>
              <p className="mt-4 text-muted-foreground">Quem senta aproxima o celular do Noryli Connect. NFC ou QR Code abrem o destino que você escolher.</p>
              <button onClick={() => go(2)} className="btn-gold mt-6"><Nfc size={16} /> Simular aproximação</button>
            </div>
          )}
          {scene === 2 && (
            <div className={`max-w-sm pb-10 ${pinned ? "" : ""}`}>
              <p className="eyebrow !text-cyan">Cena 3 · O destino</p>
              <h2 className="mt-3 text-5xl uppercase">O mesmo cartão, outro destino.</h2>
              <p className="mt-3 text-sm text-muted-foreground">Toque na tela do celular para navegar. Troque o cenário:</p>
              <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Cenário do cartão">
                {scenarios.map((s) => (
                  <button key={s.id} role="radio" aria-checked={scenario === s.id} onClick={() => setScenario(s.id)}
                    className={`tap rounded-sm border px-3 py-2 text-left text-sm transition-colors ${scenario === s.id ? "border-gold bg-gold/10 text-gold" : "border-border text-ivory hover:border-ivory/40"}`}>{s.label}</button>
                ))}
              </div>
            </div>
          )}
          {scene === 3 && (
            <div className="grid gap-6 pb-10 md:grid-cols-[1fr_1.1fr] md:items-center">
              <div>
                <p className="eyebrow">Cena 4 · O que acontece depois</p>
                <h2 className="mt-3 text-5xl uppercase md:text-6xl">O contato chega organizado.</h2>
                <p className="mt-3 text-muted-foreground">A visita vira informação útil para a equipe agir.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#projetos" className="btn-line">Ver projetos</a>
                  <a href="#pacotes" className="btn-line">Ver pacotes</a>
                  <a href="#diagnostico" className="btn-gold">Fazer diagnóstico</a>
                </div>
              </div>
              <ol className="glass space-y-3 rounded-md p-5 text-sm">
                <li className="text-[10px] font-semibold uppercase tracking-widest text-cyan">Simulação</li>
                <li className="border-l-2 border-cyan pl-3"><b className="block text-xs text-muted-foreground">Mensagem recebida · 21h14</b>“Vocês fazem reserva para 8 pessoas no sábado?”</li>
                <li className="border-l-2 border-gold pl-3"><b className="block text-xs text-muted-foreground">Oportunidade organizada</b>Reserva · 8 pessoas · sábado · origem: Mesa 07</li>
                <li className="border-l-2 border-pink pl-3"><b className="block text-xs text-muted-foreground">Próxima ação da equipe</b>Confirmar disponibilidade às 10h e responder com o cardápio de grupos.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Indicador de cenas */}
        <div className="absolute inset-x-0 bottom-3 z-20 mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 md:px-8">
          <div className="flex items-center gap-1" role="group" aria-label="Cenas da demonstração">
            <button onClick={() => go(scene - 1)} disabled={scene === 0} aria-label="Cena anterior" className="tap grid place-items-center rounded-sm text-ivory disabled:opacity-30"><ChevronLeft /></button>
            {sceneNames.map((n, i) => (
              <button key={n} onClick={() => go(i)} aria-label={`Cena ${i + 1}: ${n}`} aria-current={scene === i ? "step" : undefined} className="tap grid place-items-center">
                <span className={`block h-[3px] rounded-full transition-all ${scene === i ? "w-8 bg-gold" : "w-4 bg-ivory/30"}`} />
              </button>
            ))}
            <button onClick={() => go(scene + 1)} disabled={scene === 3} aria-label="Próxima cena" className="tap grid place-items-center rounded-sm text-ivory disabled:opacity-30"><ChevronRight /></button>
          </div>
          <button onClick={skip} className="tap px-2 text-xs uppercase tracking-widest text-muted-foreground underline-offset-4 hover:text-ivory hover:underline">Pular demonstração</button>
        </div>
      </div>
    </section>
  );
}
