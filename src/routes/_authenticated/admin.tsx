import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { stages, stageLabel, canMarkClient, type StageId } from "@/lib/leads";
import { Logo } from "@/components/noryli/Logo";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel de pedidos — Noryli" },
      { name: "description", content: "Painel privado de pedidos de orçamento da Noryli." },
      { property: "og:title", content: "Painel de pedidos — Noryli" },
      { property: "og:description", content: "Painel privado da Noryli." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<StageId | "todos">("todos");
  const [open, setOpen] = useState<string | null>(null);

  const role = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { data } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
      return { isAdmin: !!data, email: u.user?.email };
    },
  });

  const leads = useQuery({
    queryKey: ["leads"],
    enabled: !!role.data?.isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const events = useQuery({
    queryKey: ["events", open],
    enabled: !!open,
    queryFn: async () => (await supabase.from("lead_events").select("*").eq("lead_id", open!).order("created_at")).data ?? [],
  });

  const update = useMutation({
    mutationFn: async (p: { id: string; stage?: StageId; is_client?: boolean }) => {
      const { id, ...patch } = p;
      const { error } = await supabase.from("leads").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["leads"] }); qc.invalidateQueries({ queryKey: ["events"] }); },
  });

  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return (leads.data ?? []).filter((l) =>
      (stage === "todos" || l.stage === stage) && (!t || l.name.toLowerCase().includes(t) || l.company.toLowerCase().includes(t)));
  }, [leads.data, q, stage]);

  const signOut = async () => { await supabase.auth.signOut(); location.href = "/"; };

  if (role.isLoading) return <p className="p-8">Carregando…</p>;
  if (!role.data?.isAdmin)
    return (
      <main className="mx-auto max-w-lg p-8">
        <h1 className="text-3xl uppercase">Acesso restrito</h1>
        <p className="mt-2 text-sm text-muted-foreground">A conta {role.data?.email} não tem permissão de administrador.</p>
        <button onClick={signOut} className="btn-line mt-6">Sair</button>
      </main>
    );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <a href="/"><Logo size="sm" /></a>
        <button onClick={signOut} className="btn-line !min-h-[40px] !text-sm">Sair</button>
      </div>
      <h1 className="mt-8 text-5xl uppercase">Pedidos</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        <input className="field max-w-sm" placeholder="Buscar por nome ou empresa" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="field max-w-[200px]" value={stage} onChange={(e) => setStage(e.target.value as StageId | "todos")}>
          <option value="todos">Todas as etapas</option>
          {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      {leads.isError && <p className="mt-4 text-destructive">Não foi possível carregar os pedidos.</p>}
      {update.isError && <p className="mt-4 text-destructive">Não foi possível salvar a alteração.</p>}
      <ul className="mt-6 divide-y divide-border border-y border-border">
        {list.map((l) => {
          const history = (leads.data ?? []).filter((o) => o.id !== l.id && (o.contact === l.contact || o.company.toLowerCase() === l.company.toLowerCase()));
          return (
            <li key={l.id} className="py-4">
              <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_auto] md:items-center">
                <button className="text-left" onClick={() => setOpen(open === l.id ? null : l.id)}>
                  <p className="font-semibold">{l.name} {l.is_client && <span className="ml-2 rounded-sm bg-gold px-2 py-0.5 text-xs text-deep">Cliente</span>}</p>
                  <p className="text-sm text-muted-foreground">{l.company} · {new Date(l.created_at).toLocaleString("pt-BR")}</p>
                </button>
                <p className="text-sm">{l.recommendation}</p>
                <select aria-label="Etapa" className="field !min-h-[40px]" value={l.stage} onChange={(e) => update.mutate({ id: l.id, stage: e.target.value as StageId, ...(e.target.value !== "fechado" ? { is_client: false } : {}) })}>
                  {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              {open === l.id && (
                <div className="mt-4 grid gap-4 rounded-md bg-plum/60 p-4 text-sm md:grid-cols-2">
                  <div className="space-y-1">
                    <p><b>Retorno:</b> {l.channel === "whatsapp" ? "WhatsApp" : "E-mail"} — {l.contact}</p>
                    <p><b>Interesse:</b> {l.package_interest}</p>
                    <p><b>Respostas:</b> {Object.entries((l.answers ?? {}) as Record<string, string>).map(([k, v]) => `${k}: ${v}`).join(" · ")}</p>
                    <p><b>Autorizou contato:</b> {l.consent ? "Sim" : "Não"}</p>
                    {canMarkClient(l.stage) && (
                      <label className="mt-2 flex items-center gap-2">
                        <input type="checkbox" className="h-5 w-5 accent-[color:var(--gold)]" checked={l.is_client} onChange={(e) => update.mutate({ id: l.id, is_client: e.target.checked })} />
                        Marcar contato como cliente
                      </label>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">Histórico</p>
                    <ul className="mt-1 space-y-1 text-muted-foreground">
                      {(events.data ?? []).map((ev) => <li key={ev.id}>{new Date(ev.created_at).toLocaleString("pt-BR")} — {ev.description.replace(/^Etapa: (.+)$/, (_, s) => `Etapa: ${stageLabel(s)}`)}</li>)}
                    </ul>
                    {history.length > 0 && (
                      <>
                        <p className="mt-3 font-semibold">Outros pedidos deste contato</p>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          {history.map((h) => <li key={h.id}>{new Date(h.created_at).toLocaleDateString("pt-BR")} — {h.recommendation} ({stageLabel(h.stage)})</li>)}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
        {leads.isSuccess && list.length === 0 && <li className="py-6 text-sm text-muted-foreground">Nenhum pedido encontrado.</li>}
      </ul>
    </main>
  );
}
