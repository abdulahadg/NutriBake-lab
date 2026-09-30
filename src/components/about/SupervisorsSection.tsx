import React, { useState } from 'react';
import { 
  GraduationCap, 
  FlaskConical, 
  Code2, 
  CheckCircle2, 
  BookOpen, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Users, 
  X,
  ChevronRight,
  Layers,
  FileText
} from 'lucide-react';
import { ACADEMIC_SUPERVISORS, PROJECT_DETAILS } from '../../data/mockData';
import { AcademicSupervisor } from '../../types';

interface SupervisorsSectionProps {
  onScrollToTeam?: () => void;
}

export const SupervisorsSection: React.FC<SupervisorsSectionProps> = ({ onScrollToTeam }) => {
  const [filter, setFilter] = useState<'all' | 'swe' | 'nutrition'>('all');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState<AcademicSupervisor | null>(null);
  const [allCitationCopied, setAllCitationCopied] = useState(false);

  const supervisors = ACADEMIC_SUPERVISORS;

  const filteredSupervisors = supervisors.filter((sup) => {
    if (filter === 'swe') return sup.department.toLowerCase().includes('software');
    if (filter === 'nutrition') return sup.department.toLowerCase().includes('nutrition');
    return true;
  });

  const handleCopyCitation = (sup: AcademicSupervisor, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const citation = `${sup.name}, ${sup.title}, ${sup.department}, ${sup.institution}. NutriBake Academic Project 2k23-SWEM-45.`;
    navigator.clipboard?.writeText(citation);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleCopyAllCitations = () => {
    const text = supervisors
      .map(
        (s) =>
          `• ${s.name} — ${s.title}, ${s.department}, ${s.institution} (Project 2k23-SWEM-45)`
      )
      .join('\n');
    navigator.clipboard?.writeText(text);
    setAllCitationCopied(true);
    setTimeout(() => setAllCitationCopied(false), 2500);
  };

  const getSupervisorIcon = (name: string) => {
    if (name.includes('Arifa Bhutto')) {
      return <GraduationCap className="w-6 h-6 text-[#C97D36] stroke-[1.9]" />;
    }
    if (name.includes('Afsheen Shah')) {
      return <FlaskConical className="w-6 h-6 text-[#5E7252] stroke-[1.9]" />;
    }
    return <Code2 className="w-6 h-6 text-[#C97D36] stroke-[1.9]" />;
  };

  const getBadgeColors = (name: string) => {
    if (name.includes('Afsheen Shah')) {
      return {
        tagBg: 'bg-[#EEF3EB]',
        tagText: 'text-[#5E7252]',
        tagBorder: 'border-[#D4E0CD]',
        accent: '#5E7252',
        lightBg: 'from-[#FAF7F2] via-white to-[#EEF3EB]/40',
        emblemBg: 'bg-[#EEF3EB]',
        emblemBorder: 'border-[#D4E0CD]'
      };
    }
    return {
      tagBg: 'bg-[#FAF0E4]',
      tagText: 'text-[#C97D36]',
      tagBorder: 'border-[#EAD2B9]',
      accent: '#C97D36',
      lightBg: 'from-[#FAF7F2] via-white to-[#FAF0E4]/40',
      emblemBg: 'bg-[#FAF0E4]',
      emblemBorder: 'border-[#EAD2B9]'
    };
  };

  return (
    <div id="supervisors-mentors-section" className="space-y-10">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold text-[#5E7252] bg-[#EEF3EB] px-3 py-1 rounded-full border border-[#D4E0CD] inline-flex items-center gap-1.5 tracking-wider shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5E7252]" />
              <span>Academic Mentorship & Project Leadership</span>
            </span>
            <span className="text-[11px] font-semibold text-[#C97D36] bg-[#FAF0E4] px-3 py-1 rounded-full border border-[#EAD2B9] hidden sm:inline-block">
              Project 2k23-SWEM-45
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#3D261E] tracking-tight">
            Supervisors & Mentors
          </h2>
          <p className="text-sm sm:text-base text-[#2A1F1B]/75 leading-relaxed">
            Distinguished university leadership jointly supervising the software engineering architecture, biochemical starch formulation assays, and clinical bakery trials.
          </p>
        </div>

        {/* Action Pills & Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Smart Filter Tabs */}
          <div className="flex flex-wrap sm:flex-nowrap items-center p-1 bg-[#FAF7F2] rounded-2xl sm:rounded-full border border-[#E8DDCF] shadow-2xs gap-1 sm:gap-0">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`btn-sweet px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-[#3D261E] text-white shadow-2xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E]'
              }`}
            >
              All 3 ({supervisors.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('swe')}
              className={`btn-sweet px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'swe'
                  ? 'bg-[#3D261E] text-white shadow-2xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E]'
              }`}
            >
              Software Eng. (2)
            </button>
            <button
              type="button"
              onClick={() => setFilter('nutrition')}
              className={`btn-sweet px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === 'nutrition'
                  ? 'bg-[#3D261E] text-white shadow-2xs'
                  : 'text-[#2A1F1B]/70 hover:text-[#3D261E]'
              }`}
            >
              Food Science (1)
            </button>
          </div>

          {/* Copy All Citations Button */}
          <button
            type="button"
            onClick={handleCopyAllCitations}
            className="btn-sweet text-xs font-semibold text-[#3D261E] bg-white hover:bg-[#FAF7F2] px-3.5 py-2 rounded-full border border-[#E8DDCF] shadow-2xs transition-all flex items-center gap-1.5"
            title="Copy formal academic citations for all 3 supervisors"
          >
            {allCitationCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#5E7252]" />
                <span className="text-[#5E7252]">Citations Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#C97D36]" />
                <span>Copy Citations</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3 EQUAL, IDENTICALLY DESIGNED MASTER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {filteredSupervisors.map((supervisor, index) => {
          const colors = getBadgeColors(supervisor.name);
          const icon = getSupervisorIcon(supervisor.name);
          const isCopied = copiedIndex === index;

          return (
            <div
              key={supervisor.name}
              onClick={() => setSelectedSupervisor(supervisor)}
              className="group relative flex flex-col justify-between rounded-3xl bg-white/95 border border-[#E8DDCF] p-6 sm:p-7 shadow-[0_8px_30px_rgba(61,38,30,0.05)] hover:shadow-[0_20px_45px_-12px_rgba(61,38,30,0.14)] hover:border-[#C97D36]/70 hover:-translate-y-2 transition-all duration-300 ease-out cursor-pointer overflow-hidden"
            >
              {/* Subtle Warm Accent Top Glow Stripe */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#C97D36] via-[#E8B878] to-[#5E7252] opacity-80 group-hover:opacity-100 group-hover:h-2 transition-all duration-300" 
              />

              {/* Background ambient gradient glow */}
              <div 
                className={`absolute -top-16 -right-16 w-36 h-36 bg-linear-to-br ${colors.lightBg} rounded-full blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} 
              />

              {/* Card Body */}
              <div className="relative z-10 space-y-5">
                
                {/* Top Badge Strip: Department Tag + Designation */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10.5px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${colors.tagBg} ${colors.tagText} ${colors.tagBorder} shadow-2xs`}>
                    {supervisor.designation || 'Academic Leadership'}
                  </span>

                  <span className="text-[10.5px] font-medium text-[#2A1F1B]/60 bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E8DDCF]">
                    Univ. of Sindh
                  </span>
                </div>

                {/* Academic Emblem / Seal & Lead Badge */}
                <div className="flex items-start gap-4 pt-1">
                  <div className={`w-14 h-14 rounded-2xl ${colors.emblemBg} border ${colors.emblemBorder} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 group-hover:rotate-1 transition-transform duration-300`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-xl sm:text-[1.35rem] font-medium text-[#3D261E] group-hover:text-[#C97D36] transition-colors leading-snug">
                      {supervisor.name}
                    </h3>
                    <p className="text-xs font-bold text-[#C97D36] mt-0.5 line-clamp-1">
                      {supervisor.title}
                    </p>
                    <p className="text-[11.5px] text-[#5E7252] font-semibold line-clamp-1 mt-0.5">
                      {supervisor.department.split(',')[0]}
                    </p>
                  </div>
                </div>

                {/* Supervisory Focus Area Pill */}
                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF]/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#2A1F1B]/50 block">
                    Supervisory Core Domain
                  </span>
                  <p className="text-xs font-semibold text-[#3D261E] leading-snug">
                    {supervisor.supervisoryFocus || 'Academic Supervision & Project Leadership'}
                  </p>
                </div>

                {/* Bio Excerpt */}
                <p className="text-xs sm:text-[12.5px] text-[#2A1F1B]/75 leading-relaxed line-clamp-3">
                  {supervisor.bio}
                </p>

                {/* Key Supervisory Highlights (Equal 4-5 bullet list across all 3 cards) */}
                <div className="space-y-2 pt-2 border-t border-[#E8DDCF]/70">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5E7252] block">
                    Leadership Milestones
                  </span>
                  <div className="space-y-1.5">
                    {supervisor.highlights?.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[#2A1F1B]/80 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5E7252] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Card Footer: Citation Trigger & View Focus Action */}
              <div className="relative z-10 pt-5 mt-5 border-t border-[#E8DDCF]/80 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={(e) => handleCopyCitation(supervisor, index, e)}
                  className="btn-sweet text-[11px] font-semibold text-[#2A1F1B]/70 hover:text-[#C97D36] bg-[#FAF7F2] hover:bg-white px-3 py-1.5 rounded-full border border-[#E8DDCF] shadow-2xs transition-all flex items-center gap-1.5"
                  title="Copy citation for this supervisor"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-[#5E7252]" />
                      <span className="text-[#5E7252]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-[#C97D36]" />
                      <span>Cite</span>
                    </>
                  )}
                </button>

                <div className="btn-sweet text-xs font-semibold text-[#3D261E] group-hover:text-[#C97D36] flex items-center gap-1">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Bottom Cross-Discipline Collaboration Note with Supervised Team Button */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-[#FAF0E4]/60 via-[#FAF7F2] to-[#EEF3EB]/60 border border-[#E8DDCF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white rounded-2xl border border-[#E8DDCF] text-[#C97D36] shrink-0 shadow-2xs">
            <Award className="w-5 h-5 stroke-[1.8]" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-medium text-[#3D261E]">
              Interdisciplinary Academic Framework · Project 2k23-SWEM-45
            </h4>
            <p className="text-xs text-[#2A1F1B]/70 mt-0.5">
              Supervised under the joint guidance of the <strong>Department of Software Engineering</strong> & <strong>Department of Nutrition & Food Science</strong>, University of Sindh, Jamshoro.
            </p>
          </div>
        </div>

        {onScrollToTeam && (
          <button
            type="button"
            onClick={onScrollToTeam}
            className="btn-sweet py-2 px-4 rounded-full bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Users className="w-3.5 h-3.5" />
            <span>View Supervised Students (Group # 45)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* SUPERVISOR DETAIL MODAL (Opens smoothly when any of the 3 cards is clicked) */}
      {selectedSupervisor && (
        <div
          id="supervisor-detail-modal"
          className="fixed inset-0 z-50 bg-[#2A1F1B]/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedSupervisor(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl bg-white rounded-3xl border border-[#E8DDCF] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-[#E8DDCF] bg-linear-to-r from-[#FAF7F2] via-white to-[#FAF0E4]/40 flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#FAF0E4] border border-[#EAD2B9] flex items-center justify-center text-[#C97D36] shrink-0 shadow-2xs">
                  {getSupervisorIcon(selectedSupervisor.name)}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#C97D36] bg-[#FAF0E4] px-2.5 py-0.5 rounded-full border border-[#EAD2B9]">
                      {selectedSupervisor.designation || 'Supervisor'}
                    </span>
                    <span className="text-[10px] text-[#5E7252] font-semibold bg-[#EEF3EB] px-2.5 py-0.5 rounded-full border border-[#D4E0CD]">
                      Project 2k23-SWEM-45
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-[#3D261E]">
                    {selectedSupervisor.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#C97D36]">
                    {selectedSupervisor.title}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSupervisor(null)}
                className="p-2 hover:bg-[#FAF0E4] text-[#3D261E] rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Institutional Details */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF] space-y-1">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#2A1F1B]/50 block">
                  Academic Department & Faculty
                </span>
                <p className="text-xs font-semibold text-[#3D261E]">
                  {selectedSupervisor.department}
                </p>
                <p className="text-xs text-[#5E7252] font-medium">
                  {selectedSupervisor.institution}
                </p>
              </div>

              {/* Complete Academic Bio */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D261E] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C97D36]" />
                  <span>Academic Leadership & Supervisory Overview</span>
                </h4>
                <p className="text-sm text-[#2A1F1B]/80 leading-relaxed">
                  {selectedSupervisor.bio}
                </p>
              </div>

              {/* Supervisory Focus Area */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D261E] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#5E7252]" />
                  <span>Primary Supervisory Domain</span>
                </h4>
                <p className="text-xs sm:text-[13px] text-[#2A1F1B]/85 p-3.5 rounded-2xl bg-[#EEF3EB]/60 border border-[#D4E0CD] font-medium">
                  {selectedSupervisor.supervisoryFocus}
                </p>
              </div>

              {/* Full Key Highlights */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3D261E] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C97D36]" />
                  <span>Supervisory Highlights & Project Contributions</span>
                </h4>
                <div className="space-y-2">
                  {selectedSupervisor.highlights?.map((hl, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF]/80 text-xs text-[#2A1F1B]/85"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#5E7252] shrink-0 mt-0.5" />
                      <span className="font-medium leading-relaxed">{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-[#E8DDCF] bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-[#2A1F1B]/60">
                Official University of Sindh Project Record
              </span>

              <button
                type="button"
                onClick={() => setSelectedSupervisor(null)}
                className="btn-sweet px-5 py-2 rounded-full bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold transition-all shadow-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
