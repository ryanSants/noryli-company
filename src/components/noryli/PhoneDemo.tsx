import { useState } from "react";
import { ArrowLeft, MapPin, MessageCircle, Phone, User } from "lucide-react";

export type Scenario = "restaurante" | "perfil" | "local" | "equipe";
export const scenarios: { id: Scenario; label: string }[] = [
  { id: "restaurante", label: "Restaurante" },
  { id: "perfil", label: "Perfil profissional" },
  { id: "local", label: "Empresa local" },
  { id: "equipe", label: "Equipe comercial" },
];

const menu: Record<string, { name: string; desc: string; price: string }[]> = {
  Entradas: [
    { name: "Pastel de pupunha", desc: "Massa fina, pupunha na manteiga e maionese de limão-cravo.", price: "R$ 34" },
    { name: "Burrata e caju", desc: "Burrata, caju tostado e azeite de ervas.", price: "R$ 46" },
  ],
  Principais: [
    { name: "Arroz de pato", desc: "Arroz cremoso, pato desfiado e laranja assada.", price: "R$ 78" },
    { name: "Peixe do dia", desc: "Pescado grelhado, purê de banana-da-terra e vinagrete.", price: "R$ 84" },
  ],
  Sobremesas: [{ name: "Pudim de tapioca", desc: "Calda de café e flor de sal.", price: "R$ 28" }],
};

/** Tela do celular: destino aberto pelo cartão (demonstração). */
export function PhoneDemo({ scenario }: { scenario: Scenario }) {
  const [view, setView] = useState<"home" | "menu" | "dish">("home");
  const [cat, setCat] = useState("Entradas");
  const [dish, setDish] = useState(0);

  const tag = <p className="mb-3 rounded-sm bg-cyan/15 px-2 py-1 text-center text-[10px] font-semibold uppercase tracking-widest text-cyan">Demonstração</p>;

  if (scenario === "restaurante") {
    if (view === "home")
      return (
        <div className="flex h-full flex-col p-4">
          {tag}
          <p className="eyebrow !text-[10px]">Mesa 07</p>
          <h4 className="mt-1 font-display text-3xl">Casa Brasa</h4>
          <p className="mt-1 text-xs text-muted-foreground">Restaurante conceitual · cozinha brasileira</p>
          <button onClick={() => setView("menu")} className="btn-gold mt-auto w-full">Menu de hoje</button>
          <button className="btn-line mt-2 w-full !text-xs" onClick={() => setView("menu")}>Ver categorias</button>
        </div>
      );
    if (view === "menu")
      return (
        <div className="flex h-full flex-col p-4">
          <button onClick={() => setView("home")} className="tap -ml-2 inline-flex items-center gap-1 self-start text-xs text-muted-foreground"><ArrowLeft size={14} /> Voltar</button>
          <h4 className="font-display text-2xl">Menu de hoje</h4>
          <div role="tablist" aria-label="Categorias" className="mt-2 flex gap-1 overflow-x-auto">
            {Object.keys(menu).map((c) => (
              <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                className={`tap shrink-0 rounded-sm px-2 text-[11px] font-semibold ${cat === c ? "bg-gold text-deep" : "bg-ivory/10 text-ivory"}`}>{c}</button>
            ))}
          </div>
          <ul className="mt-2 space-y-1">
            {(menu[cat] ?? []).map((d, i) => (
              <li key={d.name}>
                <button onClick={() => { setDish(i); setView("dish"); }} className="tap flex w-full items-center justify-between border-b border-border py-2 text-left text-sm">
                  <span>{d.name}</span><span className="text-gold">{d.price}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      );
    const d = (menu[cat] ?? [])[dish] ?? menu["Entradas"]![0]!;
    return (
      <div className="flex h-full flex-col p-4">
        <button onClick={() => setView("menu")} className="tap -ml-2 inline-flex items-center gap-1 self-start text-xs text-muted-foreground"><ArrowLeft size={14} /> {cat}</button>
        <div className="mt-1 aspect-[4/3] rounded-sm bg-[radial-gradient(circle_at_40%_45%,var(--gold),var(--plum)_70%)] opacity-80" aria-hidden />
        <h4 className="mt-3 font-display text-2xl">{d.name}</h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.desc}</p>
        <p className="mt-auto font-display text-2xl text-gold">{d.price}</p>
      </div>
    );
  }
  if (scenario === "perfil")
    return (
      <div className="flex h-full flex-col p-4">
        {tag}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-violet"><User /></div>
        <h4 className="mt-2 text-center font-display text-2xl">Marina Alves</h4>
        <p className="text-center text-xs text-muted-foreground">Arquiteta · perfil fictício</p>
        <div className="mt-auto space-y-2">
          <span className="btn-gold w-full !text-xs"><MessageCircle size={14} /> Conversar</span>
          <span className="btn-line w-full !text-xs">Salvar contato</span>
          <span className="btn-line w-full !text-xs">Ver portfólio</span>
        </div>
      </div>
    );
  if (scenario === "local")
    return (
      <div className="flex h-full flex-col p-4">
        {tag}
        <h4 className="font-display text-2xl">Oficina Ponto Certo</h4>
        <p className="text-xs text-muted-foreground">Empresa local fictícia</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2"><MapPin size={14} className="text-gold" /> Como chegar</li>
          <li className="flex items-center gap-2"><Phone size={14} className="text-gold" /> Agendar revisão</li>
          <li className="flex items-center gap-2"><MessageCircle size={14} className="text-gold" /> Pedir orçamento</li>
        </ul>
        <p className="mt-auto rounded-sm bg-ivory/5 p-2 text-[11px] text-muted-foreground">Seg. a sáb. · horários ilustrativos</p>
      </div>
    );
  return (
    <div className="flex h-full flex-col p-4">
      {tag}
      <h4 className="font-display text-2xl">Equipe Vértice</h4>
      <p className="text-xs text-muted-foreground">Equipe comercial fictícia</p>
      <ul className="mt-3 space-y-2">
        {["Rafael · Consultor", "Júlia · Pré-vendas", "Tiago · Pós-venda"].map((p) => (
          <li key={p} className="flex items-center justify-between rounded-sm bg-ivory/5 px-2 py-2 text-xs"><span>{p}</span><MessageCircle size={14} className="text-cyan" /></li>
        ))}
      </ul>
      <p className="mt-auto text-[11px] text-muted-foreground">Mesma identidade, identificação individual.</p>
    </div>
  );
}
