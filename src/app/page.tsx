import Nav from '@/components/landing/Nav'
import Hero from '@/components/landing/Hero'
import SocialProof from '@/components/landing/SocialProof'
import Problem from '@/components/landing/Problem'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import Testimonials from '@/components/landing/Testimonials'
import Pricing from '@/components/landing/Pricing'
import FAQ from '@/components/landing/FAQ'
import Footer from '@/components/landing/Footer'
import RevealInit from '@/components/landing/RevealInit'

export default function LandingPage() {
  return (
    <>
      <RevealInit />
      <Nav />
      <main id="top">
        <Hero />
        <SocialProof />
        <Problem />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
