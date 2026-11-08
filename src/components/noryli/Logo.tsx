import simbolo from "@/assets/noryli-simbolo.png.asset.json";
import lettering from "@/assets/noryli-lettering.png.asset.json";

/** Recortes proporcionais da logomarca original, sobre superfície compatível. */
export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "sm" ? 36 : size === "lg" ? 72 : 44;
  return (
    <span className="inline-flex items-center gap-2 overflow-hidden rounded-md bg-plum/80" style={{ height: h }}>
      <img src={simbolo.url} alt="" width={h} height={h} className="h-full w-auto" />
      <img
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
  return <img src={simbolo.url} alt="Noryli" width={512} height={512} className={className} />;
}
