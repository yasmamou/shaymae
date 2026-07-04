import type { DaySlots } from "./data";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface Availability {
  days: Record<DayKey, boolean>;
  from: string; // "09:00"
  to: string; // "19:00"
  slotMinutes: number; // ex. 60
  blocked: string[]; // dates ISO "yyyy-mm-dd"
}

export const DEFAULT_AVAILABILITY: Availability = {
  days: { mon: true, tue: true, wed: true, thu: true, fri: true, sat: true, sun: false },
  from: "09:00",
  to: "19:00",
  slotMinutes: 60,
  blocked: [],
};

export const DAY_KEYS: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]; // index = getUTCDay()
export const DAY_LABELS_FR: Record<DayKey, string> = {
  mon: "Lundi", tue: "Mardi", wed: "Mercredi", thu: "Jeudi", fri: "Vendredi", sat: "Samedi", sun: "Dimanche",
};
const SHORT = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Calcule les créneaux disponibles jour par jour à partir d'une config + créneaux déjà pris. */
export function computeSlots(
  av: Availability,
  fromMs: number,
  days: number,
  booked: Set<string> // "date|slot"
): DaySlots[] {
  const out: DaySlots[] = [];
  const start = Math.max(toMin(av.from), 0);
  const end = Math.min(toMin(av.to), 24 * 60);
  const step = Math.max(15, av.slotMinutes || 60);

  for (let i = 0; i < days; i++) {
    const d = new Date(fromMs + i * 86400000);
    const dow = d.getUTCDay();
    const key = DAY_KEYS[dow];
    const date = d.toISOString().slice(0, 10);
    const isOpen = av.days[key] && !av.blocked.includes(date);
    const slots: string[] = [];
    if (isOpen) {
      for (let m = start; m + step <= end; m += step) {
        const slot = fromMin(m);
        if (!booked.has(`${date}|${slot}`)) slots.push(slot);
      }
    }
    out.push({ date, dayLabel: `${SHORT[dow]} ${d.getUTCDate()}`, slots });
  }
  return out;
}
