import Image from 'next/image';
import { Leaf, Heart, Recycle, Handshake, type LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Leaf,
  Heart,
  Recycle,
  Handshake,
};

const VALUE_COLORS: Record<string, string> = {
  Leaf: 'bg-green-500',
  Heart: 'bg-red-500',
  Recycle: 'bg-blue-500',
  Handshake: 'bg-amber-500',
};

interface ValuesContent {
  title?: string;
  subtitle?: string;
  items?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
}

interface ValuesSectionProps {
  content: ValuesContent;
}

const VALUES_IMAGE = 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80';

export function ValuesSection({ content }: ValuesSectionProps) {
  const items = content.items ?? [];

  if (items.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative h-56 sm:h-80 lg:h-[450px] rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
            <Image
              src={VALUES_IMAGE}
              alt="Nos valeurs"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="order-1 lg:order-2">
            {content.title && (
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 sm:mb-6 text-center lg:text-left">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 text-center lg:text-left">{content.subtitle}</p>
            )}

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {items.map((item, index) => {
                const IconComponent = item.icon ? ICON_MAP[item.icon] : null;
                const colorClass = item.icon ? VALUE_COLORS[item.icon] : 'bg-primary';

                return (
                  <div
                    key={index}
                    className="bg-card rounded-xl p-3 sm:p-4 border border-border hover:shadow-md transition-shadow"
                  >
                    {IconComponent && (
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colorClass} rounded-lg flex items-center justify-center mb-2 sm:mb-3`}>
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                    {item.title && (
                      <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base">{item.title}</h3>
                    )}
                    {item.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-none">{item.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
