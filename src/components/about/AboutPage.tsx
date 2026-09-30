import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  FlaskConical,
  Code2,
  Heart,
  CheckCircle2,
  ShieldCheck,
  Users,
  GraduationCap,
  Scale,
  Award,
  Clock,
  Layers,
  Maximize2,
  X
} from 'lucide-react';
import { ThemeLogo } from '../common/ThemeLogo';
import { SupervisorsSection } from './SupervisorsSection';
import {
  PROJECT_DETAILS,
  SOFTWARE_ENG_TEAM,
  NUTRITION_SCIENCE_TEAM,
  THEME_LOGO_IMAGE
} from '../../data/mockData';

export const AboutPage: React.FC = () => {
  const { navigateTo, products, teamMembers } = useApp();
  const [bannerLightboxOpen, setBannerLightboxOpen] = useState(false);

  // Group database-driven team members by department with initial fallback
  const softwareEngTeam = teamMembers && teamMembers.length > 0
    ? teamMembers.filter(m => m.department?.toLowerCase().includes('software') || m.department?.toLowerCase().includes('swe'))
    : SOFTWARE_ENG_TEAM;

  const nutritionScienceTeam = teamMembers && teamMembers.length > 0
    ? teamMembers.filter(m => m.department?.toLowerCase().includes('nutrition') || m.department?.toLowerCase().includes('food'))
    : NUTRITION_SCIENCE_TEAM;

  const scrollToTeam = () => {
    const el = document.getElementById('software-eng-team-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-16 sm:space-y-24">
      {/* Editorial Header & Cross-Discipline Pill */}
      <div className="max-w-4xl space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#EEF3EB] border border-[#D4E0CD] text-[#5E7252] rounded-full text-xs font-semibold shadow-2xs flex-wrap">
          <FlaskConical className="w-3.5 h-3.5 text-[#5E7252] shrink-0" />
          <span>Nutrition & Food Science</span>
          <span className="text-[#3D261E]/30 hidden xs:inline">•</span>
          <Code2 className="w-3.5 h-3.5 text-[#C97D36] shrink-0" />
          <span>Software Engineering</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-6xl lg:text-7xl font-normal text-[#3D261E] tracking-tight leading-[1.05] break-words">
          Nutrition meets <span className="italic text-[#C97D36]">baking</span>.
        </h1>
        <p className="text-lg sm:text-xl text-[#2A1F1B]/85 leading-relaxed font-serif italic">
          "{PROJECT_DETAILS.tagline}"
        </p>
        <p className="text-sm sm:text-base text-[#2A1F1B]/80 leading-relaxed pt-1">
          {PROJECT_DETAILS.name} is an interdisciplinary initiative established in 2025 under the <strong>Nutrition & Food Science Department</strong> in collaboration with the <strong>Department of Software Engineering, Faculty of Engineering & Technology, University of Sindh, Jamshoro</strong> (Project ID: {PROJECT_DETAILS.projectCode} / Group #{PROJECT_DETAILS.groupNumber}).
        </p>
      </div>

      {/* Official Visual Emblem & Logo Meaning Section */}
      <div className="rounded-3xl border border-[#E8DDCF] bg-white/90 p-4 sm:p-8 lg:p-12 shadow-xs space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Target Element: NutriBake Profile Banner Showcase */}
          <div
            id="nutribake-profile-banner-container"
            className="lg:col-span-5 flex flex-col items-center text-center space-y-4 w-full"
          >
            {/* Complete & Responsive Profile Banner Card */}
            <div className="w-full max-w-xl lg:max-w-none relative group rounded-2xl border border-[#E8DDCF] shadow-xs hover:shadow-md transition-all duration-300 bg-gradient-to-b from-[#FFFDF9] via-[#FAF7F2] to-[#F4EDE1] overflow-hidden">
              {/* Responsive Aspect-Ratio Box matching 1408x768 (16:9) */}
              <div
                onClick={() => setBannerLightboxOpen(true)}
                className="relative w-full aspect-[16/9] sm:aspect-[1.83/1] cursor-pointer overflow-hidden flex items-center justify-center p-1 sm:p-2 bg-gradient-to-br from-[#FFFDF8] to-[#F1E8D9]"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setBannerLightboxOpen(true);
                }}
                aria-label="View NutriBake Profile Banner in full resolution"
                title="Click to view full-resolution NutriBake profile banner"
              >
                {/* Master Banner Image: Complete and unclipped */}
                <img
                  src={THEME_LOGO_IMAGE}
                  alt="NutriBake Official Profile Banner - Golden Chef Hat and Heart with Botanical Leaf"
                  className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />

                {/* Top Left Corner Badge: Master Profile Banner */}
                <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1 bg-[#3D261E]/85 backdrop-blur-xs text-[#FAF7F2] rounded-full shadow-xs border border-white/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5E7252] animate-pulse" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    Profile Banner
                  </span>
                </div>

                {/* Top Right Expand Action Button */}
                <div className="absolute top-2.5 right-2.5 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setBannerLightboxOpen(true);
                    }}
                    className="p-1.5 bg-white/90 hover:bg-white text-[#3D261E] rounded-full border border-[#E8DDCF] shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-[11px] font-semibold"
                    aria-label="Expand banner view"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-[#3D261E]" />
                    <span className="hidden sm:inline text-[10px] font-bold pr-0.5">Expand</span>
                  </button>
                </div>

                {/* Bottom Overlay Pill on Hover: Asset Dimensions */}
                <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-bold text-[#FAF7F2] bg-[#2A1F1B]/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/15">
                    1408 × 768 px
                  </span>
                </div>
              </div>

              {/* Bottom Quick-Action Bar */}
              <div className="px-4 py-2.5 bg-[#FAF7F2] border-t border-[#E8DDCF] flex items-center justify-between gap-2 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10.5px] uppercase font-bold text-[#5E7252]">
                    Official Master Asset
                  </span>
                  <span className="text-[#3D261E]/25">•</span>
                  <span className="text-xs text-[#2A1F1B]/70 font-medium">
                    16:9 Landscape
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setBannerLightboxOpen(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#C97D36] hover:text-[#3D261E] transition-colors"
                >
                  <span>Full View</span>
                  <Maximize2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Typography & Brand Identity Details */}
            <div className="space-y-1.5 pt-1">
              <span className="font-serif text-2xl sm:text-3xl text-[#3D261E] block font-medium leading-tight">
                Nutri<span className="italic text-[#C97D36]">Bake</span>
              </span>
              <span className="text-xs uppercase font-bold text-[#5E7252] block tracking-wide">
                Therapeutic Nutrition & Confectionery Laboratory
              </span>
              <p className="text-xs text-[#2A1F1B]/70 max-w-sm mx-auto leading-relaxed">
                Official Visual Identity & Academic Profile Banner • Group #{PROJECT_DETAILS.groupNumber}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1.5">
              <span className="text-[11px] uppercase font-bold text-[#C97D36] bg-[#FAF0E4] px-3 py-1 rounded-full border border-[#EAD2B9] inline-block tracking-wider">
                Visual Emblem Anatomy
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3D261E] tracking-tight">
                The Story Behind Our Logo
              </h2>
            </div>
            <p className="text-sm text-[#2A1F1B]/80 leading-relaxed">
              The NutriBake logo bridges culinary craftsmanship, nutritional biochemistry, and software innovation into a cohesive academic identity:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF] space-y-1.5 hover:shadow-2xs transition-all">
                <div className="flex items-center gap-2 text-[#C97D36] font-semibold text-xs">
                  <Heart className="w-4 h-4 text-[#C97D36]" />
                  <span className="text-[#3D261E] font-serif text-sm">Chef Hat & Heart</span>
                </div>
                <p className="text-xs text-[#2A1F1B]/75 leading-relaxed">
                  Symbolizes care, culinary dedication, and warm artisanal baking made to nourish people rather than just provide empty calories.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF] space-y-1.5 hover:shadow-2xs transition-all">
                <div className="flex items-center gap-2 text-[#5E7252] font-semibold text-xs">
                  <Sparkles className="w-4 h-4 text-[#5E7252]" />
                  <span className="text-[#3D261E] font-serif text-sm">Fresh Green Leaf</span>
                </div>
                <p className="text-xs text-[#2A1F1B]/75 leading-relaxed">
                  Represents natural plant ingredients, unripe green banana flour, raw nuts, pure seeds, and botanical dietary fiber.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF] space-y-1.5 hover:shadow-2xs transition-all">
                <div className="flex items-center gap-2 text-[#C97D36] font-semibold text-xs">
                  <Code2 className="w-4 h-4 text-[#C97D36]" />
                  <span className="text-[#3D261E] font-serif text-sm">Code Symbol &lt;/&gt;</span>
                </div>
                <p className="text-xs text-[#2A1F1B]/75 leading-relaxed">
                  Stands for the Department of Software Engineering — driving automated health recommendations, digital tracking, and modern web architecture.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF] space-y-1.5 hover:shadow-2xs transition-all">
                <div className="flex items-center gap-2 text-[#5E7252] font-semibold text-xs">
                  <FlaskConical className="w-4 h-4 text-[#5E7252]" />
                  <span className="text-[#3D261E] font-serif text-sm">Laboratory Beaker</span>
                </div>
                <p className="text-xs text-[#2A1F1B]/75 leading-relaxed">
                  Represents the Nutrition & Food Science Department — controlled formulation, glycemic testing, resistant starch trials, and sensory scoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why NutriBake & What We Do */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-6 p-8 rounded-3xl bg-white/90 border border-[#E8DDCF] shadow-xs space-y-5">
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold text-[#5E7252] bg-[#EEF3EB] px-3 py-1 rounded-full border border-[#D4E0CD] inline-block tracking-wider">
              Our Purpose
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3D261E] tracking-tight leading-tight">
              Why NutriBake?
            </h2>
          </div>
          <div className="space-y-4 text-sm text-[#2A1F1B]/80 leading-relaxed">
            <p className="font-serif text-base italic text-[#C97D36] p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF]">
              "{PROJECT_DETAILS.whyNutriBake}"
            </p>
            <p>
              Conventional bakery items are heavily laden with refined white flour, added sugars, and hydrogenated fats while lacking essential dietary fiber and micronutrients. NutriBake transforms traditional baked favorites into accessible, health-conscious alternatives formulated around therapeutic dietary requirements, including diabetic-friendly and gut-nourishing concepts.
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 p-8 rounded-3xl bg-white/90 border border-[#E8DDCF] shadow-xs space-y-5">
          <div className="space-y-2">
            <span className="text-[11px] uppercase font-bold text-[#C97D36] bg-[#FAF0E4] px-3 py-1 rounded-full border border-[#EAD2B9] inline-block tracking-wider">
              Core Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3D261E] tracking-tight leading-tight">
              What We Do
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {PROJECT_DETAILS.whatWeDo.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCF]">
                <CheckCircle2 className="w-4 h-4 text-[#5E7252] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-[13px] text-[#3D261E] font-medium leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our 6-Step Scientific Approach */}
      <div className="border-t border-[#E8DDCF] pt-16 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] uppercase font-bold text-[#5E7252] bg-[#EEF3EB] px-3 py-1 rounded-full border border-[#D4E0CD] inline-block tracking-wider">
            Methodology & Workflow
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3D261E] tracking-tight">
            Our Approach
          </h2>
          <p className="text-xs uppercase font-bold text-[#C97D36] tracking-wide">
            Research → Formulate → Bake → Evaluate → Improve → Serve
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECT_DETAILS.approachSteps.map((step) => (
            <div 
              key={step.step} 
              className="p-6 rounded-3xl bg-white/90 border border-[#E8DDCF] shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-normal text-[#C97D36]">
                    0{step.step}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#EAD2B9] text-[#C97D36]">
                    Stage {step.step}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-[#3D261E] font-medium">
                  {step.name}
                </h3>
                <p className="text-xs sm:text-[13px] text-[#2A1F1B]/75 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 3 Signature Formulations (Spotlight) */}
      <div className="border-t border-[#E8DDCF] pt-16 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] uppercase font-bold text-[#C97D36] bg-[#FAF0E4] px-3 py-1 rounded-full border border-[#EAD2B9] inline-block tracking-wider">
            Signature Formulations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3D261E] tracking-tight">
            Our Three Bakery Creations
          </h2>
          <p className="text-sm text-[#2A1F1B]/75 leading-relaxed">
            Formulated in controlled laboratory trials, thoroughly sensory tested, and standardized for maximum nutritional value and taste.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl border border-[#E8DDCF] bg-white/90 flex flex-col justify-between transition-all hover:border-[#C97D36]/60 hover:-translate-y-1.5 hover:shadow-md overflow-hidden shadow-xs"
            >
              <div>
                <div className="aspect-16/10 overflow-hidden relative bg-[#FAF7F2]">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[#3D261E]/90 backdrop-blur-xs text-[#FAF7F2] rounded-full text-[10px] uppercase font-bold tracking-wider">
                    {prod.category}
                  </div>
                  {prod.pricePkr && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#C97D36] text-white rounded-full text-xs font-bold shadow-xs">
                      PKR {prod.pricePkr}
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-medium text-[#3D261E]">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-[#C97D36] font-semibold italic">
                      {prod.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-[13px] text-[#2A1F1B]/75 leading-relaxed line-clamp-3">
                    {prod.description}
                  </p>

                  <div className="pt-3 border-t border-[#E8DDCF]/80 grid grid-cols-2 gap-2 text-xs text-[#2A1F1B]/80">
                    <div>
                      <span className="text-[#5E7252] block text-[10px] uppercase font-bold">Portion / Net Wt</span>
                      <span className="font-medium text-[#3D261E]">{prod.portionSize || prod.servingSize} ({prod.netWeight || 'Standard'})</span>
                    </div>
                    <div>
                      <span className="text-[#5E7252] block text-[10px] uppercase font-bold">Shelf Life</span>
                      <span className="font-medium text-[#3D261E]">{prod.shelfLife}</span>
                    </div>
                  </div>

                  {prod.allergenInformation && (
                    <div className="text-xs p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8DDCF] text-[#3D261E] leading-relaxed">
                      <span className="uppercase font-bold text-[10px] block text-[#C97D36]">Allergen Info</span>
                      {prod.allergenInformation}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0">
                <button
                  onClick={() => navigateTo('products')}
                  className="w-full py-2.5 rounded-full text-xs font-semibold text-white bg-[#3D261E] hover:bg-[#C97D36] transition-all shadow-xs"
                >
                  View Scientific Specs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Leadership & Supervisors - All 3 Equal Master Design */}
      <div className="border-t border-[#E8DDCF] pt-16">
        <SupervisorsSection onScrollToTeam={scrollToTeam} />
      </div>

      {/* The Student Development Teams (Software Engineering + Nutrition Science) */}
      <div id="software-eng-team-section" className="border-t border-[#E8DDCF] pt-16 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] uppercase font-bold text-[#C97D36] bg-[#FAF0E4] px-3 py-1 rounded-full border border-[#EAD2B9] inline-block tracking-wider">
            Supervised Student Authorship · Group # 45
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#3D261E] tracking-tight">
            Meet the Project Teams
          </h2>
          <p className="text-sm text-[#2A1F1B]/75 leading-relaxed">
            Supervised by Prof. Dr. Arifa Bhutto, NutriBake unites passionate final-year students from Software Engineering and Nutrition & Food Science to build health-conscious bakery products.
          </p>
        </div>

        {/* Software Engineering Team */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#FAF0E4] rounded-xl border border-[#EAD2B9] text-[#C97D36]">
              <Code2 className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#3D261E]">
              Department of Software Engineering (Group # 45)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {softwareEngTeam.map((member) => {
              const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('');
              return (
                <div 
                  key={member.name} 
                  className="p-6 sm:p-7 rounded-3xl bg-white/90 border border-[#E8DDCF] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-1.5 hover:border-[#C97D36]/60 transition-all duration-300 group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#FAF0E4] border border-[#EAD2B9] text-[#C97D36] font-serif font-bold text-sm flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                          {initials}
                        </div>
                        <div>
                          <h4 className="font-serif text-lg font-medium text-[#3D261E] group-hover:text-[#C97D36] transition-colors">
                            {member.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#C97D36] block">
                            {member.role}
                          </span>
                        </div>
                      </div>
                      {member.idNumber && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FAF0E4] border border-[#EAD2B9] text-[#C97D36] font-mono font-bold tracking-wider shrink-0">
                          {member.idNumber}
                        </span>
                      )}
                    </div>

                    {member.subRole && (
                      <span className="text-[11px] text-[#5E7252] font-semibold block px-2.5 py-1 rounded-xl bg-[#EEF3EB] border border-[#D4E0CD] w-fit">
                        {member.subRole}
                      </span>
                    )}

                    <p className="text-xs sm:text-[13px] text-[#2A1F1B]/80 leading-relaxed">
                      <strong className="text-[#3D261E] font-semibold">Focus:</strong> {member.bio || member.focus}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(member.expertise || []).map((exp, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#3D261E] border border-[#E8DDCF]">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8DDCF]/80 text-[11px] text-[#2A1F1B]/65 flex items-center justify-between font-sans">
                    <span>{member.institution}</span>
                    <span className="font-semibold text-[#5E7252]">Software Eng.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nutrition & Food Science Student Team */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#EEF3EB] rounded-xl border border-[#D4E0CD] text-[#5E7252]">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#3D261E]">
              Department of Nutrition & Food Science Team
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nutritionScienceTeam.map((member) => {
              const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('');
              return (
                <div 
                  key={member.name} 
                  className="p-6 sm:p-7 rounded-3xl bg-white/90 border border-[#E8DDCF] shadow-xs space-y-4 flex flex-col justify-between hover:shadow-md hover:-translate-y-1.5 hover:border-[#5E7252]/60 transition-all duration-300 group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#EEF3EB] border border-[#D4E0CD] text-[#5E7252] font-serif font-bold text-sm flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                        {initials}
                      </div>
                      <div>
                        <h4 className="font-serif text-lg font-medium text-[#3D261E] group-hover:text-[#5E7252] transition-colors">
                          {member.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#5E7252] block">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    {member.subRole && (
                      <span className="text-[11px] text-[#C97D36] font-semibold block px-2.5 py-1 rounded-xl bg-[#FAF0E4] border border-[#EAD2B9] w-fit">
                        {member.subRole}
                      </span>
                    )}

                    <p className="text-xs sm:text-[13px] text-[#2A1F1B]/80 leading-relaxed">
                      <strong className="text-[#3D261E] font-semibold">Focus:</strong> {member.bio || member.focus}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(member.expertise || []).map((exp, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#3D261E] border border-[#E8DDCF]">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8DDCF]/80 text-[11px] text-[#2A1F1B]/65 flex items-center justify-between font-sans">
                    <span>{member.institution}</span>
                    <span className="font-semibold text-[#C97D36]">Food Science</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Technology Stack Matrix */}
      <div className="border-t border-[#E8DDCF] pt-16 space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] uppercase font-bold text-[#5E7252] bg-[#EEF3EB] px-3 py-1 rounded-full border border-[#D4E0CD] inline-block tracking-wider">
            Digital Architecture
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3D261E] tracking-tight">
            Technology Stack
          </h2>
          <p className="text-xs sm:text-[14px] text-[#2A1F1B]/75 leading-relaxed">
            Built using modern, scalable, and validated software frameworks supporting digital recommendations and product formulation analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PROJECT_DETAILS.techStack.map((tech) => (
            <div key={tech.category} className="p-5 rounded-3xl bg-white/90 border border-[#E8DDCF] shadow-2xs space-y-3">
              <span className="text-xs uppercase font-bold text-[#C97D36] block tracking-wide">
                {tech.category}
              </span>
              <ul className="space-y-2">
                {tech.items.map((item, idx) => (
                  <li key={idx} className="text-xs sm:text-[13px] text-[#3D261E] font-medium flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#5E7252]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* High-Resolution NutriBake Profile Banner Lightbox Modal */}
      {bannerLightboxOpen && (
        <div
          id="nutribake-banner-lightbox"
          className="fixed inset-0 z-50 bg-[#2A1F1B]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200"
          onClick={() => setBannerLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="NutriBake Profile Banner Full View"
        >
          <div
            className="relative w-full max-w-5xl bg-white rounded-3xl border border-[#E8DDCF] shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDCF] bg-[#FAF7F2]">
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-lg text-[#3D261E] font-medium">
                  Nutri<span className="italic text-[#C97D36]">Bake</span>
                </span>
                <span className="text-[#3D261E]/30">•</span>
                <span className="text-xs font-semibold text-[#5E7252]">
                  Official Profile Banner (1408 × 768)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBannerLightboxOpen(false)}
                className="p-1.5 hover:bg-[#FAF0E4] text-[#3D261E] rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lightbox Image Stage */}
            <div className="p-4 sm:p-8 bg-gradient-to-br from-[#FFFDF9] via-[#FAF7F2] to-[#F5EAD9] flex items-center justify-center overflow-auto">
              <img
                src={THEME_LOGO_IMAGE}
                alt="NutriBake Official Profile Banner - Golden Chef Hat and Heart with Botanical Leaf Full Resolution"
                className="w-full h-auto max-h-[75vh] object-contain rounded-2xl border border-[#E8DDCF] shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="px-6 py-3.5 border-t border-[#E8DDCF] bg-[#FAF7F2] flex flex-wrap items-center justify-between gap-3 text-xs text-[#2A1F1B]/75">
              <span>Department of Nutrition & Food Science • Dept. of Software Engineering</span>
              <span className="text-[#5E7252] font-semibold">University of Sindh, Jamshoro</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
