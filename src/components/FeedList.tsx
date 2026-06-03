"use client";

import { FEED, type FeedItem } from "@/lib/data";
import { useAuth } from "./AuthProvider";
import { FeedCard, type FeedAuthor } from "./FeedCard";

export function FeedList() {
  const { posts, user } = useAuth();

  const studioItems: { item: FeedItem; author: FeedAuthor }[] = posts.map((p) => ({
    item: {
      id: "studio-" + p.id,
      creatorSlug: "",
      media: { id: p.id, category: p.category, seed: p.seed, label: p.label },
      caption: p.caption || p.label,
      likes: 0,
    },
    author: {
      name: user?.name ?? "Votre studio",
      city: user?.city,
      mode: user?.mode,
      badge: "Votre publication",
      profileHref: "/studio",
    },
  }));

  return (
    <>
      {studioItems.map(({ item, author }) => (
        <FeedCard key={item.id} item={item} author={author} />
      ))}
      {FEED.map((item) => (
        <FeedCard key={item.id} item={item} />
      ))}
    </>
  );
}
