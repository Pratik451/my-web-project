import React from 'react';
import { Language } from '../types';

interface DigitalSectionProps {
  lang: Language;
  onExplore: () => void;
  onOpenEkym?: () => void;
}

export const DigitalSection: React.FC<DigitalSectionProps> = ({ lang, onExplore, onOpenEkym }) => {
  return (
    <section className="split-section" id="digital-services">
      <div className="container split">
        <div className="split-copy">
          <span className="section-tag">
            {lang === 'np' ? 'डिजिटल सेवाहरू' : 'DIGITAL SERVICES'}
          </span>
          <h2>
            {lang === 'np'
              ? 'सहकारी सेवा, अझ सहज र सुरक्षित'
              : 'Cooperative services, made easier'}
          </h2>
          <p>
            {lang === 'np'
              ? 'अंकुर स्मार्ट मोबाइल बैंकिङ, नेपालपे क्युआर र अनलाइन फारामहरू मार्फत जुनसुकै स्थानबाट आफ्नो खाता व्यवस्थापन गर्नुहोस्।'
              : 'Access member services, instant fund transfers, merchant QR scanning, and online applications seamlessly through modern digital tools.'}
          </p>

          <div className="feature-list">
            <span
              onClick={onOpenEkym}
              className="cursor-pointer font-bold text-[#0981ae] hover:underline"
              title="Click to open digital eKYM"
            >
              ✓ {lang === 'np' ? 'अनलाइन सदस्य eKYM फाराम (खोल्नुहोस्)' : 'Online Member eKYM (Click to Fill)'}
            </span>
            <span>✓ {lang === 'np' ? 'डिजिटल फाराम तथा खाता' : 'Digital Forms & Account Opening'}</span>
            <span>✓ {lang === 'np' ? 'आवेदन ट्र्याकिङ प्रणाली' : 'Application Tracking System'}</span>
            <span>✓ {lang === 'np' ? 'शाखा तथा सेवा केन्द्र खोजी' : 'Service Center Locator'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button type="button" className="outline-btn" onClick={onExplore}>
              {lang === 'np' ? 'डिजिटल सेवा हेर्नुहोस् →' : 'Explore Digital Services →'}
            </button>
            {onOpenEkym && (
              <button
                type="button"
                className="bg-[#0981ae] hover:bg-[#07678d] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                onClick={onOpenEkym}
              >
                📝 {lang === 'np' ? 'डिजिटल eKYM फाराम खोल्नुहोस्' : 'Open Digital eKYM Portal'}
              </button>
            )}
          </div>
        </div>

        <div className="digital-art relative overflow-hidden rounded-3xl p-6 sm:p-10 flex items-center justify-center min-h-[440px] shadow-2xl bg-gradient-to-br from-[#052636] via-[#074766] to-[#0981ae]">
          {/* Ambient Lighting Orbs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#0cb3f0]/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#0981ae]/30 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Modern Glassmorphic Smartphone App Showcase */}
          <div className="relative w-full max-w-[340px] bg-slate-950/80 backdrop-blur-xl border border-sky-400/30 rounded-[36px] p-5 shadow-2xl ring-1 ring-white/20 transition-transform duration-300 hover:scale-[1.02]">
            {/* Phone Speaker Notch & Dynamic Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 pb-3 px-1 border-b border-white/10">
              <span className="font-mono text-sky-200">०९:४१ AM</span>
              <div className="w-20 h-4 bg-slate-900 rounded-full border border-sky-500/30 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-sky-300 font-mono">
                <span>5G</span>
                <span>100%</span>
              </div>
            </div>

            {/* App Header */}
            <div className="pt-3 pb-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                  {lang === 'np' ? 'अंकुर स्मार्ट बैंकिङ' : 'ANKUR SMART MOBILE'}
                </span>
                <span className="text-xs font-bold text-white">
                  {lang === 'np' ? 'नमस्ते, सेयरधनी सदस्य' : 'Welcome, Valued Member'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                ● LIVE CBS
              </span>
            </div>

            {/* Premium Metallic Gradient Balance Card */}
            <div className="mt-2 p-4 rounded-2xl bg-gradient-to-tr from-[#063b52] via-[#0981ae] to-[#0cb3f0] text-white shadow-lg border border-white/25 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="flex items-center justify-between text-xs text-sky-100 font-medium">
                <span>{lang === 'np' ? 'उपलब्ध बचत मौज्दात' : 'Available Balance'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-black/20 font-mono">A/C: ०२-१०४८२</span>
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
                Rs. ८४,५००.००
              </div>
              <div className="mt-2.5 pt-2 border-t border-white/20 flex items-center justify-between text-[11px] text-sky-100">
                <span>{lang === 'np' ? 'ब्याज उपार्जन: ७.५०%' : 'Interest Yield: 7.50%'}</span>
                <span className="font-bold text-emerald-200">✓ {lang === 'np' ? 'सक्रिय' : 'Active'}</span>
              </div>
            </div>

            {/* Quick Action Matrix with Glowing Badges */}
            <div className="grid grid-cols-4 gap-2 mt-4 text-center">
              <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer">
                <span className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center text-sm font-bold border border-sky-400/30">
                  ↗
                </span>
                <span className="text-[10px] text-slate-200 font-bold mt-1.5 leading-tight">
                  {lang === 'np' ? 'ट्रान्सफर' : 'Transfer'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-sm font-bold border border-emerald-400/30">
                  ▣
                </span>
                <span className="text-[10px] text-slate-200 font-bold mt-1.5 leading-tight">
                  {lang === 'np' ? 'नेपालपे QR' : 'NepalPay'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center text-sm font-bold border border-amber-400/30">
                  ⚡
                </span>
                <span className="text-[10px] text-slate-200 font-bold mt-1.5 leading-tight">
                  {lang === 'np' ? 'महसुल' : 'Utility'}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-colors flex flex-col items-center justify-center cursor-pointer">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-sm font-bold border border-purple-400/30">
                  📑
                </span>
                <span className="text-[10px] text-slate-200 font-bold mt-1.5 leading-tight">
                  {lang === 'np' ? 'विवरण' : 'Statement'}
                </span>
              </div>
            </div>

            {/* Bottom Security Assurance Badge */}
            <div className="mt-4 px-3 py-2 rounded-xl bg-sky-950/60 border border-sky-400/20 flex items-center justify-between text-[11px] text-sky-200">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">🛡️</span>
                <span>{lang === 'np' ? '२५६-बिट सुरक्षित इन्क्रिप्सन' : '256-bit Encrypted'}</span>
              </span>
              <span className="font-mono text-[10px] text-sky-400">Fonepay & NCHL</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
