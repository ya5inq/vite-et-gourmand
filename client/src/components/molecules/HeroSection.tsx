import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Phone } from 'lucide-react';

interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  cta_text?: string;
  cta_link?: string;
}

interface HeroSectionProps {
  content: HeroContent;
}

const HERO_IMAGE = 'https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&q=80';

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="relative min-h-[500px] sm:min-h-[600px] flex items-center py-12 sm:py-0">
      <Image
        src={HERO_IMAGE}
        alt="Plats gastronomiques"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl mx-auto sm:mx-0 text-center sm:text-left">
          <p className="text-primary font-semibold mb-2 sm:mb-4 tracking-wide uppercase text-sm sm:text-base">
            Traiteur à Bordeaux
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            {content.title ?? 'Vite & Gourmand'}
          </h1>
          {content.subtitle && (
            <p className="text-lg sm:text-2xl text-amber-300 font-medium mb-3 sm:mb-4">
              {content.subtitle}
            </p>
          )}
          {content.description && (
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              {content.description}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link
              href={content.cta_link ?? '/menus'}
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              {content.cta_text ?? 'Voir nos menus'}
              <ArrowRight size={18} className="sm:w-5 sm:h-5" />
            </Link>
            <a
              href="tel:0556000000"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/20 transition-colors border border-white/30"
            >
              <Phone size={18} className="sm:w-5 sm:h-5" />
              05 56 00 00 00
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
