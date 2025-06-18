import { Suspense } from 'react';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturesSection } from '@/components/sections/features-section';
import { StatsSection } from '@/components/sections/stats-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { CTASection } from '@/components/sections/cta-section';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
      </Suspense>
      <Footer />
    </main>
  );
}