import React, { useRef, useState } from 'react';
import Header from './Header';
import { useUser } from '../context/UserContext';
import { Edit2, CheckCircle, ChevronRight, ChevronLeft, X } from 'lucide-react';

const PROFILE_SECTIONS = [
  {
    title: 'Personal Info',
    fields: [
      { key: 'fullName', label: 'Full Name', type: 'text' },
      { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
      { key: 'dob', label: 'Date of Birth', type: 'date' },
    ],
  },
  {
    title: 'Health',
    fields: [
      { key: 'height', label: 'Height (cm)', type: 'number' },
      { key: 'weight', label: 'Weight (kg)', type: 'number' },
      { key: 'activityLevel', label: 'Activity Level', type: 'select', options: ['Sedentary', 'Light', 'Moderate', 'Very', 'Super'] },
      { key: 'fitnessGoal', label: 'Fitness Goal', type: 'text' },
      { key: 'dietaryPreference', label: 'Dietary Preference', type: 'select', options: ['Veg', 'Non-Veg', 'Vegan', 'Other'] },
      { key: 'sleepHours', label: 'Sleep Hours (avg)', type: 'number' },
      { key: 'stressLevel', label: 'Stress Level (1-10)', type: 'number' },
      { key: 'medicalConditions', label: 'Medical Conditions', type: 'text' },
    ],
  },
  {
    title: 'Preferences',
    fields: [
      { key: 'motivation', label: 'Motivation', type: 'text' },
      { key: 'howHeard', label: 'How did you hear about us?', type: 'text' },
      { key: 'address', label: 'Address', type: 'text' },
      { key: 'city', label: 'City', type: 'text' },
      { key: 'country', label: 'Country', type: 'text' },
    ],
  },
];

const getAllFields = () => PROFILE_SECTIONS.flatMap(s => s.fields);

const Dashboard: React.FC = () => {
  const { user, setUser } = useUser();
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(0); // for future multi-step

  // Profile completion
  const allFields = getAllFields();
  const filledFields = allFields.filter(f => user?.[f.key]);
  const completion = Math.round((filledFields.length / allFields.length) * 100);

  // Animated progress ring (SVG)
  const radius = 48;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress = completion / 100;
  const strokeDashoffset = circumference - progress * circumference;

  // Inline edit logic
  const handleEdit = (field: any) => {
    setEditing(field.key);
    setEditValue(user?.[field.key] || '');
  };
  const handleCancel = () => {
    setEditing(null);
    setEditValue('');
  };
  const handleSave = async (field: any) => {
    setSaving(true);
    const updated = { ...user, [field.key]: editValue };
    setUser(updated);
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    setSaving(false);
    setEditing(null);
    setEditValue('');
  };

  // Navigation for future steps
  const handleNext = () => setPage(p => p + 1);
  const handleBack = () => setPage(p => Math.max(0, p - 1));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center py-16">
        <div className="liquid-glass dark:liquid-glass-dark rounded-3xl shadow-2xl p-0 md:p-0 flex flex-col items-center border border-gray-200 max-w-2xl w-full animate-fade-in relative overflow-hidden">
          {/* Profile card with avatar, name, and animated progress ring */}
          <div className="w-full flex flex-col items-center justify-center pt-10 pb-6 px-6 bg-gradient-to-br from-white/60 to-blue-100/40 dark:from-gray-900/60 dark:to-gray-800/40 rounded-t-3xl relative">
            <div className="relative mb-2">
              <svg height={radius * 2} width={radius * 2} className="absolute top-0 left-0">
                <circle
                  stroke="#e5e7eb"
                  fill="transparent"
                  strokeWidth={stroke}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                />
                <circle
                  stroke="url(#profile-progress)"
                  fill="transparent"
                  strokeWidth={stroke}
                  strokeDasharray={circumference + ' ' + circumference}
                  style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="profile-progress" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shadow-lg relative z-10">
                {user?.photo ? (
                  <img src={user.photo} alt="Profile" className="object-cover w-full h-full" />
                ) : user?.defaultAvatar ? (
                  <span className="text-4xl select-none">{user.defaultAvatar}</span>
                ) : (
                  <span className="text-4xl text-gray-400 select-none">👤</span>
                )}
              </div>
              {completion === 100 && (
                <span className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-1 border-2 border-white dark:border-gray-900 shadow-md animate-pulse-glow">
                  <CheckCircle className="w-6 h-6" />
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-1 drop-shadow-sm">{user?.fullName || user?.username || 'Welcome!'}</h1>
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-2">Profile Completion: <span className="font-bold text-green-600">{completion}%</span></div>
          </div>
          {/* Sectioned, grouped fields as modern inline editable rows, now as separate cards */}
          <div className="w-full flex flex-col gap-10 px-4 md:px-8 pb-32 pt-2 max-w-3xl mx-auto">
            {PROFILE_SECTIONS.map(section => (
              <div
                key={section.title}
                className="rounded-3xl shadow-2xl bg-white/70 dark:bg-gray-900/70 border border-gray-200 dark:border-gray-800 p-0 md:p-0 flex flex-col aspect-[1.2/1] min-h-[260px] max-w-full mb-0"
                style={{ marginBottom: '0' }}
              >
                <div className="px-8 pt-8 pb-2">
                  <div className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-4 tracking-wide">{section.title}</div>
                </div>
                <div className="flex flex-col gap-3 px-8 pb-8">
                  {section.fields.map(field => {
                    // Context-aware pretext for empty fields
                    let pretext = '';
                    switch (field.key) {
                      case 'fullName': pretext = 'Enter your full name'; break;
                      case 'gender': pretext = 'Select your gender'; break;
                      case 'dob': pretext = 'Enter your date of birth'; break;
                      case 'height': pretext = 'Enter your height in cm'; break;
                      case 'weight': pretext = 'Enter your weight in kg'; break;
                      case 'activityLevel': pretext = 'Select your activity level'; break;
                      case 'fitnessGoal': pretext = 'Describe your fitness goal'; break;
                      case 'dietaryPreference': pretext = 'Select your dietary preference'; break;
                      case 'sleepHours': pretext = 'Average sleep hours'; break;
                      case 'stressLevel': pretext = 'Rate your stress (1-10)'; break;
                      case 'medicalConditions': pretext = 'List any medical conditions'; break;
                      case 'motivation': pretext = 'What motivates you?'; break;
                      case 'howHeard': pretext = 'How did you hear about us?'; break;
                      case 'address': pretext = 'Enter your address'; break;
                      case 'city': pretext = 'Enter your city'; break;
                      case 'country': pretext = 'Enter your country'; break;
                      default: pretext = 'Enter value';
                    }
                    const isEmpty = !user?.[field.key];
                    const isEditing = editing === field.key || isEmpty;
                    return (
                      <div
                        key={field.key}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl shadow-md bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-semibold text-base cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-all`}
                        onClick={() => !isEditing && setEditing(field.key)}
                        tabIndex={0}
                        aria-label={`Edit ${field.label}`}
                        role="button"
                      >
                        <span className="w-40 text-gray-700 dark:text-gray-200 font-semibold select-none">{field.label}</span>
                        {isEditing ? (
                          <>
                            {field.key === 'gender' ? (
                              <select
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white/90 text-gray-900 text-base"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={() => handleSave(field)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSave(field); } }}
                                autoFocus
                                aria-label="Select gender"
                              >
                                <option value="">{pretext}</option>
                                {field.options?.map((opt: string) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : field.key === 'dob' ? (
                              <input
                                type="date"
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white/90 text-gray-900 text-base"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={() => handleSave(field)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSave(field); } }}
                                autoFocus
                                aria-label="Select date of birth"
                                placeholder={pretext}
                              />
                            ) : field.key === 'stressLevel' ? (
                              <div className="flex-1 flex items-center gap-4">
                                <input
                                  type="range"
                                  min={1}
                                  max={10}
                                  value={editValue || 5}
                                  onChange={e => setEditValue(e.target.value)}
                                  onBlur={() => handleSave(field)}
                                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSave(field); } }}
                                  className="w-full accent-green-500"
                                  aria-label="Rate your stress (1-10)"
                                />
                                <span className="w-10 text-center font-bold text-lg text-blue-600">{editValue || 5}</span>
                              </div>
                            ) : field.type === 'select' ? (
                              <select
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white/90 text-gray-900 text-base"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={() => handleSave(field)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSave(field); } }}
                                autoFocus
                                aria-label={pretext}
                              >
                                <option value="">{pretext}</option>
                                {field.options?.map((opt: string) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type={field.type}
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 bg-white/90 text-gray-900 text-base"
                                value={editValue}
                                onChange={e => setEditValue(e.target.value)}
                                onBlur={() => handleSave(field)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSave(field); } }}
                                autoFocus
                                aria-label={pretext}
                                placeholder={pretext}
                              />
                            )}
                            {user?.[field.key] && (
                              <button className="ml-1 px-2 py-2 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-all" onClick={e => { e.stopPropagation(); handleCancel(); }}><X className="w-5 h-5 inline" /></button>
                            )}
                          </>
                        ) : (
                          <>
                            <span className={`flex-1 ${user?.[field.key] ? '' : 'italic text-gray-400'}`}>{user?.[field.key] || pretext}</span>
                            <button className="ml-2 px-2 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all" style={{ color: '#f3f4f6' }} onClick={e => { e.stopPropagation(); setEditing(field.key); setEditValue(user?.[field.key] || ''); }} type="button"><Edit2 className="w-4 h-4" /></button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {/* Navigation: Next/Back (for future steps) */}
          <div className="fixed bottom-10 right-10 z-50 flex gap-4">
            {page > 0 && (
              <button
                onClick={handleBack}
                className="bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 px-8 py-4 rounded-full shadow-xl text-lg font-bold flex items-center gap-2 hover:scale-105 transition-all animate-fade-in"
              >
                <ChevronLeft className="w-6 h-6" /> Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-full shadow-xl text-lg font-bold flex items-center gap-2 hover:scale-105 transition-all animate-fade-in"
            >
              Next <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 