import React from 'react';

interface WorkoutCardProps {
  name: string;
  img?: string;
  sets: number;
  reps: number | string;
  muscle_group?: string;
  goal?: string;
  level?: string;
  equipment?: string;
  instructions?: string;
  className?: string;
}

const accentColors = [
  'from-blue-400 to-blue-600',
  'from-green-400 to-green-600',
  'from-pink-400 to-pink-600',
  'from-purple-400 to-purple-600',
  'from-orange-400 to-orange-600',
];

const WorkoutCard: React.FC<WorkoutCardProps> = ({
  name,
  img,
  sets,
  reps,
  muscle_group,
  goal,
  level,
  equipment,
  instructions,
  className = '',
}) => {
  // Pick accent color based on name hash
  const colorIdx = name ? name.charCodeAt(0) % accentColors.length : 0;
  const accent = accentColors[colorIdx];

  return (
    <div
      className={`relative flex flex-col md:flex-row gap-4 p-6 bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl items-center transition-all hover:scale-[1.025] hover:shadow-3xl ${className}`}
      style={{ minWidth: 0 }}
    >
      {/* Accent Bar */}
      <div className={`absolute left-0 top-0 h-full w-2 rounded-3xl bg-gradient-to-b ${accent}`} />
      {/* Image */}
      <img
        src={img || 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=400&q=80'}
        alt={name}
        className="w-24 h-24 md:w-28 md:h-28 object-cover rounded-2xl border-2 border-white/30 shadow-lg bg-white/10 flex-shrink-0 z-10"
        style={{ minWidth: 80 }}
      />
      {/* Content */}
      <div className="flex-1 flex flex-col gap-1 min-w-0 z-10">
        <div className="font-extrabold text-lg md:text-xl text-white truncate" title={name}>{name}</div>
        <div className="text-xs text-white/80 mt-1 truncate">Muscle: {muscle_group || '-'} | Goal: {goal || '-'} | Level: {level || '-'}</div>
        <div className="text-xs text-white/80 mt-1 truncate">Equipment: {equipment || '-'}</div>
        <div className="text-xs text-white/90 mt-1 font-semibold">Sets: {sets} &nbsp; Reps: {reps}</div>
        {instructions && <div className="text-xs text-white/60 mt-1 truncate">{instructions}</div>}
      </div>
    </div>
  );
};

export default WorkoutCard; 