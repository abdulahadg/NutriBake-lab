import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { validateEmail, validateRequiredText } from '../../utils/validation';

export const ContactPage: React.FC = () => {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameCheck = validateRequiredText(formData.name, 'Full name', 2, 80);
    if (!nameCheck.isValid) {
      newErrors.name = nameCheck.message!;
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) {
      newErrors.email = emailCheck.message!;
    }

    const messageCheck = validateRequiredText(formData.message, 'Message', 10, 2000);
    if (!messageCheck.isValid) {
      newErrors.message = messageCheck.message!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field: 'name' | 'email' | 'message') => {
    if (field === 'name') {
      const res = validateRequiredText(formData.name, 'Full name', 2, 80);
      setErrors(prev => ({ ...prev, name: res.isValid ? '' : res.message! }));
    } else if (field === 'email') {
      const res = validateEmail(formData.email);
      setErrors(prev => ({ ...prev, email: res.isValid ? '' : res.message! }));
    } else if (field === 'message') {
      const res = validateRequiredText(formData.message, 'Message', 10, 2000);
      setErrors(prev => ({ ...prev, message: res.isValid ? '' : res.message! }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast('Validation', 'Please fix the highlighted fields to send your message.', 'warning');
      return;
    }
    setIsSubmitted(true);
    addToast('Message Dispatched', 'Thank you. Your inquiry has been sent.', 'success');
  };

  const faqs = [
    {
      q: 'Are NutriBake products available for retail purchase?',
      a: 'NutriBake is currently a functional food research and bakery formulation project developed at the University of Sindh. We are testing small artisanal trial batches and sensory profiles while exploring production partnerships.'
    },
    {
      q: 'What makes green banana flour different from banana fruit?',
      a: 'Green banana flour is milled from unripened bananas before starches convert to sugars. It is rich in prebiotic Type-2 Resistant Starch (RS2) and has a mild, neutral flavor that behaves like wholesome grain flour without sweet banana flavor.'
    },
    {
      q: 'How does your recommendation system work?',
      a: 'The system evaluates your activity level, daily fiber targets, and allergen preferences against product nutritional profiles to suggest formulations with optimal prebiotic density and balanced satiety.'
    },
    {
      q: 'Are these formulations suitable for children and families?',
      a: 'Yes. Our Cupcakes, Cookies, and NutriBalls are crafted with whole seeds, natural plant flours, and gentle prebiotic fibers formulated to support digestion across all age groups.'
    }
  ];

  return (
    <div className="py-12 sm:py-24 px-4 sm:px-8 lg:px-12 max-w-6xl mx-auto space-y-12 sm:space-y-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-3">
        <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#657258] block">
          Academic & Clinical Liaison
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#3A2721] tracking-tight-title leading-[1.04] break-words">
          Contact & <span className="italic">Inquiries</span>.
        </h1>
        <p className="text-sm sm:text-[15px] text-[#29211E]/80 leading-[1.7] pt-1">
          Reach out regarding our formulations, functional baking science, or research collaboration.
        </p>
      </div>

      {/* Grid: Clean Form and Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          {isSubmitted ? (
            <div className="py-12 border-t border-b border-[#3A2721]/15 space-y-4">
              <div className="text-[#657258]">
                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] tracking-snug-title">
                Message Received
              </h3>
              <p className="text-sm sm:text-[15px] text-[#29211E]/80 max-w-md leading-[1.7]">
                Thank you for contacting NutriBake Studio. Our team will review your message and reply promptly.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                }}
                className="mt-4 px-7 py-3 bg-[#3A2721] text-[#FAF5ED] text-[11px] font-mono uppercase tracking-editorial font-semibold hover:bg-[#2A1C18] transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    onBlur={() => handleBlur('name')}
                    placeholder="Dr. / Prof. / Full Name"
                    className={`w-full py-2.5 bg-transparent border-b text-xs sm:text-sm text-[#29211E] placeholder-[#29211E]/40 focus:outline-none transition-colors ${
                      errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#3A2721]/20 focus:border-[#3A2721]'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onBlur={() => handleBlur('email')}
                    placeholder="name@institution.edu"
                    className={`w-full py-2.5 bg-transparent border-b text-xs sm:text-sm text-[#29211E] placeholder-[#29211E]/40 focus:outline-none transition-colors ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#3A2721]/20 focus:border-[#3A2721]'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                  Inquiry Topic (Optional)
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full py-2.5 bg-transparent border-b border-[#3A2721]/20 text-xs sm:text-sm text-[#3A2721] focus:outline-none focus:border-[#3A2721] cursor-pointer font-medium"
                >
                  <option value="General Inquiry">General Formulation Inquiry</option>
                  <option value="Academic Research">Academic & Research Collaboration</option>
                  <option value="Nutrition Science">Nutritional Assays & RS2 Data</option>
                  <option value="Tasting & Samples">Sensory Trial & Sampling Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10.5px] uppercase tracking-editorial font-semibold text-[#3A2721] block">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) setErrors(prev => ({ ...prev, message: '' }));
                  }}
                  onBlur={() => handleBlur('message')}
                  placeholder="Share details regarding your research, pilot program, or inquiry..."
                  className={`w-full py-2.5 bg-transparent border-b text-xs sm:text-sm text-[#29211E] placeholder-[#29211E]/40 focus:outline-none transition-colors resize-none leading-relaxed ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#3A2721]/20 focus:border-[#3A2721]'
                  }`}
                />
                {errors.message && (
                  <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="px-7 py-3.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-[11px] font-mono uppercase tracking-editorial font-semibold transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Details & FAQs */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-3 border-l-2 border-[#3A2721]/20 pl-6">
            <span className="font-display text-[10.5px] uppercase tracking-luxury font-semibold text-[#657258] block">
              Academic Lab Coordinates
            </span>
            <p className="text-xs sm:text-[13.5px] text-[#29211E]/80 leading-[1.7]">
              Department of Software Engineering<br />
              University of Sindh, Jamshoro, Pakistan<br />
              <a href="mailto:hello@nutribake.com" className="font-mono text-xs text-[#A96345] hover:underline mt-1.5 inline-block font-semibold">
                hello@nutribake.com
              </a>
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#3A2721]/15">
            <span className="font-display text-[11px] uppercase tracking-luxury font-semibold text-[#3A2721] block">
              Frequently Asked Questions
            </span>

            <div className="divide-y divide-[#3A2721]/15">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left py-1 group"
                    >
                      <span className="text-xs sm:text-[13px] font-medium text-[#3A2721] group-hover:text-[#A96345] transition-colors pr-2">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-3.5 h-3.5 text-[#3A2721] shrink-0" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-[#3A2721]/60 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <p className="text-xs sm:text-[12.5px] text-[#29211E]/75 leading-[1.65] pt-2">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
