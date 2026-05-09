import { ImageResponse } from 'next/og';
import { createServerSupabaseClient } from '@/lib/supabase';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string } }) {
  const { id } = params;
  let savings = 0;
  let toolCount = 0;

  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase
      .from('audits')
      .select('total_monthly_savings, tool_results')
      .eq('id', id)
      .single();

    if (data) {
      savings = data.total_monthly_savings;
      toolCount = (data.tool_results as unknown[]).length;
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#080b11',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '800px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(99,210,150,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Logo */}
        <div style={{ color: '#63d296', fontSize: '20px', fontWeight: 700, marginBottom: '40px', letterSpacing: '0.05em' }}>
          SPENDSIGHT
        </div>

        {/* Main number */}
        <div style={{ fontSize: savings > 0 ? '96px' : '64px', fontWeight: 800, color: '#63d296', lineHeight: 1, marginBottom: '16px' }}>
          {savings > 0 ? `$${savings.toFixed(0)}/mo` : '✓ Optimized'}
        </div>

        <div style={{ fontSize: '24px', color: '#8b99b0', marginBottom: '48px' }}>
          {savings > 0
            ? `savings identified across ${toolCount} AI tool${toolCount !== 1 ? 's' : ''}`
            : 'AI stack fully optimized'}
        </div>

        {/* Footer */}
        <div style={{ fontSize: '16px', color: '#4a5568', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', width: '600px', textAlign: 'center' }}>
          spendsight.credex.rocks · Free AI spend audit for startups
        </div>
      </div>
    ),
    { ...size }
  );
}
