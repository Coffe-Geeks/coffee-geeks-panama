import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getFincaById } from "@/app/actions/finca";
import FincaFormClient from "./FincaFormClient";

export const dynamic = "force-dynamic";

export default async function FincaFormPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.role !== "admin") redirect("/login");

  const { id } = await params;
  const isNew = id === "new";
  const finca = isNew ? null : await getFincaById(id);

  if (!isNew && !finca) redirect("/admin/fincas");

  return <FincaFormClient finca={finca} />;
}
