import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/profile/AuthContext';
import {
  LayoutDashboard,
  Plus,
  MapPin,
  Calendar,
  Activity,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Leaf,
  Scan,
  Trash2,
  CheckSquare,
  Square,
  Clock,
  Sparkles,
  CloudSun,
  Droplets,
  ExternalLink,
  ChevronRight,
  Info,
} from 'lucide-react';
import type { FieldRecord, AgronomicTask } from '@/types/agricultural';
import {
  getStoredFields,
  saveStoredFields,
  getStoredTasks,
  saveStoredTasks,
} from '@/features/farm/farmService';
import { MetalButton } from '@/components/ui/MetalButton';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useAuth();

  const [fields, setFields] = useState<FieldRecord[]>([]);
  const [tasks, setTasks] = useState<AgronomicTask[]>([]);
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [selectedFieldForDetail, setSelectedFieldForDetail] = useState<FieldRecord | null>(null);

  // New field form state
  const [newCropName, setNewCropName] = useState('Paddy / Rice');
  const [newCropId, setNewCropId] = useState('paddy');
  const [newVariety, setNewVariety] = useState('RNR 15048 (Telangana Sona)');
  const [newAcres, setNewAcres] = useState('2.0');
  const [newStage, setNewStage] = useState('Tillering / పిలకల దశ');
  const [newSoilType, setNewSoilType] = useState('Clay Loam');
  const [newIrrigation, setNewIrrigation] = useState('Canal / Tube-well');

  useEffect(() => {
    setFields(getStoredFields());
    setTasks(getStoredTasks());
  }, []);

  const totalAcres = fields.reduce((sum, f) => sum + (Number(f.acres) || 0), 0);
  const atRiskFields = fields.filter((f) => f.health_status === 'at_risk');
  const healthyFields = fields.filter((f) => f.health_status === 'good');
  const moderateFields = fields.filter((f) => f.health_status === 'moderate');

  const handleUpdateHealth = (fieldId: string, newHealth: 'good' | 'moderate' | 'at_risk') => {
    const updated = fields.map((f) => (f.id === fieldId ? { ...f, health_status: newHealth } : f));
    setFields(updated);
    saveStoredFields(updated);
  };

  const handleDeleteField = (fieldId: string) => {
    if (window.confirm('Are you sure you want to remove this field block from your farm?')) {
      const updated = fields.filter((f) => f.id !== fieldId);
      setFields(updated);
      saveStoredFields(updated);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, is_completed: !t.is_completed } : t));
    setTasks(updated);
    saveStoredTasks(updated);
  };

  const handleAddFieldSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newField: FieldRecord = {
      id: 'fld-' + Date.now(),
      crop_id: newCropId,
      crop_name: newCropName,
      variety: newVariety,
      acres: parseFloat(newAcres) || 1.0,
      planting_date: new Date().toISOString().split('T')[0],
      stage: newStage,
      soil_type: newSoilType,
      irrigation_type: newIrrigation,
      health_status: 'good',
      last_scanned: 'Just added',
      notes: 'New active field block enrolled in AI Agri Doctor decision monitoring.',
    };

    const updated = [newField, ...fields];
    setFields(updated);
    saveStoredFields(updated);
    setIsAddFieldModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Farm Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Farm Holding Operations & Acreage Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {profile ? `${profile.fullName}'s Farm Holding` : 'Warangal Smart Acreage'}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            {profile?.mandal || 'Geesuagonda Mandal'}, {profile?.district || 'Warangal'}, {profile?.state || 'Telangana'} •{' '}
            <span className="font-semibold text-foreground">{totalAcres.toFixed(1)} Total Acres</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/weather')}
            className="px-3.5 py-2 rounded-xl bg-card hover:bg-muted border border-border text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CloudSun className="w-4 h-4 text-amber-500" />
            <span>View Weather Risk</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddFieldModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {t('farm.add_field')}
          </button>
        </div>
      </div>

      {/* Farm KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="text-xs text-muted-foreground font-semibold">Total Acreage</div>
          <div className="text-2xl font-black text-foreground">{totalAcres.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">Acres</span></div>
          <div className="text-[11px] text-emerald-600 font-medium">100% Geo-mapped</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="text-xs text-muted-foreground font-semibold">Active Fields</div>
          <div className="text-2xl font-black text-foreground">{fields.length} <span className="text-xs font-normal text-muted-foreground">Blocks</span></div>
          <div className="text-[11px] text-muted-foreground">Under continuous monitoring</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="text-xs text-muted-foreground font-semibold">Fields At Risk</div>
          <div className={`text-2xl font-black ${atRiskFields.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            {atRiskFields.length} <span className="text-xs font-normal text-muted-foreground">Alerts</span>
          </div>
          <div className="text-[11px] text-rose-500 font-medium">
            {atRiskFields.length > 0 ? 'Requires immediate IPM action' : 'All blocks stable'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-card border border-border shadow-xs space-y-1">
          <div className="text-xs text-muted-foreground font-semibold">IPM Compliance Score</div>
          <div className="text-2xl font-black text-emerald-600">92% <span className="text-xs font-normal text-muted-foreground">A+</span></div>
          <div className="text-[11px] text-muted-foreground">Zero banned chemicals</div>
        </div>
      </div>

      {/* Microclimate Outbreak Alert Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-amber-950 dark:text-amber-200">
              Weather Warning: High Humidity (88%) Spikes Blast & Thrips Vulnerability
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Relative humidity in your district has crossed the 85% threshold. Inspect Chilli and Paddy field canopies for early foliar symptoms.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('/weather')}
          className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 shrink-0 self-end sm:self-auto cursor-pointer"
        >
          Check Spray Window <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Field Holdings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-600" /> Monitored Crop Blocks ({fields.length})
          </h2>
          <span className="text-xs text-muted-foreground">Click card to view details or change health status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fields.map((field, idx) => {
            const isAtRisk = field.health_status === 'at_risk';
            const isModerate = field.health_status === 'moderate';

            return (
              <div
                key={field.id}
                className={`p-5 rounded-3xl border bg-card shadow-xs flex flex-col justify-between space-y-4 transition-all hover:shadow-md ${
                  isAtRisk
                    ? 'border-rose-400/60 bg-rose-950/5'
                    : isModerate
                    ? 'border-amber-400/60 bg-amber-950/5'
                    : 'border-emerald-500/30'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                      Block #{idx + 1} • {field.acres} Acres
                    </span>

                    {/* Interactive Health Status Selector */}
                    <select
                      value={field.health_status}
                      onChange={(e) =>
                        handleUpdateHealth(
                          field.id,
                          e.target.value as 'good' | 'moderate' | 'at_risk'
                        )
                      }
                      className={`text-xs px-2 py-0.5 rounded-full font-bold border-none outline-none cursor-pointer ${
                        isAtRisk
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : isModerate
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      <option value="good">🟢 Thriving</option>
                      <option value="moderate">🟡 Monitor Closely</option>
                      <option value="at_risk">🔴 High Risk</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">{field.crop_name}</h3>
                    <div className="text-xs text-muted-foreground font-medium">{field.variety}</div>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border/60">
                    <div>
                      <span className="font-semibold text-foreground">Current Stage:</span> {field.stage}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Soil Type:</span> {field.soil_type}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Irrigation:</span> {field.irrigation_type}
                    </div>
                  </div>

                  {field.notes && (
                    <div className="p-2.5 rounded-xl bg-muted/60 text-[11px] text-muted-foreground italic border border-border/50">
                      "{field.notes}"
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/diagnose')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700/10 hover:bg-emerald-700/20 text-emerald-700 dark:text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Scan className="w-3.5 h-3.5" /> Scan Foliage
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSelectedFieldForDetail(field)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                      title="View Details"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteField(field.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/50 text-muted-foreground hover:text-rose-600 cursor-pointer transition-colors"
                      title="Remove Field"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rythu Extension Tasks & Agronomic Action Calendar */}
      <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              Agronomic Action Checklist (Rythu Vedika Schedule)
            </h2>
            <p className="text-xs text-muted-foreground">
              Prioritized cultural, IPM, and nutritional actions for your current growth stages.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {tasks.filter((t) => t.is_completed).length} / {tasks.length} Completed
          </span>
        </div>

        <div className="space-y-3 pt-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => handleToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                task.is_completed
                  ? 'bg-muted/40 border-border opacity-70'
                  : 'bg-card border-border hover:border-emerald-500/40 hover:bg-muted/20'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-emerald-600 dark:text-emerald-400 cursor-pointer"
              >
                {task.is_completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Square className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`text-xs sm:text-sm font-bold ${
                      task.is_completed ? 'line-through text-muted-foreground' : 'text-foreground'
                    }`}
                  >
                    {task.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        task.priority === 'high'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {task.priority} priority
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.due_date}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Field Modal Dialog */}
      {isAddFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" /> Add New Field Block
              </h3>
              <button
                type="button"
                onClick={() => setIsAddFieldModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddFieldSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Select Crop</label>
                  <select
                    value={newCropId}
                    onChange={(e) => {
                      setNewCropId(e.target.value);
                      if (e.target.value === 'paddy') {
                        setNewCropName('Paddy / Rice (వరి)');
                        setNewVariety('RNR 15048 (Telangana Sona)');
                      } else if (e.target.value === 'cotton') {
                        setNewCropName('Cotton (ప్రత్తి)');
                        setNewVariety('Bt Cotton BG-II');
                      } else if (e.target.value === 'chilli') {
                        setNewCropName('Chilli (మిర్చి)');
                        setNewVariety('Teja S17 Hot Pepper');
                      } else if (e.target.value === 'tomato') {
                        setNewCropName('Tomato (టమాట)');
                        setNewVariety('Arka Rakshak F1');
                      } else if (e.target.value === 'maize') {
                        setNewCropName('Maize (మొక్కజొన్న)');
                        setNewVariety('DHM 117 Hybrid');
                      } else {
                        setNewCropName('Groundnut (వేరుశనగ)');
                        setNewVariety('Kadiri 6 (K-6)');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  >
                    <option value="paddy">Paddy / Rice (వరి)</option>
                    <option value="cotton">Cotton (ప్రత్తి)</option>
                    <option value="chilli">Chilli (మిర్చి)</option>
                    <option value="tomato">Tomato (టమాట)</option>
                    <option value="maize">Maize (మొక్కజొన్న)</option>
                    <option value="groundnut">Groundnut (వేరుశనగ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Crop Variety</label>
                  <input
                    type="text"
                    required
                    value={newVariety}
                    onChange={(e) => setNewVariety(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Acreage (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={newAcres}
                    onChange={(e) => setNewAcres(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Growth Stage</label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  >
                    <option value="Nursery / నారుమడి">Nursery / Seedling</option>
                    <option value="Tillering / Vegetative (ఎదుగుదల దశ)">Tillering / Vegetative</option>
                    <option value="Flowering / పూత దశ">Flowering / Squaring</option>
                    <option value="Fruit Setting / కాయ పిందె దశ">Fruit / Grain Setting</option>
                    <option value="Maturity & Harvest / కోత దశ">Maturity & Pre-Harvest</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Soil Type</label>
                  <input
                    type="text"
                    value={newSoilType}
                    onChange={(e) => setNewSoilType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground">Irrigation Method</label>
                  <input
                    type="text"
                    value={newIrrigation}
                    onChange={(e) => setNewIrrigation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddFieldModalOpen(false)}
                  className="px-4 py-2 rounded-xl hover:bg-muted text-muted-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-md cursor-pointer"
                >
                  Save Field Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Field Details Drawer/Modal */}
      {selectedFieldForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {selectedFieldForDetail.crop_name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {selectedFieldForDetail.variety} • {selectedFieldForDetail.acres} Acres
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFieldForDetail(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted/50 border border-border">
                <div>
                  <span className="font-semibold text-foreground block">Sowing / Planting:</span>
                  <span className="text-muted-foreground">{selectedFieldForDetail.planting_date}</span>
                </div>
                <div>
                  <span className="font-semibold text-foreground block">Growth Stage:</span>
                  <span className="text-muted-foreground">{selectedFieldForDetail.stage}</span>
                </div>
                <div className="mt-2">
                  <span className="font-semibold text-foreground block">Soil Classification:</span>
                  <span className="text-muted-foreground">{selectedFieldForDetail.soil_type}</span>
                </div>
                <div className="mt-2">
                  <span className="font-semibold text-foreground block">Irrigation Infrastructure:</span>
                  <span className="text-muted-foreground">{selectedFieldForDetail.irrigation_type}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-foreground block mb-1">Field Agronomic Notes:</span>
                <p className="text-muted-foreground italic bg-background p-3 rounded-xl border border-border">
                  {selectedFieldForDetail.notes || 'No custom notes recorded for this block.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
                <span className="font-bold block mb-0.5">Recommended Field Action:</span>
                Maintain biological scouting every 48 hours. Follow calibrated AWD drainage schedule.
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedFieldForDetail(null)}
                className="px-4 py-2 rounded-xl bg-muted text-foreground font-semibold text-xs"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedFieldForDetail(null);
                  navigate('/diagnose');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <Scan className="w-3.5 h-3.5" /> Diagnose Foliage Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
