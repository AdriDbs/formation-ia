import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.onboardingComplete) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4">
      <div className="mb-8 flex items-center gap-2">
        <span className="h-2.5 w-2.5 bg-accent" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">
          Formation IA
        </span>
      </div>
      <OnboardingForm />
    </main>
  );
}
