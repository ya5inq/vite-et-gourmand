import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  BookOpen,
  Mail,
  Scale,
  PanelBottom,
  UtensilsCrossed,
  ChefHat,
  AlertTriangle,
  ShoppingCart,
  Star,
  Users,
  MapPin,
  MessageSquare,
  Clock,
  LogOut,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';

type NavItem = {
  label: string;
  icon: LucideIcon;
  to: string;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    title: 'Général',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    ],
  },
  {
    title: 'CMS',
    items: [
      { label: 'Accueil', icon: Home, to: '/cms/home' },
      { label: 'Page Menus', icon: BookOpen, to: '/cms/menu' },
      { label: 'Contact', icon: Mail, to: '/cms/contact' },
      { label: 'Pages légales', icon: Scale, to: '/cms/legal' },
      { label: 'Footer', icon: PanelBottom, to: '/cms/footer' },
    ],
  },
  {
    title: 'Métier',
    items: [
      { label: 'Menus', icon: UtensilsCrossed, to: '/menus' },
      { label: 'Plats', icon: ChefHat, to: '/dishes' },
      { label: 'Allergènes', icon: AlertTriangle, to: '/allergens' },
      { label: 'Commandes', icon: ShoppingCart, to: '/orders' },
      { label: 'Avis', icon: Star, to: '/reviews' },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Employés', icon: Users, to: '/users' },
      { label: 'Zones livraison', icon: MapPin, to: '/delivery-zones' },
      { label: 'Messages contact', icon: MessageSquare, to: '/contact-messages' },
      { label: 'Horaires', icon: Clock, to: '/operating-hours' },
    ],
  },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, signOut } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || user?.email
    : user?.email;

  const SidebarContent = () => (
    <>
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="text-lg font-bold text-primary">Vite & Gourmand</span>
        <span className="ml-2 text-xs text-muted-foreground">Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {(profile?.first_name?.[0] ?? user?.email?.[0] ?? '?').toUpperCase()}
          </div>
          <div className="flex-1 truncate">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted-foreground">{profile?.role ?? 'employee'}</p>
          </div>
          <button
            onClick={signOut}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-destructive"
            title="Se déconnecter"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex h-14 items-center border-b px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="ml-3 text-lg font-bold text-primary">Vite & Gourmand</span>
        </div>

        <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  );
};
