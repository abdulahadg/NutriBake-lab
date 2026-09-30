import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { WebsiteContentData } from '../../data/defaultWebsiteContent';
import { Save, RotateCcw, Sparkles, Megaphone, Eye, CheckCircle2 } from 'lucide-react';
import { DEFAULT_WEBSITE_CONTENT } from '../../data/defaultWebsiteContent';

export const WebsiteContentManager: React.FC = () => {
  const { websiteContent, updateWebsiteContent, addToast } = useApp();
  const [formData, setFormData] = useState<WebsiteContentData>(websiteContent || DEFAULT_WEBSITE_CONTENT);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (websiteContent) {
      setFormData(websiteContent);
    }
  }, [websiteContent]);

  const handleHeroChange = (field: keyof WebsiteContentData['hero'], val: string) => {
    setFormData(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [field]: val
      }
    }));
  };

  const handleAnnouncementChange = (field: keyof WebsiteContentData['announcementBanner'], val: any) => {
    setFormData(prev => ({
      ...prev,
      announcementBanner: {
        ...prev.announcementBanner,
        [field]: val
      }
    }));
  };

  const handleHighlightChange = (index: number, field: 'emoji' | 'title' | 'desc', val: string) => {
    setFormData(prev => {
      const updated = [...prev.heroHighlights];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, heroHighlights: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const success = await updateWebsiteContent(formData);
      if (success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      }
    } catch {
      addToast('Update Failed', 'Could not save website presentation settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all website presentation copy back to original defaults?')) {
      setFormData(DEFAULT_WEBSITE_CONTENT);
      updateWebsiteContent(DEFAULT_WEBSITE_CONTENT);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Public Website CMS
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3A2721]">
            Website Content & Presentation Management
          </h2>
          <p className="text-xs text-[#2A1F1B]/75 mt-1 font-sans">
            Directly modify public hero storytelling, scientific banners, and sensory promises across the website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-white border border-[#3A2721]/20 text-[#3A2721] text-xs font-semibold rounded-full hover:bg-[#FAF0E4] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs">
        {/* SECTION 1: HERO STORYTELLING */}
        <div className="card-soft bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-[0_8px_30px_rgba(61,38,30,0.03)] space-y-5">
          <div className="flex items-center gap-3 border-b border-[#E8DDCF] pb-3">
            <div className="p-2 bg-[#FAF0E4] rounded-xl text-[#C97D36]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg text-[#3D261E] font-normal">
                Hero Section Storytelling
              </h3>
              <p className="text-[11px] text-[#2A1F1B]/60 font-sans">
                Displayed in the main entrance banner of the public home view.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Badge / Sub-Header Marker
              </label>
              <input
                type="text"
                value={formData.hero.badgeText}
                onChange={e => handleHeroChange('badgeText', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Primary CTA Button Text
              </label>
              <input
                type="text"
                value={formData.hero.ctaPrimaryText}
                onChange={e => handleHeroChange('ctaPrimaryText', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Headline (Primary Text)
              </label>
              <input
                type="text"
                value={formData.hero.title}
                onChange={e => handleHeroChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs font-serif text-sm"
              />
            </div>

            <div>
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Headline Highlight (Italic Script Accent)
              </label>
              <input
                type="text"
                value={formData.hero.titleHighlight}
                onChange={e => handleHeroChange('titleHighlight', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs font-serif italic text-sm text-[#C97D36]"
              />
            </div>
          </div>

          <div>
            <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
              Editorial Description Paragraph
            </label>
            <textarea
              rows={3}
              value={formData.hero.description}
              onChange={e => handleHeroChange('description', e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl font-sans text-xs"
            />
          </div>

          <div>
            <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
              Secondary CTA Button Text
            </label>
            <input
              type="text"
              value={formData.hero.ctaSecondaryText}
              onChange={e => handleHeroChange('ctaSecondaryText', e.target.value)}
              className="w-full max-w-sm px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs"
            />
          </div>
        </div>

        {/* SECTION 2: ANNOUNCEMENT BANNER */}
        <div className="card-soft bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-[0_8px_30px_rgba(61,38,30,0.03)] space-y-5">
          <div className="flex items-center justify-between border-b border-[#E8DDCF] pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FAF0E4] rounded-xl text-[#C97D36]">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-lg text-[#3D261E] font-normal">
                  Announcement Header Banner
                </h3>
                <p className="text-[11px] text-[#2A1F1B]/60 font-sans">
                  Top notification bar for alerts, seasonal harvest announcements, and tasting events.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.announcementBanner.enabled}
                onChange={e => handleAnnouncementChange('enabled', e.target.checked)}
                className="rounded border-[#3A2721]/30 text-[#3A2721] focus:ring-0"
              />
              <span className="uppercase text-[10px] font-bold text-[#3A2721]">
                {formData.announcementBanner.enabled ? 'Banner Active' : 'Hidden'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Badge Label
              </label>
              <input
                type="text"
                value={formData.announcementBanner.badge}
                onChange={e => handleAnnouncementChange('badge', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block uppercase text-[10px] font-bold text-[#3A2721] mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={formData.announcementBanner.message}
                onChange={e => handleAnnouncementChange('message', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 rounded-xl text-xs font-sans"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: SENSORY PROMISE / HIGHLIGHT CARDS */}
        <div className="card-soft bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DDCF] shadow-[0_8px_30px_rgba(61,38,30,0.03)] space-y-5">
          <div className="border-b border-[#E8DDCF] pb-3">
            <h3 className="font-serif text-lg text-[#3D261E] font-normal">
              Wholesome Sensory Promise Highlights
            </h3>
            <p className="text-[11px] text-[#2A1F1B]/60 font-sans">
              Interactive 4-card feature dock in the hero section.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {formData.heroHighlights.map((item, idx) => (
              <div key={idx} className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DDCF] space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item.emoji}
                    onChange={e => handleHighlightChange(idx, 'emoji', e.target.value)}
                    className="w-12 text-center text-lg p-1 bg-white border border-[#3A2721]/20 rounded-lg"
                  />
                  <input
                    type="text"
                    value={item.title}
                    onChange={e => handleHighlightChange(idx, 'title', e.target.value)}
                    placeholder="Card title..."
                    className="flex-1 px-3 py-1.5 bg-white border border-[#3A2721]/20 rounded-xl text-xs font-bold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={item.desc}
                  onChange={e => handleHighlightChange(idx, 'desc', e.target.value)}
                  placeholder="Card description..."
                  className="w-full px-3 py-1.5 bg-white border border-[#3A2721]/20 rounded-xl font-sans text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex items-center justify-between pt-4 border-t border-[#3A2721]/15">
          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-1.5 text-[#5E7252] text-xs font-bold font-sans animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Changes saved and published live!</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 bg-[#3D261E] hover:bg-[#C97D36] text-white text-xs font-semibold rounded-full tracking-wide shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Publishing Updates...' : 'Save & Publish Live Site'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
