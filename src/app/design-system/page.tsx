import type { Metadata } from "next";
import { DesignSystemShowcase } from "@/components/design-system/design-system-showcase";

export const metadata: Metadata = {
  title: "Design System & UI Lab | Nexo Finance",
  description:
    "Catálogo visual interativo de cores, tipografia Inter, botões vazados e inputs do Nexo Finance.",
};

export default function DesignSystemPage() {
  return <DesignSystemShowcase />;
}
