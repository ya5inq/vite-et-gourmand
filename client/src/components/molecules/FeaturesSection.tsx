import Image from 'next/image';
import { Award, Leaf, Truck, Sparkles } from 'lucide-react';

const FEATURE_IMAGES: Record<number, string> = {
  0: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&q=80',
  1: 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?w=400&q=80',
  2: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80',
  3: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80',
};

const FEATURE_COLORS: Record<number, string> = {
  0: 'bg-amber-500',
  1: 'bg-green-500',
  2: 'bg-blue-500',
  3: 'bg-purple-500',
};

interface FeaturesContent {
  title?: string;
  subtitle?: string;
  items?: Array<{
    icon?: string;
    title?: string;
    description?: string;
  }>;
}

interface FeaturesSectionProps {
  content: FeaturesContent;
}

export function FeaturesSection({ content }: FeaturesSectionProps) {
  const items = content.items ?? [];

  if (items.length === 0) return null;

  return (
    <section className="py-16 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {content.title}
            </h2>
            {content.subtitle && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item, index) => {
            const ICONS = [Award, Leaf, Truck, Sparkles];
            const IconComponent = ICONS[index] || Award;
            const imageUrl = FEATURE_IMAGES[index] || FEATURE_IMAGES[0];
            const colorClass = FEATURE_COLORS[index] || 'bg-primary';

            return (
              <div
                key={index}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={item.title || ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className={`absolute bottom-3 left-3 w-10 h-10 ${colorClass} rounded-xl flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  {item.title && (
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  )}
                  {item.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
