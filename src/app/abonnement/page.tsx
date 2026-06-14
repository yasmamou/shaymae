"use client";

import Link from "next/link";
import { AccountButton } from "@/components/AccountButton";

const PLANS = [
  {
    name: "Découverte", price: "Gratuit", highlight: false,
    features: ["Profil & galerie", "Réservations en ligne", "Messagerie cliente", "3 publications / mois", "Statistiques de base"],
    cta: "Commencer",
  },
  {
    name: "Premium", price: "29.–/mois", highlight: true,
    features: ["Tout Découverte", "Publications illimitées + stories", "Agenda multi-collaboratrices", "Statistiques avancées & CA", "Mise en avant dans la recherche", "Badge Premium ✨", "Liste d'attente automatique"],
    cta: "Passer Premium",
  },
];

export default function AbonnementPage() {
  return (
    <div className="min-h-[100dvh] px-5 pb-32 pt-[max(16px,env(safe-area-inset-top))]">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">Développez votre activité</h1>
          <p className="text-[12px] text-ink-soft">Des outils pensés pour les professionnelles de la beauté</p>
        </div>
        <span className="lg:hidden"><AccountButton /></span>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PLANS.map((p) => (
          <div key={p.name} className={`rounded-[2rem] border p-6 shadow-float ${p.highlight ? "border-or-rose bg-gradient-to-b from-rose/40 to-blanc" : "border-line bg-blanc/70"}`}>
            {p.highlight && <span className="mb-2 inline-block rounded-full bg-ink px-3 py-1 text-[10px] font-bold text-blanc">LE PLUS POPULAIRE</span>}
            <h2 className="font-display text-2xl font-bold text-ink">{p.name}</h2>
            <p className="mt-1 font-display text-3xl font-bold text-gradient-gold">{p.price}</p>
            <ul className="mt-4 space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-[13px] text-ink">
                  <span className="text-sauge">✓</span> {f}
                </li>
              ))}
            </ul>
            <button className={`mt-5 w-full rounded-full py-3 text-sm font-bold shadow-soft ${p.highlight ? "bg-gradient-to-r from-rose-deep to-or-rose text-white" : "bg-ink text-blanc"}`}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Mini emoji="🚀" title="Mise en avant" text="Remontez en tête des recherches et boostez une prestation." />
        <Mini emoji="🤝" title="Commission" text="Modèle sans abonnement : petite commission sur réservation (optionnel)." />
        <Mini emoji="🎓" title="Formatrices" text="Vendez vos formations et certifications directement sur la plateforme." />
      </section>

      <p className="mt-6 text-center text-[12px] text-ink-soft">
        Vous êtes cliente ? <Link href="/" className="font-semibold text-ink underline">Découvrir les créatrices</Link>
      </p>
    </div>
  );
}

function Mini({ emoji, title, text }: { emoji: string; title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-line bg-blanc/70 p-4">
      <span className="text-2xl">{emoji}</span>
      <p className="mt-1 text-sm font-bold text-ink">{title}</p>
      <p className="text-[12px] text-ink-soft">{text}</p>
    </div>
  );
}
