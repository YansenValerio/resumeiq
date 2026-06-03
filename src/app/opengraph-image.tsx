import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ResumeIQ — Lolos ATS dalam 20 Detik'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background: '#0F172A',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(139,92,246,0.35) 0%, transparent 45%), radial-gradient(circle at 15% 90%, rgba(99,102,241,0.30) 0%, transparent 45%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Brand row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 700,
              color: 'white',
              background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
              borderRadius: 18,
              letterSpacing: -2,
            }}
          >
            IQ
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, color: 'white' }}>
            ResumeIQ
          </div>
        </div>

        {/* Headline + score ring */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 700 }}>
            <div
              style={{
                fontSize: 68,
                fontWeight: 800,
                color: 'white',
                lineHeight: 1.1,
                letterSpacing: -2,
              }}
            >
              Lolos ATS dalam
            </div>
            <div
              style={{
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: -2,
                background: 'linear-gradient(90deg, #818CF8 0%, #C4B5FD 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              20 detik.
            </div>
            <div style={{ fontSize: 30, color: '#94A3B8', marginTop: 28, lineHeight: 1.4 }}>
              AI resume analyzer & ATS score checker gratis untuk job seeker Indonesia.
            </div>
          </div>

          {/* Score ring */}
          <div
            style={{
              width: 230,
              height: 230,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background: 'conic-gradient(#10B981 0% 84%, rgba(255,255,255,0.10) 84% 100%)',
            }}
          >
            <div
              style={{
                width: 178,
                height: 178,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: '#0F172A',
              }}
            >
              <div style={{ fontSize: 76, fontWeight: 800, color: 'white' }}>84</div>
              <div style={{ fontSize: 22, color: '#10B981', fontWeight: 600 }}>
                ATS Score
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', fontSize: 26, color: '#64748B' }}>
          resumeiq.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
