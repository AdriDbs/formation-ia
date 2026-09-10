import "server-only";
import { Resend } from "resend";

const FROM = process.env.RESEND_FROM_EMAIL ?? "Formation IA <onboarding@resend.dev>";

export async function sendOtpEmail(email: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    // Pas de clé configurée : on log le code pour pouvoir tester le flux en local.
    console.log(`[dev] Code de connexion pour ${email} : ${code}`);
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Votre code de connexion — Formation IA",
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #000000; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 18px; margin-bottom: 8px;">Formation IA</h1>
        <p style="font-size: 14px; color: #000000;">Voici votre code de connexion à usage unique :</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0; color: #000000;">${code}</p>
        <p style="font-size: 13px; color: #444444;">Ce code expire dans 10 minutes. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
        <hr style="border: none; border-top: 1px solid #E2E2E2; margin: 24px 0;" />
        <p style="font-size: 11px; color: #767676;">BearingPoint — Formation IA</p>
      </div>
    `,
  });
}
