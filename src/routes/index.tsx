import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header, Constellation } from "@/components/noryli/Header";
import { TableExperience } from "@/components/noryli/TableExperience";
import { Pains, Services } from "@/components/noryli/Services";
import { Connect } from "@/components/noryli/Connect";
import { BeforeAfter } from "@/components/noryli/BeforeAfter";
import { About } from "@/components/noryli/About";
import { Projects } from "@/components/noryli/Projects";
import { Packages } from "@/components/noryli/Packages";
import { Diagnostic } from "@/components/noryli/Diagnostic";
import { Footer } from "@/components/noryli/Footer";
import { store } from "@/lib/store";
import { isPreviewHost } from "@/config/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Noryli Company — Sites, automação, IA e Noryli Connect" },
      { name: "description", content: "Sites, atendimento automatizado, conteúdo com IA e cartões NFC para negócios que querem operar melhor. Faça o Diagnóstico Vivo." },
      { property: "og:title", content: "Noryli Company — tecnologia que faz o negócio avançar" },
      { property: "og:description", content: "Sites, automação, conteúdo com IA e Noryli Connect. Faça o Diagnóstico Vivo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    store.set({ isPreview: isPreviewHost(location.hostname) });
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { rootMargin: "0px 0px -10% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div className="grain" aria-hidden />
      <Header />
      <Constellation />
      <main>
        <TableExperience />
        <Pains />
        <Services />
        <Connect />
        <BeforeAfter />
        <About />
        <Projects />
        <Packages />
        <Diagnostic />
      </main>
      <Footer />
    </>
  );
}
