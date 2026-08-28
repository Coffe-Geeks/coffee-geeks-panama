import { getNewsletterEmails } from "@/app/actions/newsletter";
import NewsletterManager from "./NewsletterManager";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const sParams = await searchParams;
  const search = sParams.search || "";
  const page = parseInt(sParams.page || "1");
  const limit = 50;

  const { emails, totalPages, totalCount } = await getNewsletterEmails(search, page, limit);

  return (
    <NewsletterManager
      initialEmails={emails}
      totalPages={totalPages}
      totalCount={totalCount}
      currentPage={page}
      initialSearch={search}
    />
  );
}
