import { headers } from "next/headers";
import { NexoDashboard } from "@/components/dashboard/nexo-dashboard";
import { NexoNovaApp } from "@/components/nova/nexo-nova-app";

export default async function HomePage() {
  const hdrs = await headers();
  const host = hdrs.get("host") ?? "";
  const forwardedPort = hdrs.get("x-nexo-port") ?? "";
  const isPort3001 = host.includes("3001") || forwardedPort === "3001";

  if (isPort3001) {
    return <NexoNovaApp />;
  }

  return <NexoDashboard />;
}
