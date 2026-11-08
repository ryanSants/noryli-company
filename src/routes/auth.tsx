import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Logo } from "@/components/noryli/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Área da equipe Noryli" },
      { name: "description", content: "Acesso restrito à equipe da Noryli Company." },
      { property: "og:title", content: "Área da equipe Noryli" },
      { property: "og:description", content: "Acesso restrito à equipe da Noryli Company." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("E-mail ou senha incorretos.");
      else nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      setMsg(error ? error.message : "Conta criada. Confirme pelo link enviado ao seu e-mail.");
    }
    setBusy(false);
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) { setMsg("Não foi possível entrar com Google."); return; }
    if (r.redirected) return;
    nav({ to: "/admin" });
  }

  return (
    <main className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <a href="/"><Logo /></a>
        <h1 className="mt-8 text-4xl uppercase">{mode === "in" ? "Área da equipe" : "Criar acesso"}</h1>
        <form onSubmit={submit} className="mt-6 grid gap-3">
          <input className="field" type="email" placeholder="E-mail" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="field" type="password" placeholder="Senha" autoComplete={mode === "in" ? "current-password" : "new-password"} minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
          <button disabled={busy} className="btn-gold disabled:opacity-60">{mode === "in" ? "Entrar" : "Criar conta"}</button>
        </form>
        <button onClick={google} className="btn-line mt-3 w-full">Continuar com Google</button>
        {msg && <p role="status" className="mt-4 text-sm text-muted-foreground">{msg}</p>}
        <button className="tap mt-4 text-sm text-muted-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
        </button>
      </div>
    </main>
  );
}
