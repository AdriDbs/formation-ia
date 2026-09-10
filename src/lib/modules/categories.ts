import {
  IconTerminal,
  IconSpark,
  IconPlug,
  IconCompass,
  IconMap,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";
import type { ModuleWithStatus } from "./progress";

export const CATEGORY_ORDER = [
  "onboarding",
  "claude-code",
  "agents",
  "mastery",
  "day2",
] as const;

export type CategoryId = (typeof CATEGORY_ORDER)[number];

export const CATEGORY_ICONS: Record<
  CategoryId,
  ComponentType<SVGProps<SVGSVGElement>>
> = {
  onboarding: IconTerminal,
  "claude-code": IconSpark,
  agents: IconPlug,
  mastery: IconCompass,
  day2: IconMap,
};

export function groupByCategory(dayModules: ModuleWithStatus[]) {
  const groups = new Map<string, ModuleWithStatus[]>();
  for (const module of dayModules) {
    const list = groups.get(module.category) ?? [];
    list.push(module);
    groups.set(module.category, list);
  }

  return CATEGORY_ORDER.filter((id) => groups.has(id)).map((id) => ({
    id,
    modules: groups.get(id)!,
  }));
}
