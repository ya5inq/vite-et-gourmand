import Image from 'next/image';
import Link from 'next/link';
import { Phone, ArrowRight, Calendar, MessageCircle } from 'lucide-react';

const CTA_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80';

interface CtaSectionProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  phone?: string;
}

export function CtaSection({
  title = 'Votre evenement merite le meilleur',
  description = 'Commandez en ligne en quelques clics ou contactez-nous pour un devis personnalise.',
  ctaText = 'Commander en ligne',
  ctaLink = '/menus',
  phone = '05 56 00 00 00',
}: CtaSectionProps) {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      <Image
        src={CTA_IMAGE}
        alt="Restaurant gastronomique"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                href={ctaLink}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                {ctaText}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-white/20 transition-colors border border-white/30"
              >
                <MessageCircle size={18} />
                Demander un devis
              </Link>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Contactez-nous</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-white hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Phone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Telephone</p>
                    <p className="font-semibold text-sm">{phone}</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Calendar size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Disponibilite</p>
                    <p className="font-semibold text-sm">Lun - Sam, 9h - 18h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
