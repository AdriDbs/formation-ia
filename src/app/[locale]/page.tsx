import { getSession } from "@/lib/auth/session";
import { redirect } from "@/i18n/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();
  redirect({ href: session ? "/dashboard" : "/login", locale });
}
