import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Sprout, Menu, X, ShieldAlert, BookOpen, Stethoscope, MessageSquare, LayoutDashboard, CloudSun } from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('nav.home'), icon: Sprout },
    { to: '/diagnose', label: t('nav.diagnose'), icon: Stethoscope },
    { to: '/chat', label: t('nav.chatbot'), icon: MessageSquare },
    { to: '/library', label: t('nav.library'), icon: BookOpen },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { to: '/weather', label: t('nav.weather'), icon: CloudSun },
    { to: '/expert', label: t('nav.expert'), icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-900/10 dark:border-emerald-800/20 bg-background/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
              <span>AgriAI</span>
              <span className="text-xs px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300/40">
                Doctor
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              {t('app.tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-700/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background/98 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-700/10 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-semibold'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Icon className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
