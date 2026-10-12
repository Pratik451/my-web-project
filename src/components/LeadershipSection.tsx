import React, { useState } from 'react';
import { LeadershipMemberCMS } from '../types';

interface LeadershipSectionProps {
  lang: 'en' | 'np';
  members: LeadershipMemberCMS[];
  onFileGrievance?: () => void;
  onOpenOfficerDetails?: (member: LeadershipMemberCMS) => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  lang,
  members,
  onFileGrievance,
  onOpenOfficerDetails,
}) => {
  const isNp = lang === 'np';
  const [selectedLeader, setSelectedLeader] = useState<LeadershipMemberCMS | null>(null);

  // Filter active members and sort them
  const activeMembers = members
    .filter((m) => m.isActive !== false)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  if (!activeMembers || activeMembers.length === 0) {
    return null;
  }

  const handleActionClick = (member: LeadershipMemberCMS) => {
    if (member.actionType === 'file_grievance') {
      if (onFileGrievance) {
        onFileGrievance();
      } else {
        setSelectedLeader(member);
      }
      return;
    }

    if (member.actionType === 'custom' && member.customActionUrl) {
      if (member.customActionUrl.startsWith('http')) {
        window.open(member.customActionUrl, '_blank', 'noopener,noreferrer');
      } else if (member.customActionUrl.startsWith('#')) {
        const el = document.querySelector(member.customActionUrl);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (onOpenOfficerDetails) {
      onOpenOfficerDetails(member);
    } else {
      setSelectedLeader(member);
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'chairman':
        return {
          label: isNp ? 'सञ्चालक समिति अध्यक्ष' : 'Board Chairman',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          dot: 'bg-emerald-500',
          accent: 'from-emerald-600 to-teal-700',
        };
      case 'ceo':
        return {
          label: isNp ? 'प्रमुख कार्यकारी अधिकृत' : 'Chief Executive Officer',
          bg: 'bg-sky-50 text-sky-800 border-sky-200/80',
          dot: 'bg-sky-500',
          accent: 'from-[#0981ae] to-[#0c2d3e]',
        };
      case 'info_officer':
        return {
          label: isNp ? 'सूचना अधिकारी • RTI' : 'Information Officer • RTI',
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          dot: 'bg-amber-500',
          accent: 'from-teal-600 to-emerald-700',
        };
      case 'grievance_officer':
        return {
          label: isNp ? 'गुनासो सुनुवाइ अधिकारी' : 'Grievance Redressal Officer',
          bg: 'bg-purple-50 text-purple-800 border-purple-200/80',
          dot: 'bg-purple-500',
          accent: 'from-purple-700 to-indigo-900',
        };
      default:
        return {
          label: isNp ? 'नेतृत्व तथा अधिकृत' : 'Leadership Official',
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          dot: 'bg-slate-500',
          accent: 'from-slate-700 to-slate-900',
        };
    }
  };

  return (
    <section
      id="leadership-messages"
      className="py-16 md:py-20 bg-gradient-to-b from-slate-50 via-white to-sky-50/30 border-y border-slate-200/70 relative overflow-hidden"
    >
      {/* Decorative background grid and circles */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-[#0981ae] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="w-2 h-2 rounded-full bg-[#0981ae] animate-pulse" />
            {isNp ? 'नेतृत्व तथा आधिकारिक डेस्क' : 'LEADERSHIP & OFFICIAL DESKS'}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0c2d3e] tracking-tight">
            {isNp ? 'नेतृत्वको सन्देश तथा मुख्य अधिकारीहरू' : 'Messages from Leadership'}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#0981ae] to-emerald-500 rounded-full mx-auto mt-3.5 mb-4" />
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {isNp
              ? 'सुशासन, पारदर्शिता र सदस्य समृद्धिप्रति प्रतिबद्ध हाम्रो नेतृत्व मण्डल तथा सूचना र गुनासो डेस्कका आधिकारिक सम्पर्क विवरणहरू।'
              : 'Committed to good governance, institutional transparency, and member-centric financial excellence. Connect directly with our apex leadership and statutory desks.'}
          </p>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7 items-stretch">
          {activeMembers.map((member) => {
            const badge = getCategoryBadge(member.category);
            const leaderName = isNp ? member.nameNp || member.nameEn : member.nameEn || member.nameNp;
            const designation = isNp ? member.designationNp || member.designationEn : member.designationEn || member.designationNp;
            const shortMsg = isNp ? member.shortMessageNp || member.shortMessageEn : member.shortMessageEn || member.shortMessageNp;
            const officeRoom = isNp ? member.officeRoomNp || member.officeRoomEn : member.officeRoomEn || member.officeRoomNp;
            const availability = isNp ? member.availabilityNp || member.availabilityEn : member.availabilityEn || member.availabilityNp;

            const isOfficer = member.category === 'info_officer' || member.category === 'grievance_officer';
            const actionLabel = isNp
              ? member.actionLabelNp || (member.actionType === 'file_grievance' ? 'गुनासो दर्ता' : member.actionType === 'view_details' ? 'विवरण हेर्नुहोस्' : 'विस्तृत सन्देश')
              : member.actionLabelEn || (member.actionType === 'file_grievance' ? 'File Grievance' : member.actionType === 'view_details' ? 'View Details' : 'Read More');

            return (
              <div
                key={member.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#0981ae]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative"
              >
                {/* Top Subtle Color Accent Bar */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${badge.accent}`} />

                {/* Card Header & Circular Photo Area */}
                <div className="pt-6 pb-4 px-5 text-center flex flex-col items-center">
                  {/* Category Pill */}
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border ${badge.bg} mb-4 shadow-2xs`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {badge.label}
                  </div>

                  {/* Circular Photo with Premium White Border & Ring */}
                  <div className="relative mb-3.5">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-slate-200 via-white to-sky-300 shadow-md group-hover:shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {member.photoUrl ? (
                          <img
                            src={member.photoUrl}
                            alt={leaderName}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              // If image fails, fallback to styled initials
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-3xl font-extrabold text-[#0981ae]">
                            {leaderName.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Leader Name */}
                  <h3 className="text-base sm:text-lg font-bold text-[#0c2d3e] group-hover:text-[#0981ae] transition-colors leading-tight line-clamp-1">
                    {leaderName}
                  </h3>

                  {/* Designation */}
                  <p className="text-xs font-semibold text-[#0981ae] mt-1 line-clamp-2 min-h-[32px] flex items-center justify-center">
                    {designation}
                  </p>
                </div>

                {/* Card Body: Short Message or Contact Grid */}
                <div className="px-5 pb-4 flex-1 flex flex-col text-left">
                  {/* Quote or Message Preview */}
                  <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 text-xs text-slate-600 leading-relaxed relative flex-1 flex flex-col justify-between mb-3">
                    <p className="italic line-clamp-4 relative z-10 text-slate-700">
                      &ldquo;{shortMsg}&rdquo;
                    </p>

                    {/* Contact Badges for Officers */}
                    {isOfficer && (member.phone || member.email || officeRoom) && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/70 space-y-1.5 text-[11px] not-italic">
                        {member.phone && (
                          <a
                            href={`tel:${member.phone.replace(/[^0-9+]/g, '')}`}
                            className="flex items-center gap-1.5 text-slate-700 hover:text-[#0981ae] transition-colors group/tel truncate"
                            title={member.phone}
                          >
                            <span className="text-xs shrink-0">📞</span>
                            <span className="font-semibold truncate">{member.phone}</span>
                          </a>
                        )}
                        {member.email && (
                          <a
                            href={`mailto:${member.email}`}
                            className="flex items-center gap-1.5 text-slate-700 hover:text-[#0981ae] transition-colors group/mail truncate"
                            title={member.email}
                          >
                            <span className="text-xs shrink-0">✉️</span>
                            <span className="truncate">{member.email}</span>
                          </a>
                        )}
                        {officeRoom && (
                          <div className="flex items-center gap-1.5 text-slate-500 truncate" title={officeRoom}>
                            <span className="text-xs shrink-0">🏢</span>
                            <span className="truncate">{officeRoom}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-5 pb-5 pt-1">
                  {member.actionType === 'file_grievance' ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleActionClick(member)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span>📝</span>
                        <span>{actionLabel}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedLeader(member)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex items-center justify-center cursor-pointer"
                        title={isNp ? 'विवरण' : 'Details'}
                      >
                        <span>ℹ️</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleActionClick(member)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95 ${
                        member.category === 'chairman'
                          ? 'bg-emerald-700 hover:bg-emerald-800 text-white hover:shadow-md'
                          : member.category === 'ceo'
                          ? 'bg-[#0c2d3e] hover:bg-[#0981ae] text-white hover:shadow-md'
                          : 'bg-white hover:bg-sky-50 text-[#0981ae] border border-[#0981ae]/40 hover:border-[#0981ae]'
                      }`}
                    >
                      <span>{actionLabel}</span>
                      <span className="text-sm transition-transform group-hover:translate-x-1">➜</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leadership Profile Full Detail Modal */}
      {selectedLeader && (
        <LeadershipDetailModal
          lang={lang}
          leader={selectedLeader}
          onClose={() => setSelectedLeader(null)}
          onFileGrievance={onFileGrievance}
        />
      )}
    </section>
  );
};

interface LeadershipDetailModalProps {
  lang: 'en' | 'np';
  leader: LeadershipMemberCMS;
  onClose: () => void;
  onFileGrievance?: () => void;
}

const LeadershipDetailModal: React.FC<LeadershipDetailModalProps> = ({
  lang,
  leader,
  onClose,
  onFileGrievance,
}) => {
  const isNp = lang === 'np';
  const leaderName = isNp ? leader.nameNp || leader.nameEn : leader.nameEn || leader.nameNp;
  const designation = isNp ? leader.designationNp || leader.designationEn : leader.designationEn || leader.designationNp;
  const fullMsg = isNp
    ? leader.fullMessageNp || leader.fullMessageEn || leader.shortMessageNp || leader.shortMessageEn
    : leader.fullMessageEn || leader.fullMessageNp || leader.shortMessageEn || leader.shortMessageNp;
  const officeRoom = isNp ? leader.officeRoomNp || leader.officeRoomEn : leader.officeRoomEn || leader.officeRoomNp;
  const availability = isNp ? leader.availabilityNp || leader.availabilityEn : leader.availabilityEn || leader.availabilityNp;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with Gradient Banner */}
        <div className="bg-gradient-to-r from-[#0c2d3e] via-[#0981ae] to-emerald-700 text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-white/30 shrink-0 shadow-lg">
              <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                {leader.photoUrl ? (
                  <img
                    src={leader.photoUrl}
                    alt={leaderName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-2xl font-bold text-[#0981ae]">{leaderName.charAt(0)}</span>
                )}
              </div>
            </div>

            <div className="min-w-0 pr-8">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-1.5 backdrop-blur-xs">
                {leader.category === 'chairman'
                  ? (isNp ? 'सञ्चालक समिति' : 'Board of Directors')
                  : leader.category === 'ceo'
                  ? (isNp ? 'कार्यकारी व्यवस्थापन' : 'Executive Management')
                  : leader.category === 'info_officer'
                  ? (isNp ? 'सूचनाको हक (RTI)' : 'Right to Information')
                  : (isNp ? 'गुनासो सुनुवाइ' : 'Grievance Redressal')}
              </span>
              <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-tight">
                {leaderName}
              </h3>
              <p className="text-xs sm:text-sm text-sky-100 font-medium mt-1">
                {designation}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm leading-relaxed">
          {/* Quick Contact & Office Desk Info */}
          {(leader.phone || leader.email || officeRoom || availability) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              {leader.phone && (
                <div className="flex items-center gap-2">
                  <span className="text-base">☎️</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{isNp ? 'फोन / मोबाइल' : 'Phone / Mobile'}</div>
                    <a href={`tel:${leader.phone.replace(/[^0-9+]/g, '')}`} className="font-bold text-[#0981ae] hover:underline">
                      {leader.phone}
                    </a>
                  </div>
                </div>
              )}
              {leader.email && (
                <div className="flex items-center gap-2">
                  <span className="text-base">✉️</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{isNp ? 'आधिकारिक इमेल' : 'Official Email'}</div>
                    <a href={`mailto:${leader.email}`} className="font-bold text-[#0981ae] hover:underline truncate block">
                      {leader.email}
                    </a>
                  </div>
                </div>
              )}
              {officeRoom && (
                <div className="flex items-center gap-2">
                  <span className="text-base">🏢</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{isNp ? 'कार्यकक्ष' : 'Office Room'}</div>
                    <span className="font-semibold text-slate-800">{officeRoom}</span>
                  </div>
                </div>
              )}
              {availability && (
                <div className="flex items-center gap-2">
                  <span className="text-base">⏰</span>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">{isNp ? 'भेटघाट समय' : 'Office Hours'}</div>
                    <span className="font-semibold text-slate-800">{availability}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Message / Official Statement */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              {isNp ? 'आधिकारिक सन्देश तथा प्रतिबद्धता' : 'Official Message & Charter'}
            </h4>
            <div className="prose prose-sm max-w-none text-slate-700 space-y-3 whitespace-pre-line text-sm leading-relaxed bg-white rounded-xl p-4 border border-slate-100 shadow-2xs">
              {fullMsg}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {leader.category === 'grievance_officer' && onFileGrievance ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onFileGrievance();
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>📝</span>
              <span>{isNp ? 'गुनासो दर्ता गर्नुहोस्' : 'File a Grievance Now'}</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400 font-medium">
              {isNp ? 'अंकुर बचत तथा ऋण सहकारी संस्था लि.' : 'Ankur Saving & Credit Cooperative Ltd.'}
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer ml-auto"
          >
            {isNp ? 'बन्द गर्नुहोस्' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
