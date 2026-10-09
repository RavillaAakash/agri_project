import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/profile/AuthContext';
import { Sprout, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Language } from '@/types/agricultural';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loginAsDemo } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState('Telangana');
  const [district, setDistrict] = useState('Warangal');
  const [language, setLanguage] = useState<Language>('te');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    if (mode === 'signin') {
      const res = await signIn(email, password);
      setIsSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        navigate('/dashboard');
      }
    } else {
      const res = await signUp(email, password, {
        fullName,
        phoneNumber,
        state,
        district,
        preferredLanguage: language,
      });
      setIsSubmitting(false);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setSuccessMsg('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1200);
      }
    }
  };

  const handleDemoLogin = (role: 'farmer' | 'expert') => {
    loginAsDemo(role);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-900/20">
            <Sprout className="w-6 h-6 text-emerald-100" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {mode === 'signin' ? 'Sign In to NS Agri AI Doctor' : 'Farmer Registration'}
          </h1>
          <p className="text-xs text-muted-foreground">
            {mode === 'signin'
              ? 'Access your field records, diagnostic history, and advisory alerts'
              : 'Join the evidence-based agricultural decision platform'}
          </p>
        </div>

        {/* Demo Account Switcher Cards */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/10 dark:bg-emerald-900/20 border border-emerald-600/30 text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold text-emerald-800 dark:text-emerald-300 text-[11px] uppercase tracking-wider">
            <span>Instant Demo Logins</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/20">1-Click Test</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('farmer')}
              className="px-3 py-2 rounded-xl bg-background border border-border hover:border-emerald-600 font-semibold text-xs text-foreground text-left shadow-2xs transition-colors"
            >
              🌱 Demo Farmer
              <span className="block text-[10px] text-muted-foreground font-normal">Warangal, Telangana</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('expert')}
              className="px-3 py-2 rounded-xl bg-background border border-border hover:border-emerald-600 font-semibold text-xs text-foreground text-left shadow-2xs transition-colors"
            >
              🎓 Agronomist
              <span className="block text-[10px] text-muted-foreground font-normal">PJTSAU Scientist</span>
            </button>
          </div>
        </div>

        {/* Auth Form Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-lg space-y-5">
          {/* Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-muted/50 border border-border text-xs font-semibold">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signin' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signup' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground'
              }`}
            >
              Register Farmer
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Full Name (పేరు)</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Aakash Ravilla"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Phone Number (ఫోన్ నంబర్)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98490 00000"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">State</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-2.5 py-2 text-xs rounded-xl border border-border bg-background"
                    >
                      <option value="Telangana">Telangana</option>
                      <option value="Andhra Pradesh">Andhra Pradesh</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">District</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="e.g. Warangal"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Advisory Language (భాష)</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-border bg-background"
                  >
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                {mode === 'signin' ? 'Sign In to Dashboard' : 'Register Farmer Account'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="pt-2 border-t border-border text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm data secured with PostgreSQL Row Level Security (RLS)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
