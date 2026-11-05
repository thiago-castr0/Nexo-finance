import type { Metadata } from "next";
import { NovaDesignSystem } from "@/components/nova/nova-design-system";

export const metadata: Metadata = {
  title: "Design System & UI Studio | Nexo Finance",
  description:
    "Catálogo visual interativo de cores, tipografia Inter, botões single-line e componentes do Nexo Finance.",
};

export default function DesignSystemPage() {
  return <NovaDesignSystem />;
}
