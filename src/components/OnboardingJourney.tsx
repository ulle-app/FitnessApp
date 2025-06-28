import React from 'react';

// Props: steps (array of {icon}), currentStep (number), avatar (image or emoji)
interface OnboardingJourneyProps {
  steps: { icon: React.ReactNode }[];
  currentStep: number;
  avatar: string | React.ReactNode;
}

// Example SVG path points for a winding journey (can be customized)
const PATH = "M40,200 Q120,100 200,200 T360,200 Q440,300 520,200 T680,200";
const NODE_POSITIONS = [0, 0.2, 0.4, 0.6, 0.8, 1]; // Normalized positions along the path (0=start, 1=end)

// Helper to get point on SVG path at t (0-1)
function getPointAtLength(path: SVGPathElement, t: number) {
  const len = path.getTotalLength();
  return path.getPointAtLength(len * t);
}

const OnboardingJourney: React.FC<OnboardingJourneyProps> = ({ steps, currentStep, avatar }) => {
  const pathRef = React.useRef<SVGPathElement>(null);
  const [avatarPos, setAvatarPos] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (pathRef.current) {
      const t = NODE_POSITIONS[currentStep] ?? 0;
      const pt = getPointAtLength(pathRef.current, t);
      setAvatarPos({ x: pt.x, y: pt.y });
    }
  }, [currentStep]);

  return (
    <div className="w-full flex flex-col items-center justify-center relative" style={{ minHeight: 280 }}>
      <svg viewBox="0 0 720 400" width="100%" height="220" className="overflow-visible">
        {/* Path */}
        <path
          ref={pathRef}
          d={PATH}
          fill="none"
          stroke="#a5b4fc"
          strokeWidth={10}
          strokeDasharray="8 8"
          strokeLinecap="round"
        />
        {/* Step nodes */}
        {steps.map((step, idx) => {
          if (!pathRef.current) return null;
          const t = NODE_POSITIONS[idx] ?? 0;
          const pt = getPointAtLength(pathRef.current, t);
          return (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={currentStep === idx ? 28 : 20}
                fill={currentStep === idx ? '#34d399' : '#fff'}
                stroke={currentStep === idx ? '#10b981' : '#a5b4fc'}
                strokeWidth={currentStep === idx ? 5 : 3}
                style={{ filter: currentStep === idx ? 'drop-shadow(0 0 8px #10b98188)' : undefined }}
              />
              <foreignObject x={pt.x - 16} y={pt.y - 16} width={32} height={32} style={{ pointerEvents: 'none' }}>
                <div className="flex items-center justify-center w-8 h-8 text-xl">
                  {step.icon}
                </div>
              </foreignObject>
            </g>
          );
        })}
        {/* Animated avatar */}
        {pathRef.current && (
          <foreignObject x={avatarPos.x - 32} y={avatarPos.y - 56} width={64} height={64} style={{ pointerEvents: 'none' }}>
            <div className="flex items-center justify-center w-16 h-16 rounded-full border-4 border-green-400 bg-white shadow-xl text-3xl animate-bounce">
              {typeof avatar === 'string' ? <img src={avatar} alt="avatar" className="w-full h-full object-cover rounded-full" /> : avatar}
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default OnboardingJourney; 