import { createElement } from "react";
import {
  House,
  Ruler,
  Car,
  Trees,
  Warehouse,
  BrickWall,
  Sun,
  FileText,
  Coins,
  Scale,
  HardHat,
  Map,
  Waves,
  Building2,
  TriangleAlert,
  Receipt,
  Target,
  Zap,
  CircleCheck,
  ShieldCheck,
  Clock,
  Phone,
  Globe,
  Check,
  type LucideIcon,
} from "lucide-react";

/**
 * Centralt ikon-register. ENDAST denna fil importerar lucide-react.
 * Datafiler och komponenter refererar ikoner via semantiska strängnycklar
 * (t.ex. "house"), aldrig via emoji eller direkta lucide-komponenter.
 */
export const iconMap = {
  // Åtgärder
  house: House,
  ruler: Ruler,
  car: Car,
  trees: Trees,
  warehouse: Warehouse,
  "brick-wall": BrickWall,
  sun: Sun,
  // Guider
  "file-text": FileText,
  coins: Coins,
  scale: Scale,
  "hard-hat": HardHat,
  map: Map,
  waves: Waves,
  "building-2": Building2,
  "triangle-alert": TriangleAlert,
  receipt: Receipt,
  // Konsult / trust / snabbinfo / badges
  target: Target,
  zap: Zap,
  "circle-check": CircleCheck,
  "shield-check": ShieldCheck,
  clock: Clock,
  phone: Phone,
  globe: Globe,
  check: Check,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  /** Override-bar. Standard: 20×20. */
  className?: string;
  strokeWidth?: number;
}

/**
 * Tunn wrapper kring lucide. Sätter aria-hidden (dekorativa ikoner bredvid text),
 * strokeWidth 2 och en standardstorlek som kan överskridas via className.
 */
export function Icon({ name, className = "w-5 h-5", strokeWidth = 2 }: IconProps) {
  const Cmp = iconMap[name];
  if (!Cmp) return null;
  return createElement(Cmp, { className, strokeWidth, "aria-hidden": true });
}
