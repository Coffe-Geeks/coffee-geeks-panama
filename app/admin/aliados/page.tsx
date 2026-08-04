import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getAllies } from "@/app/actions/ally";
import AlliesAdminClient from "./AlliesAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminAlliesPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const allies = await getAllies({ onlyActive: false });

  return <AlliesAdminClient allies={allies} />;
}
