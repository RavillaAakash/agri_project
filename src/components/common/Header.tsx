import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/profile/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  Sprout,
  Menu,
  X,
  ShieldAlert,
  BookOpen,
  Stethoscope,
  MessageSquare,
  LayoutDashboard,
  CloudSun,
  User,
  LogOut,
  LogIn
} from 'lucide-react';

export const Header: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { profile, signOut } = useAuth();
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
        <Link to="/" className="flex items-center gap-3 shrink-0 group select-none py-1">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-900/25 ring-2 ring-emerald-500/20 group-hover:scale-105 group-hover:ring-emerald-500/40 transition-all shrink-0">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <div className="flex items-center gap-2 whitespace-nowrap leading-none">
              <span className="text-lg sm:text-xl font-black tracking-tight text-foreground font-sans">
                NS Agri <span className="bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs">
                Doctor
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-muted-foreground whitespace-nowrap tracking-tight leading-none hidden md:block pt-1">
              {t('app.tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
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
        <div className="flex items-center gap-2.5">
          <LanguageSwitcher />

          {/* Profile Badge or Login */}
          {profile ? (
            <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-border/80">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted/60 border border-border hover:bg-muted transition-colors text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {profile.fullName.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-foreground leading-tight truncate max-w-[110px]">
                    {profile.fullName}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 capitalize">
                    {profile.role} • {profile.district}
                  </div>
                </div>
              </Link>

              <button
                type="button"
                onClick={signOut}
                title="Sign Out"
                className="p-1.5 text-muted-foreground hover:text-rose-600 rounded-lg hover:bg-muted transition-colors"
                aria-label="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-background/98 px-4 pt-2 pb-4 space-y-2">
          {profile && (
            <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                  {profile.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-foreground">{profile.fullName}</div>
                  <div className="text-[10px] text-muted-foreground">{profile.district}, {profile.state}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="text-xs text-rose-600 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          )}

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

          {!profile && (
            <div className="pt-2 border-t border-border">
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
