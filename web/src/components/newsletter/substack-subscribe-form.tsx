'use client'

import { Card } from '@/components/ui/card'

interface SubstackSubscribeFormProps {
  subdomain?: string
  variant?: 'default' | 'card' | 'button'
  className?: string
}

/**
 * Substack Subscribe Form Component
 *
 * Embeds the Substack newsletter signup form.
 *
 * @param subdomain - Your Substack publication subdomain (e.g., "benihsaham" for benihsaham.substack.com)
 *                    Falls back to NEXT_PUBLIC_SUBSTACK_SUBDOMAIN env var or placeholder
 * @param variant - Display style: 'default' (full width), 'card' (boxed), or 'button' (minimal)
 * @param className - Additional CSS classes for styling
 */
export function SubstackSubscribeForm({
  subdomain = process.env.NEXT_PUBLIC_SUBSTACK_SUBDOMAIN || 'benihsaham',
  variant = 'card',
  className = '',
}: SubstackSubscribeFormProps) {
  const substackUrl = `https://${subdomain}.substack.com`

  if (variant === 'button') {
    return (
      <div className={`w-full ${className}`}>
        <a
          href={substackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
          </svg>
          Berlangganan Newsletter
        </a>
      </div>
    )
  }

  const iframeContent = variant === 'card' ? (
    <Card className="overflow-hidden border-green-100 bg-gradient-to-br from-green-50 to-white p-6 md:p-8">
      <div className="mb-4 text-center">
        <h3 className="text-xl font-bold text-gray-900">Berlangganan BenihSaham Newsletter</h3>
        <p className="mt-2 text-sm text-gray-600">
          Dapatkan edukasi value investing langsung ke inbox Anda. Gratis, padat, dan praktis.
        </p>
      </div>
      <div className="substack-embed-container">
        <iframe
          src={`${substackUrl}/embed`}
          width="100%"
          height="120"
          style={{
            border: '1px solid #EEE',
            background: 'white',
            borderRadius: '4px',
          }}
          title="Subscribe to BenihSaham on Substack"
          className="w-full"
        />
      </div>
      <p className="mt-4 text-center text-xs text-gray-500">
        Bergabung dengan ratusan investor IDX lainnya. Tanpa spam, janji.
      </p>
    </Card>
  ) : (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">Berlangganan BenihSaham Newsletter</h3>
        <p className="mt-2 text-sm text-gray-600">
          Dapatkan edukasi value investing langsung ke inbox Anda. Gratis, padat, dan praktis.
        </p>
      </div>
      <iframe
        src={`${substackUrl}/embed`}
        width="100%"
        height="120"
        style={{
          border: '1px solid #EEE',
          background: 'white',
          borderRadius: '4px',
        }}
        title="Subscribe to BenihSaham on Substack"
        className="w-full"
      />
    </div>
  )

  return <div className={`w-full ${className}`}>{iframeContent}</div>
}
