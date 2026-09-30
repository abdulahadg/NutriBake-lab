import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TeamMember } from '../../types';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  GraduationCap, 
  Code2, 
  FlaskConical, 
  ShieldCheck, 
  Save,
  Tag
} from 'lucide-react';
import { formatToTitleCase, validateRequiredText } from '../../utils/validation';

export const TeamManager: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, addToast } = useApp();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'swe' | 'nutrition'>('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [department, setDepartment] = useState('Department of Software Engineering');
  const [subRole, setSubRole] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [institution, setInstitution] = useState('University of Sindh, Jamshoro');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName('');
    setRole('');
    setBio('');
    setDepartment('Department of Software Engineering');
    setSubRole('');
    setIdNumber('');
    setInstitution('University of Sindh, Jamshoro');
    setExpertiseInput('');
    setErrors({});
    setEditingMember(null);
    setIsModalOpen(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setBio(member.bio || member.focus || '');
    setDepartment(member.department || 'Department of Software Engineering');
    setSubRole(member.subRole || '');
    setIdNumber(member.idNumber || '');
    setInstitution(member.institution || 'University of Sindh, Jamshoro');
    setExpertiseInput(Array.isArray(member.expertise) ? member.expertise.join(', ') : '');
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameCheck = validateRequiredText(name, 'Full name', 2, 80);
    if (!nameCheck.isValid) {
      newErrors.name = nameCheck.message!;
    }

    const roleCheck = validateRequiredText(role, 'Role or position', 2, 100);
    if (!roleCheck.isValid) {
      newErrors.role = roleCheck.message!;
    }

    const bioCheck = validateRequiredText(bio, 'Bio or research description', 5, 2000);
    if (!bioCheck.isValid) {
      newErrors.bio = bioCheck.message!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast('Validation', 'Please fill in the required fields correctly.', 'warning');
      return;
    }

    setIsSubmitting(true);
    const parsedExpertise = expertiseInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      if (editingMember) {
        const success = await updateTeamMember(editingMember.id, {
          name: name.trim(),
          role: role.trim(),
          bio: bio.trim(),
          focus: bio.trim(),
          department: department.trim(),
          subRole: subRole.trim(),
          idNumber: idNumber.trim(),
          institution: institution.trim(),
          expertise: parsedExpertise
        });
        if (success) {
          resetForm();
        }
      } else {
        const success = await addTeamMember({
          name: name.trim(),
          role: role.trim(),
          bio: bio.trim(),
          focus: bio.trim(),
          department: department.trim(),
          subRole: subRole.trim(),
          idNumber: idNumber.trim(),
          institution: institution.trim(),
          expertise: parsedExpertise
        });
        if (success) {
          resetForm();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (window.confirm(`Are you sure you want to remove "${memberName}" from the team directory?`)) {
      await deleteTeamMember(id);
    }
  };

  // Filter members
  const filteredMembers = teamMembers.filter(m => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      m.name.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      (m.bio && m.bio.toLowerCase().includes(q)) ||
      (m.department && m.department.toLowerCase().includes(q)) ||
      (m.idNumber && m.idNumber.toLowerCase().includes(q));

    let matchesDept = true;
    if (departmentFilter === 'swe') {
      matchesDept = Boolean(m.department?.toLowerCase().includes('software') || m.department?.toLowerCase().includes('swe'));
    } else if (departmentFilter === 'nutrition') {
      matchesDept = Boolean(m.department?.toLowerCase().includes('nutrition') || m.department?.toLowerCase().includes('food'));
    }

    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCF] pb-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider font-bold text-[#5E7252] block">
            Academic Authorship & Directory
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#3D261E]">
            Team Management
          </h2>
          <p className="text-xs text-[#2A1F1B]/75 mt-1 font-sans">
            Manage project team members, roles, academic departments, and research descriptions. Connected directly to the Supabase <code className="font-mono bg-[#FAF0E4] px-1.5 py-0.5 rounded text-[#C97D36]">team</code> table.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#3D261E] bg-[#FAF0E4] px-3 py-1.5 rounded-full border border-[#E8DDCF]">
            {teamMembers.length} Members
          </span>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-[#3D261E] text-white hover:bg-[#C97D36] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* CONTROLS BAR: SEARCH & DEPARTMENT FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3D261E]/40" />
          <input
            type="text"
            placeholder="Search team member by name, role, roll #..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none focus:border-[#C97D36] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#E8DDCF] text-xs font-semibold self-start sm:self-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setDepartmentFilter('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              departmentFilter === 'all'
                ? 'bg-[#3D261E] text-white shadow-2xs'
                : 'text-[#2A1F1B]/70 hover:text-[#3D261E]'
            }`}
          >
            All Departments ({teamMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setDepartmentFilter('swe')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              departmentFilter === 'swe'
                ? 'bg-[#3D261E] text-white shadow-2xs'
                : 'text-[#2A1F1B]/70 hover:text-[#3D261E]'
            }`}
          >
            Software Eng.
          </button>
          <button
            type="button"
            onClick={() => setDepartmentFilter('nutrition')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
              departmentFilter === 'nutrition'
                ? 'bg-[#3D261E] text-white shadow-2xs'
                : 'text-[#2A1F1B]/70 hover:text-[#3D261E]'
            }`}
          >
            Food Science
          </button>
        </div>
      </div>

      {/* TEAM MEMBERS GRID */}
      {filteredMembers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#E8DDCF] space-y-3">
          <Users className="w-10 h-10 text-[#C97D36]/40 mx-auto" />
          <h3 className="font-serif text-lg text-[#3D261E]">No Team Members Found</h3>
          <p className="text-xs text-[#2A1F1B]/60 max-w-sm mx-auto">
            {searchQuery ? `No members match query "${searchQuery}".` : 'Add your first team member using the button above.'}
          </p>
          {searchQuery && (
            <button
              onClick={() => { setSearchQuery(''); setDepartmentFilter('all'); }}
              className="text-xs font-semibold text-[#C97D36] hover:underline"
            >
              Clear Search Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('');
            const isSwe = member.department?.toLowerCase().includes('software') || member.department?.toLowerCase().includes('swe');

            return (
              <div 
                key={member.id}
                className="p-5 bg-white border border-[#E8DDCF] rounded-2xl shadow-2xs flex flex-col justify-between hover:shadow-md hover:border-[#C97D36]/60 transition-all group"
              >
                <div className="space-y-3.5">
                  {/* Top Bar: Department Tag & Action Buttons */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
                      isSwe 
                        ? 'bg-[#FAF0E4] text-[#C97D36] border-[#EAD2B9]' 
                        : 'bg-[#EEF3EB] text-[#5E7252] border-[#D4E0CD]'
                    }`}>
                      {isSwe ? 'Software Eng.' : 'Food Science'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="p-1.5 rounded-lg text-[#2A1F1B]/60 hover:text-[#C97D36] hover:bg-[#FAF0E4] transition-colors"
                        title="Edit team member"
                        aria-label={`Edit ${member.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(member.id, member.name)}
                        className="p-1.5 rounded-lg text-[#2A1F1B]/60 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete team member"
                        aria-label={`Delete ${member.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Member Name & Initials Badge (NO IMAGES) */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-serif font-bold text-sm shrink-0 border ${
                      isSwe
                        ? 'bg-[#FAF0E4] text-[#C97D36] border-[#EAD2B9]'
                        : 'bg-[#EEF3EB] text-[#5E7252] border-[#D4E0CD]'
                    }`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif text-base font-medium text-[#3D261E] truncate group-hover:text-[#C97D36] transition-colors">
                        {member.name}
                      </h4>
                      <p className="text-xs font-semibold text-[#C97D36] truncate">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Sub-Role or Roll Number */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {member.subRole && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-[#E8DDCF] text-[#2A1F1B]/80 font-medium">
                        {member.subRole}
                      </span>
                    )}
                    {member.idNumber && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF0E4] border border-[#EAD2B9] text-[#C97D36] font-mono font-bold">
                        {member.idNumber}
                      </span>
                    )}
                  </div>

                  {/* Bio / Description */}
                  <p className="text-xs text-[#2A1F1B]/75 leading-relaxed line-clamp-3">
                    <strong className="text-[#3D261E] font-medium">Focus: </strong>
                    {member.bio || member.focus}
                  </p>

                  {/* Expertise Badges */}
                  {Array.isArray(member.expertise) && member.expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {member.expertise.map((exp, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E8DDCF] text-[#3D261E]/80 font-medium">
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Institution */}
                <div className="pt-3 mt-3 border-t border-[#E8DDCF]/80 flex items-center justify-between text-[11px] text-[#2A1F1B]/60">
                  <span className="truncate">{member.institution || 'University of Sindh, Jamshoro'}</span>
                  <span className="font-mono text-[10px] text-[#5E7252] shrink-0 font-medium">
                    DB Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* TEAM MEMBER ADD / EDIT MODAL (Text/data only, no images)  */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A1F1B]/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto"
          onClick={resetForm}
        >
          <div 
            className="relative w-full max-w-xl bg-white border border-[#E8DDCF] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 my-auto max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#E8DDCF] pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#5E7252] tracking-wider block font-mono">
                  {editingMember ? 'Update Profile' : 'New Authorship Record'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#3D261E]">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="p-1.5 hover:bg-[#FAF7F2] text-[#2A1F1B]/60 hover:text-[#3D261E] rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3D261E] block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abdul Hannan Memon"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none ${
                    errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#E8DDCF] focus:border-[#C97D36]'
                  }`}
                />
                {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
              </div>

              {/* 2. Role / Position */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3D261E] block">
                  Role / Position <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Group Leader | Frontend & Analyst"
                  value={role}
                  onChange={e => {
                    setRole(e.target.value);
                    if (errors.role) setErrors(prev => ({ ...prev, role: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none ${
                    errors.role ? 'border-red-500 focus:border-red-500' : 'border-[#E8DDCF] focus:border-[#C97D36]'
                  }`}
                />
                {errors.role && <p className="text-[11px] text-red-500">{errors.role}</p>}
              </div>

              {/* 3. Department */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3D261E] block">
                  Academic Department
                </label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] focus:outline-none focus:border-[#C97D36]"
                >
                  <option value="Department of Software Engineering">Department of Software Engineering</option>
                  <option value="Nutrition & Food Science Department">Nutrition & Food Science Department</option>
                  <option value="Faculty of Engineering & Technology">Faculty of Engineering & Technology</option>
                  <option value="Faculty of Natural Sciences">Faculty of Natural Sciences</option>
                </select>
              </div>

              {/* 4. Sub-Role / Title & ID / Roll Number (Two-Column) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3D261E] block">
                    Sub-Role / Title (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Founder & CEO, IDH"
                    value={subRole}
                    onChange={e => setSubRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none focus:border-[#C97D36]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#3D261E] block">
                    Roll / ID Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 08/2K23/SWE"
                    value={idNumber}
                    onChange={e => setIdNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none focus:border-[#C97D36]"
                  />
                </div>
              </div>

              {/* 5. Bio / Description / Focus */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3D261E] block">
                  Bio / Research Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe member focus, project contributions, and core responsibilities..."
                  value={bio}
                  onChange={e => {
                    setBio(e.target.value);
                    if (errors.bio) setErrors(prev => ({ ...prev, bio: '' }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none ${
                    errors.bio ? 'border-red-500 focus:border-red-500' : 'border-[#E8DDCF] focus:border-[#C97D36]'
                  }`}
                />
                {errors.bio && <p className="text-[11px] text-red-500">{errors.bio}</p>}
              </div>

              {/* 6. Expertise / Key Focus Areas (Comma-separated) */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3D261E] block">
                  Expertise & Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend UI/UX, Python, AI, Nutrition"
                  value={expertiseInput}
                  onChange={e => setExpertiseInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none focus:border-[#C97D36]"
                />
                <span className="text-[10px] text-[#2A1F1B]/50 block">
                  Separate multiple tags with commas.
                </span>
              </div>

              {/* 7. Institution */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#3D261E] block">
                  Institution
                </label>
                <input
                  type="text"
                  placeholder="University of Sindh, Jamshoro"
                  value={institution}
                  onChange={e => setInstitution(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E8DDCF] rounded-xl text-xs text-[#2A1F1B] placeholder-[#2A1F1B]/40 focus:outline-none focus:border-[#C97D36]"
                />
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-[#E8DDCF] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#2A1F1B]/70 hover:text-[#3D261E] hover:bg-[#FAF7F2] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#3D261E] text-white hover:bg-[#C97D36] rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : editingMember ? 'Save Changes' : 'Add Member'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
