import { HomeScrollColumn } from "@/components/HomeScrollColumn";
import { DiscoverRail } from "@/components/DiscoverRail";

export default function HomePage() {
  return (
    <div className="lg:flex lg:gap-6 lg:px-6 lg:py-6">
      {/* Colonne feed immersif */}
      <HomeScrollColumn />

      {/* Rail découverte (desktop) */}
      <DiscoverRail />
    </div>
  );
}
