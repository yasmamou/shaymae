"use client";

import { useFollows } from "./FollowsProvider";

export function FollowButton({
  slug,
  size = "md",
  onDark = false,
}: {
  slug: string;
  size?: "sm" | "md";
  onDark?: boolean;
}) {
  const { isFollowing, toggle } = useFollows();
  const following = isFollowing(slug);
  const pad = size === "sm" ? "px-3 py-1.5 text-[12px]" : "px-5 py-2.5 text-sm";

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(slug); }}
      aria-pressed={following}
      className={`rounded-full font-bold transition active:scale-95 ${pad} ${
        following
          ? onDark
            ? "bg-white/20 text-white ring-1 ring-white/50"
            : "bg-creme text-ink-soft ring-1 ring-line"
          : "bg-gradient-to-r from-rose-deep to-or-rose text-white shadow-float"
      }`}
    >
      {following ? "✓ Suivi" : "+ Suivre"}
    </button>
  );
}
