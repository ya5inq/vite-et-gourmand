import Link from 'next/link';
import { getServerPublicApi } from '@/lib/api/server';

const DAY_NAMES = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
];

interface FooterInfo {
  company_name?: string;
  siret?: string;
  address?: string;
  description?: string;
}

interface ContactInfo {
  email?: string;
  phone?: string;
  address?: string;
}

export async function Footer() {
  const api = getServerPublicApi();

  // Operating hours + footer/info + contact/content. Tolerate individual
  // failures so the footer always renders with sensible defaults.
  const [hoursRes, footerRes, contactRes] = await Promise.allSettled([
    api.publicOperatingHoursGetAll(),
    api.publicPageContentGet({ page: 'footer', section: 'info' }),
    api.publicPageContentGet({ page: 'contact', section: 'content' }),
  ]);

  const hours =
    hoursRes.status === 'fulfilled'
      ? [...hoursRes.value.data.items].sort((a, b) => a.dayOfWeek - b.dayOfWeek)
      : [];

  const footer: FooterInfo =
    footerRes.status === 'fulfilled'
      ? ((footerRes.value.data.items[0]?.content as FooterInfo) ?? {})
      : {};

  const contact: ContactInfo =
    contactRes.status === 'fulfilled'
      ? ((contactRes.value.data.items[0]?.content as ContactInfo) ?? {})
      : {};

  const address = footer.address ?? contact.address ?? 'Bordeaux, France';
  const email = contact.email ?? 'contact@viteetgourmand.fr';
  const phone = contact.phone ?? '05 56 00 00 00';

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Company info */}
          <div>
            <h3 className="text-lg font-bold mb-4">{footer.company_name ?? 'Vite & Gourmand'}</h3>
            <p className="text-sm text-gray-400 mb-4">
              {footer.description ??
                'Votre traiteur d’exception à Bordeaux. Des menus raffinés pour tous vos évènements.'}
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p>{address}</p>
              <p>{email}</p>
              <p>{phone}</p>
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
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-400 hover:text-background transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-400 hover:text-background transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Operating hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">Horaires</h3>
            {hours.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {hours.map((hour) => (
                  <li key={hour.id} className="flex justify-between text-gray-400">
                    <span>{DAY_NAMES[hour.dayOfWeek] ?? `Jour ${hour.dayOfWeek}`}</span>
                    <span>
                      {hour.isClosed
                        ? 'Fermé'
                        : `${hour.openTime?.slice(0, 5) ?? ''} - ${hour.closeTime?.slice(0, 5) ?? ''}`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-1 text-sm text-gray-400">
                <li className="flex justify-between"><span>Lundi - Vendredi</span><span>9h - 18h</span></li>
                <li className="flex justify-between"><span>Samedi</span><span>10h - 17h</span></li>
                <li className="flex justify-between"><span>Dimanche</span><span>Fermé</span></li>
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Vite &amp; Gourmand. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
