import { ParticipantShell } from "@/components/participant-shell";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ParticipantShell>{children}</ParticipantShell>;
}
