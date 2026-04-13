import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Dashboard | AutoYield AI Optimizer",
  description: "Yield opportunities, AI recommendation, and preferences",
};

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
