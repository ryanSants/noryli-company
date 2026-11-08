import { Instagram, Mail, MessageCircle } from "lucide-react";
import { site } from "@/config/site";
import { Logo } from "./Logo";

export function Footer() {
  const c = site.contacts;
  return (
    <footer id="contato" aria-labelledby="contato-t" className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 md:grid-cols-2 md:px-8">
        <div>
          <h2 id="contato-t" className="text-[clamp(2.4rem,5vw,4rem)] uppercase">Vamos conversar.</h2>
          <ul className="mt-6 space-y-3 text-sm">
            {c.whatsapp && <li><a className="tap inline-flex items-center gap-3 hover:text-gold" href={`https://wa.me/${c.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} className="text-gold" /> {c.whatsappLabel}</a></li>}
            {c.email && <li><a className="tap inline-flex items-center gap-3 hover:text-gold" href={`mailto:${c.email}`}><Mail size={18} className="text-gold" /> {c.email}</a></li>}
            {c.instagram && <li><a className="tap inline-flex items-center gap-3 hover:text-gold" href={`https://instagram.com/${c.instagram}`} target="_blank" rel="noopener noreferrer"><Instagram size={18} className="text-gold" /> @{c.instagram}</a></li>}
          </ul>
        </div>
        <div className="flex flex-col items-start justify-end gap-4 md:items-end">
          <Logo />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {site.name}</p>
          <a href="/admin" className="text-xs text-muted-foreground hover:text-ivory">Área da equipe</a>
        </div>
      </div>
    </footer>
  );
}
