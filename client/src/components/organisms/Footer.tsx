import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

const DAY_NAMES = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

export async function Footer() {
  const supabase = await createClient();

  const { data: hoursData } = await supabase
    .from('operating_hours')
    .select('*')
    .order('day_of_week');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hours = hoursData as any[] | null;

  const { data: footerContent } = await supabase
    .from('page_contents')
    .select('content')
    .eq('page', 'home')
    .eq('section', 'footer')
    .single();

  const footer = (footerContent as { content?: {
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
  } } | null)?.content ?? null;

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Company info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Vite &amp; Gourmand</h3>
            <p className="text-sm text-gray-400 mb-4">
              {footer?.description ??
                "Votre traiteur d'exception a Bordeaux. Des menus raffines pour tous vos evenements."}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              {(footer?.address ?? 'Bordeaux, France') && (
                <p>{footer?.address ?? 'Bordeaux, France'}</p>
              )}
              <p>{footer?.email ?? 'contact@viteetgourmand.fr'}</p>
              <p>{footer?.phone ?? '05 56 00 00 00'}</p>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/menus" className="text-gray-400 hover:text-background transition-colors">
                  Nos menus
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-background transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-gray-400 hover:text-background transition-colors">
                  Mentions legales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-400 hover:text-background transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-400 hover:text-background transition-colors">
                  Politique de confidentialite
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">Horaires</h3>
            {hours && hours.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {hours.map((hour) => (
                  <li key={hour.id} className="flex justify-between text-gray-400">
                    <span>{DAY_NAMES[hour.day_of_week] ?? `Jour ${hour.day_of_week}`}</span>
                    <span>
                      {hour.is_closed
                        ? 'Ferme'
                        : `${hour.open_time?.slice(0, 5) ?? ''} - ${hour.close_time?.slice(0, 5) ?? ''}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 text-sm text-gray-400">
                <li className="flex justify-between"><span>Lundi - Vendredi</span><span>9h - 18h</span></li>
                <li className="flex justify-between"><span>Samedi</span><span>9h - 13h</span></li>
                <li className="flex justify-between"><span>Dimanche</span><span>Ferme</span></li>
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Vite &amp; Gourmand. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
