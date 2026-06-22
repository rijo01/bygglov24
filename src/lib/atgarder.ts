import { getAllAtgarder } from "@/lib/content";
import type { IconName } from "@/lib/icons";

/**
 * Single source of truth for the åtgärd grid shown on BOTH the homepage and /atgard.
 * Which åtgärder exist is driven entirely by the MDX files in content/atgarder
 * (via getAllAtgarder). This map only layers on presentation metadata (icon,
 * short label/description, display order) — never facts/measurements.
 */
const ATGARD_DISPLAY: Record<
  string,
  { icon: IconName; label: string; shortDesc: string; order: number }
> = {
  attefallsatgard: { icon: "house", label: "Attefallsåtgärder", shortDesc: "Bygglovsbefriade komplementbyggnader", order: 1 },
  tillbyggnad: { icon: "ruler", label: "Tillbyggnad", shortDesc: "Utöka bostadsytan", order: 2 },
  "carport-garage": { icon: "car", label: "Carport & Garage", shortDesc: "Regler och undantag", order: 3 },
  "altan-uteplats": { icon: "trees", label: "Altan & Uteplats", shortDesc: "Bygga altan rätt", order: 4 },
  friggebod: { icon: "warehouse", label: "Friggebod", shortDesc: "Komplementbyggnad utan anmälan", order: 5 },
  "plank-mur": { icon: "brick-wall", label: "Plank & Mur", shortDesc: "Höjd och placering", order: 6 },
  solpaneler: { icon: "sun", label: "Solpaneler", shortDesc: "Oftast bygglovsbefriat", order: 7 },
};

export interface AtgardGridItem {
  slug: string;
  title: string;
  description: string;
  kravpaBuildlov: boolean;
  icon: IconName;
  label: string;
  shortDesc: string;
}

/** Returns the published åtgärder augmented with display metadata, in curated order. */
export function getAtgarderGrid(): AtgardGridItem[] {
  return getAllAtgarder()
    .map((a) => {
      const d = ATGARD_DISPLAY[a.slug];
      return {
        slug: a.slug,
        title: a.title,
        description: a.description,
        kravpaBuildlov: a.kravpaBuildlov,
        icon: d?.icon ?? "house",
        label: d?.label ?? a.title,
        shortDesc: d?.shortDesc ?? a.description,
        order: d?.order ?? 999,
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "sv"))
    .map(({ order: _order, ...rest }) => rest);
}
