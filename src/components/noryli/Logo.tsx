import { useState } from "react";
import simbolo from "@/assets/noryli-simbolo.png.asset.json";
import lettering from "@/assets/noryli-lettering.png.asset.json";

/** Recortes proporcionais da logomarca original, sobre superfície compatível. */
export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className="font-display text-2xl uppercase tracking-widest text-gold">Noryli Company</span>;
  const h = size === "sm" ? 36 : size === "lg" ? 72 : 44;
  return (
    <span className="inline-flex items-center gap-2 overflow-hidden rounded-md bg-plum/80" style={{ height: h }}>
      <img onError={() => setFailed(true)} src={simbolo.url} alt="" width={h} height={h} className="h-full w-auto" />
      <img
        onError={() => setFailed(true)}
        src={lettering.url}
        alt="Noryli Company"
        width={Math.round(h * 2.2 * 2.4)}
        height={Math.round(h * 1.0)}
        className="h-[80%] w-auto pr-2"
      />
    </span>
  );
}

export function LogoSymbol({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span className={className} aria-label="Noryli">N</span>;
  return <img onError={() => setFailed(true)} src={simbolo.url} alt="Noryli" width={512} height={512} className={className} />;
}
