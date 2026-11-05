import type { Metadata } from "next";
import { headers } from "next/headers";
import { DesignSystemShowcase } from "@/components/design-system/design-system-showcase";
import { NovaDesignSystem } from "@/components/nova/nova-design-system";

export const metadata: Metadata = {
  title: "Design System & UI Studio | Nexo Finance",
  description:
    "Catálogo visual interativo de cores, tipografia Inter, botões single-line e componentes do Nexo Finance.",
};

export default async function DesignSystemPage() {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "";
  const forwardedPort = hdrs.get("x-nexo-port") ?? "";
  const isPort3001 = host.includes("3001") || forwardedPort === "3001";

  if (isPort3001) {
    return <NovaDesignSystem />;
  }

  return <DesignSystemShowcase />;
}
