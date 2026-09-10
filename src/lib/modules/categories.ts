import {
  IconTerminal,
  IconSpark,
  IconPlug,
  IconCompass,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";
import type { ModuleWithStatus } from "./progress";

export const CATEGORY_ORDER = [
  "onboarding",
  "claude-code",
  "agents",
  "mastery",
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
};

export function groupByCategory(allModules: ModuleWithStatus[]) {
  const groups = new Map<string, ModuleWithStatus[]>();
  for (const module of allModules) {
    const list = groups.get(module.category) ?? [];
    list.push(module);
    groups.set(module.category, list);
  }

  return CATEGORY_ORDER.filter((id) => groups.has(id)).map((id) => ({
    id,
    modules: groups.get(id)!,
  }));
}
