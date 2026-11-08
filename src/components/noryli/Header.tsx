import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

export const navLinks = [
  { id: "inicio", label: "Início" },
  { id: "servicos", label: "Serviços" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "contato", label: "Contato" },
];

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  useEffect(() => {
    const els = ids.map((i) => document.getElementById(i)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [ids.join()]);
  return active;
}

const headerSections = ["inicio", "servicos", "connect", "transformacao", "sobre", "projetos", "pacotes", "diagnostico", "contato"];
const map: Record<string, string> = { connect: "servicos", transformacao: "servicos", pacotes: "projetos", diagnostico: "contato" };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const raw = useActiveSection(headerSections);
  const active = map[raw] ?? raw;

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? "border-b border-border bg-deep/75 backdrop-blur-md" : "border-b border-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#inicio" aria-label="Noryli Company — início" className="shrink-0"><Logo size="sm" /></a>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} aria-current={active === l.id ? "true" : undefined}
                  className={`tap inline-flex items-center px-3 text-sm transition-colors ${active === l.id ? "text-gold" : "text-muted-foreground hover:text-ivory"}`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#diagnostico" className="btn-gold hidden !min-h-[42px] sm:inline-flex">Solicitar diagnóstico</a>
          <button className="tap inline-flex items-center justify-center rounded text-ivory lg:hidden" aria-expanded={open} aria-controls="menu-mobile" aria-label={open ? "Fechar menu" : "Abrir menu"} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="menu-mobile" aria-label="Menu móvel" className="border-t border-border px-4 pb-6 lg:hidden">
          <ul className="flex flex-col">
            {navLinks.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={() => setOpen(false)} className="flex min-h-[52px] items-center border-b border-border font-display text-2xl">{l.label}</a>
              </li>
            ))}
          </ul>
          <a href="#diagnostico" onClick={() => setOpen(false)} className="btn-gold mt-5 w-full">Solicitar diagnóstico</a>
        </nav>
      )}
    </header>
  );
}

const constellation = [
  { id: "inicio", label: "Início" },
  { id: "servicos", label: "Serviços" },
  { id: "transformacao", label: "Transformação" },
  { id: "sobre", label: "Sobre" },
  { id: "projetos", label: "Projetos" },
  { id: "resultados", label: "Resultados" },
  { id: "diagnostico", label: "Diagnóstico" },
  { id: "contato", label: "Contato" },
];

/** Linha lateral fina com pontos de seção (desktop). */
export function Constellation() {
  const active = useActiveSection(constellation.map((c) => c.id));
  return (
    <nav aria-label="Mapa das seções" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ul className="relative flex flex-col items-end gap-4 before:absolute before:bottom-2 before:right-[5px] before:top-2 before:w-px before:bg-ivory/15">
        {constellation.map((c) => (
          <li key={c.id}>
            <a href={`#${c.id}`} className="group relative flex flex-row-reverse items-center gap-3" aria-current={active === c.id ? "true" : undefined}>
              <span className={`relative z-10 block h-[11px] w-[11px] rounded-full border transition-all ${active === c.id ? "border-gold bg-gold" : "border-ivory/40 bg-deep"}`} />
              <span className={`text-[11px] uppercase tracking-[0.18em] transition-opacity ${active === c.id ? "text-gold opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>{c.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
