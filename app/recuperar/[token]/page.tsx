import { isResetTokenValid } from "@/app/actions/password";
import ResetPasswordClient from "./ResetPasswordClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nueva contraseña | Coffee Geeks Panamá",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const valid = await isResetTokenValid(token);

  return <ResetPasswordClient token={token} valid={valid} />;
}
