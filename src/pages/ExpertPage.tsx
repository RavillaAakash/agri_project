import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Send, CheckCircle2, UserCheck, MessageSquare, FileText } from 'lucide-react';
import { MetalButton } from '@/components/ui/MetalButton';

export const ExpertPage: React.FC = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [farmerNotes, setFarmerNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Agricultural Extension & Expert Review</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground">
          {t('nav.expert')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
          When AI diagnostic confidence is below 70%, or when symptoms exhibit complex atypical necrosis, request an escalation to human agronomists and plant pathology specialists.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-3xl bg-card border border-emerald-500/30 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 mx-auto flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Escalation Request Logged</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            Your case ticket #EXP-8291 has been dispatched to agricultural extension specialists covering your district. An agronomist will review your multi-angle photos and respond with verified guidance.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Farmer Name</label>
              <input
                type="text"
                required
                defaultValue="Aakash Ravilla"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Phone Number (SMS / WhatsApp Advisory)</label>
              <input
                type="tel"
                required
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Crop & Variety</label>
              <input
                type="text"
                required
                defaultValue="Chilli (Teja S17)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">District / Mandal</label>
              <input
                type="text"
                required
                defaultValue="Warangal, Telangana"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Detailed Observations & Fertilizer History</label>
            <textarea
              rows={4}
              required
              value={farmerNotes}
              onChange={(e) => setFarmerNotes(e.target.value)}
              placeholder="Describe what you observed: curling, yellowing, spotting, leaf drop, recent chemical sprays or irrigation status..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              Agricultural experts operate in partnership with university extension wings (KVKs & Rythu Vedikas). Response times typically range from 2 to 6 daylight hours.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit for Agronomist Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
