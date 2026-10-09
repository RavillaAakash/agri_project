import React, { useState, useRef } from 'react';
import { useAuth } from '@/features/profile/AuthContext';
import {
  UserCheck,
  ShieldAlert,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Image as ImageIcon,
  X,
  Filter,
  Check,
  Printer,
} from 'lucide-react';
import {
  getStoredTickets,
  saveStoredTickets,
  type EscalationTicket,
} from '@/features/expert/expertService';

export const ExpertPage: React.FC = () => {
  const { profile } = useAuth();

  // Dual-role view state: 'farmer' or 'agronomist'
  const [activeRoleMode, setActiveRoleMode] = useState<'farmer' | 'agronomist'>(
    profile?.role === 'expert' ? 'agronomist' : 'farmer'
  );

  const [farmerSubTab, setFarmerSubTab] = useState<'submit' | 'history'>('submit');
  const [tickets, setTickets] = useState<EscalationTicket[]>(() => getStoredTickets());
  const [selectedTicketForReview, setSelectedTicketForReview] = useState<EscalationTicket | null>(null);
  const [selectedTicketForDetail, setSelectedTicketForDetail] = useState<EscalationTicket | null>(null);

  // Farmer form state
  const [farmerName, setFarmerName] = useState(profile?.fullName || 'Aakash Ravilla');
  const [phone, setPhone] = useState(profile?.phoneNumber || '+91 98490 12345');
  const [district, setDistrict] = useState(profile?.district || 'Warangal');
  const [mandal, setMandal] = useState(profile?.mandal || 'Geesugonda');
  const [cropId, setCropId] = useState('chilli');
  const [cropName, setCropName] = useState('Chilli (మిర్చి)');
  const [variety, setVariety] = useState('Teja S17 Hot Pepper');
  const [symptomsDescription, setSymptomsDescription] = useState('');
  const [fertilizerHistory, setFertilizerHistory] = useState('');
  const [uploadedLeafImage, setUploadedLeafImage] = useState<string | null>(null);
  const [uploadedWholeImage, setUploadedWholeImage] = useState<string | null>(null);
  const [submittedTicketSuccess, setSubmittedTicketSuccess] = useState<string | null>(null);

  // Agronomist review form state
  const [officialDiagnosis, setOfficialDiagnosis] = useState('');
  const [prescribedCultural, setPrescribedCultural] = useState('');
  const [prescribedBiological, setPrescribedBiological] = useState('');
  const [prescribedChemical, setPrescribedChemical] = useState('');
  const [prescribedDosage, setPrescribedDosage] = useState('');
  const [prescribedPHI, setPrescribedPHI] = useState('15');
  const [filterDistrict, setFilterDistrict] = useState('All');

  const leafInputRef = useRef<HTMLInputElement>(null);
  const wholeInputRef = useRef<HTMLInputElement>(null);

  const handleLeafImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedLeafImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleWholeImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedWholeImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFarmerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: EscalationTicket = {
      id: newId,
      farmerId: profile?.id || 'f-local',
      farmerName,
      phone,
      district,
      mandal,
      cropId,
      cropName,
      variety,
      images: {
        leafUrl: uploadedLeafImage || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=600&auto=format&fit=crop&q=80',
        wholePlantUrl: uploadedWholeImage || undefined,
      },
      symptomsDescription,
      fertilizerHistory,
      aiConfidence: 66,
      aiPreDiagnosis: `${cropName} foliar necrosis / atypical pest symptoms requiring verification`,
      status: 'pending_review',
      createdAt: new Date().toLocaleString(),
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    saveStoredTickets(updated);
    setSubmittedTicketSuccess(newId);
    setSymptomsDescription('');
    setFertilizerHistory('');
    setUploadedLeafImage(null);
    setUploadedWholeImage(null);
  };

  const handleAgronomistSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicketForReview) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicketForReview.id) {
        return {
          ...t,
          status: 'resolved_verified' as const,
          agronomistResponse: {
            expertName: profile?.fullName || 'Dr. K. Venkataramana, Ph.D. (Plant Pathology)',
            institution: 'Regional Agricultural Research Station (RARS), PJTSAU / ANGRAU',
            officialDiagnosis: officialDiagnosis || t.aiPreDiagnosis,
            prescription: {
              culturalActions: prescribedCultural
                ? prescribedCultural.split('\n').filter(Boolean)
                : ['Follow optimum irrigation spacing and destroy infested border rows.'],
              biologicalControl: prescribedBiological
                ? prescribedBiological.split('\n').filter(Boolean)
                : ['Spray 5% Neem Seed Kernel Extract (NSKE) @ 2 ml/L.'],
              chemicalActiveIngredient: prescribedChemical || 'Diafenthiuron 50% WP',
              cibrcDosage: prescribedDosage || '1.25 g/L with thorough foliar coverage',
              waitingPeriodDays: parseInt(prescribedPHI) || 15,
            },
            statutoryWarning:
              'Official University Extension Clearance: Observe CIB&RC approved pre-harvest interval. Personal protective equipment mandatory.',
            signedAt: new Date().toLocaleString(),
          },
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    saveStoredTickets(updatedTickets);
    setSelectedTicketForReview(null);
    alert('Advisory officially verified & dispatched via SMS / WhatsApp advisory gateway!');
  };

  const filteredTickets = tickets.filter(
    (t) => filterDistrict === 'All' || t.district === filterDistrict
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-card border border-border shadow-xs">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Agricultural Extension & Expert Escalation Queue</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground">
            {activeRoleMode === 'farmer' ? 'Farmer Expert Escalation Portal' : 'Agronomist Review Workbench'}
          </h1>
          <p className="text-xs text-muted-foreground">
            Connecting farmers with state agricultural university specialists (PJTSAU / ANGRAU / KVK Rythu Vedikas).
          </p>
        </div>

        {/* Dual Role Toggle Button */}
        <div className="flex items-center p-1 rounded-2xl bg-muted border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveRoleMode('farmer')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRoleMode === 'farmer'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            👨‍🌾 Farmer Portal
          </button>
          <button
            type="button"
            onClick={() => setActiveRoleMode('agronomist')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeRoleMode === 'agronomist'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🔬 Agronomist Workbench
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. FARMER PORTAL VIEW                                                 */}
      {/* ===================================================================== */}
      {activeRoleMode === 'farmer' && (
        <div className="space-y-6">
          {/* Sub Tabs */}
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <button
              type="button"
              onClick={() => {
                setFarmerSubTab('submit');
                setSubmittedTicketSuccess(null);
              }}
              className={`pb-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                farmerSubTab === 'submit'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Request New Expert Review
            </button>
            <button
              type="button"
              onClick={() => setFarmerSubTab('history')}
              className={`pb-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${
                farmerSubTab === 'history'
                  ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Track My Tickets ({tickets.length})
            </button>
          </div>

          {farmerSubTab === 'submit' && (
            <>
              {submittedTicketSuccess ? (
                <div className="p-8 rounded-3xl bg-card border border-emerald-500/40 text-center space-y-4 shadow-xl max-w-xl mx-auto">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 mx-auto flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">
                    Case #{submittedTicketSuccess} Dispatched!
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Your request and multi-angle leaf photos have been assigned to plant pathologists at your regional research station. An agronomist will review your field symptoms within 2 to 6 hours and dispatch verified guidance via SMS / WhatsApp.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSubmittedTicketSuccess(null)}
                      className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted"
                    >
                      Submit Another Case
                    </button>
                    <button
                      type="button"
                      onClick={() => setFarmerSubTab('history')}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold"
                    >
                      View Ticket Status
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleFarmerSubmit}
                  className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xs space-y-6"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-bold text-foreground">
                      Submit Foliar Pathology Case for Expert Consultation
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Use this escalation whenever AI diagnostic confidence is below 70%, or when unusual necrosis and wilting symptoms threaten crop yield.
                    </p>
                  </div>

                  {/* Multi-Angle Image Uploaders (§22) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" /> Multi-Angle Crop Foliage Images
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Leaf Close-up */}
                      <div className="p-4 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-2 bg-muted/20">
                        <input
                          type="file"
                          accept="image/*"
                          ref={leafInputRef}
                          onChange={handleLeafImagePick}
                          className="hidden"
                        />
                        {uploadedLeafImage ? (
                          <div className="relative">
                            <img
                              src={uploadedLeafImage}
                              alt="Leaf close up"
                              className="w-36 h-28 object-cover rounded-xl border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => setUploadedLeafImage(null)}
                              className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 text-white shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            <div className="text-xs">
                              <button
                                type="button"
                                onClick={() => leafInputRef.current?.click()}
                                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                              >
                                Upload Leaf Close-up
                              </button>
                              <span className="block text-[10px] text-muted-foreground">
                                High resolution of lesions or curling
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Whole Plant View */}
                      <div className="p-4 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center space-y-2 bg-muted/20">
                        <input
                          type="file"
                          accept="image/*"
                          ref={wholeInputRef}
                          onChange={handleWholeImagePick}
                          className="hidden"
                        />
                        {uploadedWholeImage ? (
                          <div className="relative">
                            <img
                              src={uploadedWholeImage}
                              alt="Whole plant view"
                              className="w-36 h-28 object-cover rounded-xl border border-border"
                            />
                            <button
                              type="button"
                              onClick={() => setUploadedWholeImage(null)}
                              className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-600 text-white shadow-xs"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6 text-muted-foreground" />
                            <div className="text-xs">
                              <button
                                type="button"
                                onClick={() => wholeInputRef.current?.click()}
                                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                              >
                                Upload Whole Plant / Stem
                              </button>
                              <span className="block text-[10px] text-muted-foreground">
                                Full canopy context & stand distribution
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Farmer Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Farmer Name</label>
                      <input
                        type="text"
                        required
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">
                        Mobile Phone Number (SMS / WhatsApp Advisory)
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                      />
                    </div>
                  </div>

                  {/* Crop & District */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Crop</label>
                      <select
                        value={cropId}
                        onChange={(e) => {
                          setCropId(e.target.value);
                          if (e.target.value === 'chilli') {
                            setCropName('Chilli (మిర్చి)');
                            setVariety('Teja S17 Hot Pepper');
                          } else if (e.target.value === 'paddy') {
                            setCropName('Paddy / Rice (వరి)');
                            setVariety('BPT 5204 (Samba Mahsuri)');
                          } else if (e.target.value === 'cotton') {
                            setCropName('Cotton (ప్రత్తి)');
                            setVariety('Bt Cotton RCH-659');
                          }
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                      >
                        <option value="chilli">Chilli (మిర్చి)</option>
                        <option value="paddy">Paddy / Rice (వరి)</option>
                        <option value="cotton">Cotton (ప్రత్తి)</option>
                        <option value="tomato">Tomato (టమాట)</option>
                        <option value="maize">Maize (మొక్కజొన్న)</option>
                        <option value="groundnut">Groundnut (వేరుశనగ)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">Variety</label>
                      <input
                        type="text"
                        required
                        value={variety}
                        onChange={(e) => setVariety(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">District / Mandal</label>
                      <input
                        type="text"
                        required
                        value={`${district}, ${mandal}`}
                        onChange={(e) => {
                          const parts = e.target.value.split(',');
                          setDistrict(parts[0]?.trim() || district);
                          setMandal(parts[1]?.trim() || mandal);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                      />
                    </div>
                  </div>

                  {/* Observations & History */}
                  <div className="space-y-3 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">
                        Symptom Progression & Field Observations
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={symptomsDescription}
                        onChange={(e) => setSymptomsDescription(e.target.value)}
                        placeholder="Describe leaf curling, spot shapes, root discoloration, pest clustering, or plant wilting..."
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-foreground">
                        Recent Fertilizers, Chemicals & Spray History
                      </label>
                      <textarea
                        rows={2}
                        value={fertilizerHistory}
                        onChange={(e) => setFertilizerHistory(e.target.value)}
                        placeholder="List urea/DAP applications, recent pesticide sprays, irrigation frequency..."
                        className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Extension advisory services operate in direct coordination with PJTSAU and ANGRAU regional stations. All prescriptions comply with official CIB&RC statutory regulations.
                    </span>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" /> Submit Case For Agronomist Review
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {farmerSubTab === 'history' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-foreground">
                Your Submitted Cases & Official University Prescriptions
              </h2>

              <div className="space-y-4">
                {tickets.map((ticket) => {
                  const isResolved = ticket.status === 'resolved_verified';
                  const isInvestigating = ticket.status === 'under_investigation';

                  return (
                    <div
                      key={ticket.id}
                      className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              #{ticket.id}
                            </span>
                            <span className="text-sm font-bold text-foreground">
                              {ticket.cropName} ({ticket.variety})
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {ticket.district}, {ticket.mandal} • Submitted: {ticket.createdAt}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-auto flex items-center gap-1.5 ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isInvestigating
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {isResolved ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> University Verified
                            </>
                          ) : isInvestigating ? (
                            <>
                              <Clock className="w-3.5 h-3.5 text-blue-600" /> Agronomist Reviewing
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-amber-600" /> Queued For Specialist
                            </>
                          )}
                        </span>
                      </div>

                      {/* Symptoms & Attached Image */}
                      <div className="flex flex-col sm:flex-row gap-4 text-xs">
                        {ticket.images.leafUrl && (
                          <img
                            src={ticket.images.leafUrl}
                            alt="Leaf foliage"
                            className="w-32 h-24 object-cover rounded-xl border border-border shrink-0"
                          />
                        )}
                        <div className="space-y-1.5 flex-1">
                          <p className="text-muted-foreground">
                            <strong className="text-foreground">Observations:</strong>{' '}
                            {ticket.symptomsDescription}
                          </p>
                          {ticket.fertilizerHistory && (
                            <p className="text-muted-foreground">
                              <strong className="text-foreground">Field History:</strong>{' '}
                              {ticket.fertilizerHistory}
                            </p>
                          )}
                          <div className="text-[11px] text-muted-foreground">
                            AI Pre-Diagnosis: <span className="font-semibold text-foreground">{ticket.aiPreDiagnosis}</span> ({ticket.aiConfidence}% confidence)
                          </div>
                        </div>
                      </div>

                      {/* Official Agronomist Response Card (if resolved) */}
                      {ticket.agronomistResponse && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/50 space-y-3 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200 dark:border-emerald-900 pb-2">
                            <div>
                              <div className="font-bold text-emerald-950 dark:text-emerald-200">
                                Official Diagnosis: {ticket.agronomistResponse.officialDiagnosis}
                              </div>
                              <div className="text-[11px] text-emerald-800 dark:text-emerald-400">
                                Verified by {ticket.agronomistResponse.expertName} • {ticket.agronomistResponse.institution}
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              Signed: {ticket.agronomistResponse.signedAt}
                            </span>
                          </div>

                          <div className="space-y-2 text-emerald-950 dark:text-emerald-200">
                            <div>
                              <span className="font-bold block mb-0.5">Cultural & Mechanical Actions:</span>
                              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
                                {ticket.agronomistResponse.prescription.culturalActions.map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                              </ul>
                            </div>

                            {ticket.agronomistResponse.prescription.chemicalActiveIngredient && (
                              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/50 text-[11px] text-amber-950 dark:text-amber-200 space-y-1">
                                <div className="font-bold text-amber-900 dark:text-amber-300">
                                  Prescribed Registered Chemical Treatment (Strict Last Resort):
                                </div>
                                <div>
                                  <strong>Active Ingredient:</strong>{' '}
                                  {ticket.agronomistResponse.prescription.chemicalActiveIngredient}
                                </div>
                                <div>
                                  <strong>CIB&RC Dosage:</strong>{' '}
                                  {ticket.agronomistResponse.prescription.cibrcDosage}
                                </div>
                                <div>
                                  <strong>Waiting Period (PHI):</strong>{' '}
                                  <span className="font-bold text-rose-600 dark:text-rose-400">
                                    {ticket.agronomistResponse.prescription.waitingPeriodDays} days
                                  </span>
                                </div>
                              </div>
                            )}

                            <div className="text-[10px] text-muted-foreground italic pt-1">
                              {ticket.agronomistResponse.statutoryWarning}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. AGRONOMIST WORKBENCH VIEW                                          */}
      {/* ===================================================================== */}
      {activeRoleMode === 'agronomist' && (
        <div className="space-y-6">
          {/* Extension Officer Workbench Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Total Assigned</span>
              <div className="text-2xl font-black text-foreground">{tickets.length}</div>
              <span className="text-[10px] text-muted-foreground">Cases in jurisdiction</span>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Pending Review</span>
              <div className="text-2xl font-black text-amber-600">
                {tickets.filter((t) => t.status === 'pending_review').length}
              </div>
              <span className="text-[10px] text-amber-600 font-medium">Requires triage</span>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Under Investigation</span>
              <div className="text-2xl font-black text-blue-600">
                {tickets.filter((t) => t.status === 'under_investigation').length}
              </div>
              <span className="text-[10px] text-blue-600 font-medium">In pathology review</span>
            </div>
            <div className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-1">
              <span className="text-xs text-muted-foreground font-semibold">Verified Prescriptions</span>
              <div className="text-2xl font-black text-emerald-600">
                {tickets.filter((t) => t.status === 'resolved_verified').length}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">100% CIB&RC cleared</span>
            </div>
          </div>

          {/* Workbench Filter Bar */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-emerald-600" /> Filter Jurisdiction:
            </span>
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-background border border-border text-foreground font-semibold cursor-pointer"
            >
              <option value="All">All Agricultural Districts</option>
              <option value="Warangal">Warangal (Telangana)</option>
              <option value="Suryapet">Suryapet (Telangana)</option>
              <option value="Guntur">Guntur (Andhra Pradesh)</option>
            </select>
          </div>

          {/* Agronomist Case Queue */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-foreground">
              Farmer Case Queue ({filteredTickets.length})
            </h2>

            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-6 rounded-3xl bg-card border border-border shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-500/40 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                        #{ticket.id}
                      </span>
                      <h3 className="text-base font-bold text-foreground">
                        {ticket.cropName} ({ticket.variety})
                      </h3>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          ticket.status === 'resolved_verified'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : ticket.status === 'under_investigation'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}
                      >
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-3">
                      <span><strong>Farmer:</strong> {ticket.farmerName}</span>
                      <span><strong>Mobile:</strong> {ticket.phone}</span>
                      <span><strong>Location:</strong> {ticket.mandal}, {ticket.district}</span>
                      <span><strong>Submitted:</strong> {ticket.createdAt}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      "{ticket.symptomsDescription}"
                    </p>

                    <div className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                      AI Diagnostic Guess: {ticket.aiPreDiagnosis} ({ticket.aiConfidence}% confidence)
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {ticket.status !== 'resolved_verified' ? (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTicketForReview(ticket);
                          setOfficialDiagnosis(ticket.aiPreDiagnosis);
                          setPrescribedChemical('');
                          setPrescribedDosage('');
                          setPrescribedCultural('');
                          setPrescribedBiological('');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Review & Prescribe
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedTicketForDetail(ticket)}
                        className="px-4 py-2 rounded-xl border border-border hover:bg-muted text-foreground font-semibold text-xs transition-colors cursor-pointer"
                      >
                        View Advisory
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review & Prescription Modal Drawer */}
          {selectedTicketForReview && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Agronomist Diagnostic Workbench • Case #{selectedTicketForReview.id}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedTicketForReview.farmerName} • {selectedTicketForReview.district}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForReview(null)}
                    className="text-muted-foreground hover:text-foreground p-1 text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Evidence & Photos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/40 border border-border text-xs">
                  {selectedTicketForReview.images.leafUrl && (
                    <div>
                      <span className="font-semibold block mb-1">Foliar Inspection Image:</span>
                      <img
                        src={selectedTicketForReview.images.leafUrl}
                        alt="Leaf lesion"
                        className="w-full h-32 object-cover rounded-xl border border-border"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <div>
                      <span className="font-semibold">Crop & Variety:</span>{' '}
                      {selectedTicketForReview.cropName} ({selectedTicketForReview.variety})
                    </div>
                    <div>
                      <span className="font-semibold">AI Baseline Diagnosis:</span>{' '}
                      {selectedTicketForReview.aiPreDiagnosis} ({selectedTicketForReview.aiConfidence}%)
                    </div>
                    <div>
                      <span className="font-semibold">Farmer Observations:</span>{' '}
                      {selectedTicketForReview.symptomsDescription}
                    </div>
                    {selectedTicketForReview.fertilizerHistory && (
                      <div>
                        <span className="font-semibold">Fertilizer History:</span>{' '}
                        {selectedTicketForReview.fertilizerHistory}
                      </div>
                    )}
                  </div>
                </div>

                {/* Agronomist Prescription Form */}
                <form onSubmit={handleAgronomistSignOff} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">
                      Confirmed Official Etiological Diagnosis
                    </label>
                    <input
                      type="text"
                      required
                      value={officialDiagnosis}
                      onChange={(e) => setOfficialDiagnosis(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">
                      Cultural & Mechanical Control Actions (What Farmer Should Do Immediately)
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={prescribedCultural}
                      onChange={(e) => setPrescribedCultural(e.target.value)}
                      placeholder="e.g. Install 25 blue sticky traps per acre; drain standing irrigation water for 48 hours..."
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-foreground">
                      Biological Management & Biopesticides
                    </label>
                    <input
                      type="text"
                      value={prescribedBiological}
                      onChange={(e) => setPrescribedBiological(e.target.value)}
                      placeholder="e.g. Foliar spray of Pseudomonas fluorescens @ 10g/L or 5% NSKE Neem extract"
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-foreground"
                    />
                  </div>

                  {/* Registered Chemical Prescription */}
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 space-y-3">
                    <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      CIB&RC Registered Chemical Prescription (Strict Last Resort)
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-semibold text-amber-950 dark:text-amber-200">
                          Active Ingredient
                        </label>
                        <input
                          type="text"
                          required
                          value={prescribedChemical}
                          onChange={(e) => setPrescribedChemical(e.target.value)}
                          placeholder="e.g. Diafenthiuron 50% WP"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-amber-950 dark:text-amber-200">
                          Official Dosage
                        </label>
                        <input
                          type="text"
                          required
                          value={prescribedDosage}
                          onChange={(e) => setPrescribedDosage(e.target.value)}
                          placeholder="e.g. 1.25 g/L water"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold text-amber-950 dark:text-amber-200">
                          Waiting Period (PHI Days)
                        </label>
                        <input
                          type="number"
                          required
                          value={prescribedPHI}
                          onChange={(e) => setPrescribedPHI(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-border">
                    <button
                      type="button"
                      onClick={() => setSelectedTicketForReview(null)}
                      className="px-4 py-2 rounded-xl hover:bg-muted text-muted-foreground font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Sign & Dispatch Extension Advisory
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Detail View Modal for already resolved tickets */}
          {selectedTicketForDetail && selectedTicketForDetail.agronomistResponse && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      Advisory Slip • Case #{selectedTicketForDetail.id}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Farmer: {selectedTicketForDetail.farmerName} • {selectedTicketForDetail.phone}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForDetail(null)}
                    className="text-muted-foreground hover:text-foreground p-1 text-sm cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/50 space-y-1">
                    <div className="font-bold text-emerald-950 dark:text-emerald-200">
                      Diagnosis: {selectedTicketForDetail.agronomistResponse.officialDiagnosis}
                    </div>
                    <div className="text-[11px] text-emerald-800 dark:text-emerald-400">
                      Signatory: {selectedTicketForDetail.agronomistResponse.expertName}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      Institution: {selectedTicketForDetail.agronomistResponse.institution}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold block mb-1 text-foreground">Prescribed Actions:</span>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground pl-1">
                      {selectedTicketForDetail.agronomistResponse.prescription.culturalActions.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>

                  {selectedTicketForDetail.agronomistResponse.prescription.chemicalActiveIngredient && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/50 text-[11px] text-amber-950 dark:text-amber-200">
                      <strong>CIB&RC Chemical:</strong>{' '}
                      {selectedTicketForDetail.agronomistResponse.prescription.chemicalActiveIngredient} @{' '}
                      {selectedTicketForDetail.agronomistResponse.prescription.cibrcDosage} (Pre-harvest interval:{' '}
                      {selectedTicketForDetail.agronomistResponse.prescription.waitingPeriodDays} days)
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded-xl bg-muted text-foreground font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print Advisory Slip
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTicketForDetail(null)}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
