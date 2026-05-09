import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAuditEmail(params: {
  to: string;
  totalMonthlySavings: number;
  topRecommendations: string[];
  auditId: string;
}): Promise<void> {
  const { to, totalMonthlySavings, topRecommendations, auditId } = params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://spendsight.vercel.app';

  const bodyLines = [
    'Hi,',
    '',
    `Your AI spend audit identified $${totalMonthlySavings.toFixed(0)}/mo in potential savings.`,
    '',
    'Top recommendations:',
    ...topRecommendations.slice(0, 2).map((r, i) => `${i + 1}. ${r}`),
    '',
    `View your full audit: ${appUrl}/audit/${auditId}`,
    '',
    'For high-savings cases, the Credex team may reach out about credit sourcing.',
    '',
    '— SpendSight',
  ];

  await resend.emails.send({
    from: 'SpendSight <audit@spendsight.credex.rocks>',
    to,
    subject: 'Your AI Spend Audit — SpendSight',
    text: bodyLines.join('\n'),
  });
}
