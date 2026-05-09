'use client';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Button
        onClick={handleCopy}
        variant="outline"
        size="lg"
        style={{ transition: 'all 0.3s ease', minWidth: '200px' }}
      >
        {copied ? (
          <>
            <span style={{ color: 'var(--accent)' }}>✓</span> Link copied!
          </>
        ) : (
          <>🔗 Share this audit</>
        )}
      </Button>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--text-muted)',
          marginTop: '8px',
        }}
      >
        Personal details are never included in the shared link.
      </p>
    </div>
  );
}
