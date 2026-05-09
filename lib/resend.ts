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

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { background-color: #050709; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 60px 20px; }
    .header { margin-bottom: 48px; text-align: center; }
    .logo { color: #63d296; font-size: 22px; font-weight: 800; letter-spacing: 0.1em; text-decoration: none; }
    .card { background: #0c0e12; border: 1px solid #1a1d23; border-radius: 16px; padding: 40px; margin-bottom: 24px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 20px; }
    .savings { font-size: 56px; font-weight: 800; color: #63d296; margin-bottom: 4px; line-height: 1; }
    .subtitle { color: #94a3b8; font-size: 15px; margin-bottom: 40px; }
    .recs-container { text-align: left; background: #050709; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #1a1d23; }
    .recs-title { font-size: 12px; font-weight: 700; color: #ffffff; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
    .rec-item { color: #94a3b8; font-size: 14px; margin-bottom: 12px; line-height: 1.5; position: relative; padding-left: 20px; }
    .rec-item::before { content: "→"; position: absolute; left: 0; color: #63d296; font-weight: bold; }
    .btn { display: inline-block; background-color: #63d296; color: #050709 !important; padding: 16px 32px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px; letter-spacing: 0.02em; }
    .footer { text-align: center; color: #475569; font-size: 11px; margin-top: 48px; letter-spacing: 0.01em; line-height: 1.6; }
    .hr { border: 0; border-top: 1px solid #1a1d23; margin: 40px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><span class="logo">SPENDSIGHT</span></div>
    <div class="card">
      <div class="label">Potential Savings Identified</div>
      <div class="savings">$${totalMonthlySavings.toFixed(0)}</div>
      <div class="subtitle">per month in AI optimization</div>
      
      <div class="recs-container">
        <div class="recs-title">Key Insights</div>
        ${topRecommendations.slice(0, 3).map(r => `<div class="rec-item">${r}</div>`).join('')}
      </div>
      
      <a href="${appUrl}/audit/${auditId}" class="btn">ACCESS FULL REPORT</a>
    </div>
    <div class="footer">
      © 2026 SpendSight by Credex. <br>
      High-Performance AI Spend Analytics. <br>
      <div style="margin-top: 12px; color: #334155;">Confidential Audit Report</div>
    </div>
  </div>
</body>
</html>
  `;

  await resend.emails.send({
    from: 'SpendSight <onboarding@resend.dev>',
    to,
    subject: `SpendSight Audit: $${totalMonthlySavings.toFixed(0)}/mo Savings Identified`,
    html,
  });
}
