import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[100dvh] place-items-center px-8 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-gradient-gold">404</p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink">
          Cette page s&apos;est envolée ✨
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          La créatrice ou la page que vous cherchez n&apos;existe pas (encore).
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full bg-gradient-to-r from-rose-deep to-or-rose px-6 py-3 text-sm font-bold text-white shadow-soft"
        >
          Retour au feed
        </Link>
      </div>
    </div>
  );
}
