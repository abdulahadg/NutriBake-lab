import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Plus, Trash2, ShieldAlert, Heart, Edit2, Check, AlertCircle } from 'lucide-react';
import { ChildFamilyProfile } from '../../types';
import { formatToTitleCase, validateRequiredText, validateNumericField } from '../../utils/validation';

export const FamilyProfileManager: React.FC = () => {
  const { familyProfiles, addFamilyProfile, deleteFamilyProfile, updateFamilyProfile, products, addToast } = useApp();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(8);
  const [fiberTarget, setFiberTarget] = useState<number>(20);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([products[0]?.name || '']);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const commonAllergens = ['Peanuts', 'Tree Nuts', 'Gluten', 'Dairy', 'Sesame', 'Eggs', 'Soy'];

  const toggleAllergen = (allergen: string) => {
    if (allergies.includes(allergen)) {
      setAllergies(allergies.filter(a => a !== allergen));
    } else {
      setAllergies([...allergies, allergen]);
    }
  };

  const handleNameBlur = () => {
    if (name.trim()) {
      const formatted = formatToTitleCase(name);
      setName(formatted);
      const res = validateRequiredText(formatted, 'Full name', 2, 60);
      setErrors(prev => ({ ...prev, name: res.isValid ? '' : res.message! }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameCheck = validateRequiredText(name, 'Full name', 2, 60);
    if (!nameCheck.isValid) {
      newErrors.name = nameCheck.message!;
    }

    const ageCheck = validateNumericField(age, 'Age', 1, 100);
    if (!ageCheck.isValid) {
      newErrors.age = ageCheck.message!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Validation', 'Please provide a valid dependent name and age.', 'warning');
      return;
    }

    addFamilyProfile({
      name: formatToTitleCase(name),
      age: Number(age),
      fiberTarget: Number(fiberTarget),
      allergies,
      favoriteProducts: selectedFavorites,
      notes: notes.trim() || 'Child-friendly functional bakery protocol.'
    });

    addToast('Profile Added', `${formatToTitleCase(name)}'s nutrition profile created.`, 'success');
    setIsAddOpen(false);
    setName('');
    setNotes('');
    setAllergies([]);
    setErrors({});
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#3A2721]/15 pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
            Pediatric & Family Protocol
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#3A2721] font-normal tracking-snug-title">
            Family & Dependent Profiles
          </h3>
          <p className="font-mono text-xs text-[#29211E]/70 mt-1">
            Ensure high fiber, prebiotic breakfast snacks comply with your children's allergen limits and school requirements.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-5 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] text-xs font-mono uppercase tracking-editorial font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {familyProfiles.map((member) => (
          <div 
            key={member.id} 
            className="bg-white border border-[#3A2721]/15 p-6 space-y-4 hover:border-[#3A2721]/30 transition-colors"
          >
            <div className="flex items-start justify-between border-b border-[#3A2721]/10 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-editorial text-[#657258] font-bold block">
                  Dependent Profile
                </span>
                <h4 className="font-serif text-2xl text-[#3A2721] font-normal">{member.name}</h4>
                <p className="font-mono text-xs text-[#29211E]/70">Age: {member.age} years old</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => deleteFamilyProfile(member.id)}
                  className="p-1.5 text-[#29211E]/40 hover:text-rose-700 transition-colors"
                  title="Remove Profile"
                >
                  <Trash2 className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-[#FAF5ED] border border-[#3A2721]/10">
                <span className="text-[9.5px] uppercase text-[#29211E]/60 block font-bold">Daily Fiber Goal</span>
                <span className="font-serif text-2xl text-[#657258] block mt-0.5">{member.fiberTarget}g</span>
                <span className="text-[10px] text-[#29211E]/50">Age-specific prebiotic</span>
              </div>

              <div className="p-3 bg-[#FAF5ED] border border-[#3A2721]/10">
                <span className="text-[9.5px] uppercase text-[#A96345] block font-bold">Allergy Safety</span>
                <span className="text-xs font-bold text-[#3A2721] block mt-1.5">
                  {member.allergies.length === 0 ? 'No reported allergies' : member.allergies.join(', ')}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#3A2721] block">
                Approved School & Snack Formulations:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {member.favoriteProducts.map((fav, idx) => (
                  <span key={idx} className="font-mono text-[10px] px-2.5 py-1 bg-[#3A2721]/5 text-[#3A2721]">
                    {fav}
                  </span>
                ))}
              </div>
            </div>

            {member.notes && (
              <p className="font-mono text-[11px] text-[#29211E]/70 border-t border-[#3A2721]/10 pt-3 leading-relaxed">
                Note: {member.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29211E]/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsAddOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#FAF5ED] border border-[#3A2721] p-6 sm:p-8 space-y-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#3A2721]/10 pb-4">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-editorial font-bold text-[#657258] block">
                  Family Nutrition
                </span>
                <h4 className="font-serif text-2xl text-[#3A2721] font-normal">Add Child / Dependent</h4>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="font-mono text-xs uppercase hover:text-[#A96345]"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-mono" noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    onBlur={handleNameBlur}
                    placeholder="e.g. Zayd Lin"
                    className={`w-full px-3 py-2 bg-white border font-sans text-xs ${
                      errors.name ? 'border-red-500' : 'border-[#3A2721]/20'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                    Age (Years) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="18"
                    value={age}
                    onChange={e => {
                      setAge(Number(e.target.value));
                      if (errors.age) setErrors(prev => ({ ...prev, age: '' }));
                    }}
                    className={`w-full px-3 py-2 bg-white border text-xs ${
                      errors.age ? 'border-red-500' : 'border-[#3A2721]/20'
                    }`}
                  />
                  {errors.age && (
                    <p className="text-[11px] text-red-600 font-mono flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.age}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Daily Dietary Fiber Target (Grams)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="14"
                    max="35"
                    value={fiberTarget}
                    onChange={e => setFiberTarget(Number(e.target.value))}
                    className="flex-1 accent-[#3A2721]"
                  />
                  <span className="font-bold text-sm text-[#657258] w-12">{fiberTarget}g</span>
                </div>
                <span className="text-[10px] text-[#29211E]/60 block mt-1">
                  AAP Guidelines suggest (Age + 5g) up to 25g/day for healthy digestion.
                </span>
              </div>

              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Known Allergies & Intolerances <span className="font-normal text-[#29211E]/50 lowercase">(optional)</span>
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {commonAllergens.map(allergen => (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => toggleAllergen(allergen)}
                      className={`px-2.5 py-1 text-[11px] font-mono border transition-colors ${
                        allergies.includes(allergen)
                          ? 'bg-rose-100 border-rose-400 text-rose-800 font-bold'
                          : 'bg-white border-[#3A2721]/20 text-[#29211E]/70 hover:bg-[#FAF5ED]'
                      }`}
                    >
                      {allergies.includes(allergen) ? `✓ ${allergen}` : `+ ${allergen}`}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-editorial font-bold text-[#3A2721] mb-1">
                  Pediatric Care Notes <span className="font-normal text-[#29211E]/50 lowercase">(optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Needs peanut-free certification for school lunchbox."
                  className="w-full px-3 py-2 bg-white border border-[#3A2721]/20 font-sans text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#3A2721]/10">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-2.5 border border-[#3A2721]/25 text-[#3A2721] uppercase tracking-editorial font-semibold text-[11px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3A2721] hover:bg-[#2A1C18] text-[#FAF5ED] uppercase tracking-editorial font-semibold text-[11px]"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
