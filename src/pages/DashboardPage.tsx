import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/profile/AuthContext';
import { LayoutDashboard, Plus, MapPin, Calendar, Activity, CheckCircle, AlertTriangle, ShieldAlert, User } from 'lucide-react';
import type { FarmRecord } from '@/types/agricultural';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const farm: FarmRecord = {
    id: 'f-01',
    name: profile ? `${profile.fullName}'s Farm Holding` : 'Suryapet Organic & Smart Acreage',
    location: profile ? `${profile.district} Field Block` : 'Suryapet Mandal',
    district: profile?.district || 'Warangal',
    state: (profile?.state as 'Telangana' | 'Andhra Pradesh') || 'Telangana',
    total_acres: 8.5,
    crops: [
      {
        crop_id: 'paddy',
        crop_name: 'Paddy (BPT 5204 - Samba Mahsuri)',
        variety: 'Samba Mahsuri',
        planting_date: '2026-07-15',
        stage: 'Panicle Emergence',
        health_status: 'good',
      },
      {
        crop_id: 'cotton',
        crop_name: 'Cotton (Bt Hybrid RCH-659)',
        variety: 'RCH-659',
        planting_date: '2026-06-28',
        stage: 'Square & Boll Formation',
        health_status: 'moderate',
      },
      {
        crop_id: 'chilli',
        crop_name: 'Chilli (Teja Variety)',
        variety: 'Teja S17',
        planting_date: '2026-08-10',
        stage: 'Vegetative & Early Flowering',
        health_status: 'at_risk',
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Farmer Operations & Field Tracking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground mt-1">
            {farm.name}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {farm.district}, {farm.state} • {farm.total_acres} Total Acres
          </p>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> {t('farm.add_field')}
        </button>
      </div>

      {/* Field Health Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {farm.crops.map((c, idx) => {
          const isAtRisk = c.health_status === 'at_risk';
          const isModerate = c.health_status === 'moderate';

          return (
            <div
              key={idx}
              className={`p-6 rounded-2xl border bg-card shadow-xs space-y-4 flex flex-col justify-between ${
                isAtRisk
                  ? 'border-rose-400/50 bg-rose-950/5'
                  : isModerate
                  ? 'border-amber-400/50 bg-amber-950/5'
                  : 'border-emerald-500/30'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Field #{idx + 1}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                      isAtRisk
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : isModerate
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}
                  >
                    {isAtRisk ? (
                      <>
                        <AlertTriangle className="w-3.5 h-3.5" /> High Risk
                      </>
                    ) : isModerate ? (
                      <>
                        <Activity className="w-3.5 h-3.5" /> Monitor Closely
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Thriving
                      </>
                    )}
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground">{c.crop_name}</h3>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">Current Stage:</span> {c.stage}
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Sowing Date:</span> {c.planting_date}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Scanned: 2 days ago</span>
                <button
                  type="button"
                  className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                >
                  View History
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Feed */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          {t('farm.active_advisories')}
        </h2>

        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-rose-900 dark:text-rose-200">
                Action Alert: Chilli Thrips & Moisture Stress in Block 3
              </span>
              <p className="text-muted-foreground">
                Dry westerly winds detected. Install 25 blue sticky traps per acre immediately and apply border row barrier scouting.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-emerald-900 dark:text-emerald-200">
                Paddy Panicle Health Normal
              </span>
              <p className="text-muted-foreground">
                No blast sporulation reported in Warangal/Suryapet cluster. Maintain 2-3 cm shallow water depth during flowering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
