interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
};

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  return (
    <svg
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M155.648 159.744C70.9316 244.46 70.9316 387.548 155.648 472.264L472.264 788.88C556.98 873.596 700.068 873.596 784.784 788.88C869.5 704.164 869.5 561.076 784.784 476.36L468.168 159.744C383.452 75.0276 240.364 75.0276 155.648 159.744Z"
        fill="url(#paint0_linear)"
      />
      
      {/* Top shelf - bottle and fruits */}
      <rect x="264" y="220" width="200" height="80" rx="8" fill="white" opacity="0.9"/>
      <ellipse cx="320" cy="240" rx="12" ry="25" fill="#2D5A3D"/>
      <circle cx="380" cy="250" r="15" fill="#228B22"/>
      <circle cx="420" cy="245" r="12" fill="#32CD32"/>
      
      {/* Middle shelf - fridge and bread */}
      <rect x="264" y="340" width="200" height="80" rx="8" fill="white" opacity="0.9"/>
      <rect x="280" y="355" width="40" height="50" rx="4" fill="#2D5A3D"/>
      <rect x="285" y="360" width="8" height="20" fill="white"/>
      <ellipse cx="400" cy="380" rx="35" ry="20" fill="#8B4513"/>
      <path d="M375 375 Q400 365 425 375 Q420 385 400 385 Q380 385 375 375Z" fill="white"/>
      
      {/* Bottom shelf - vegetables */}
      <rect x="264" y="460" width="200" height="80" rx="8" fill="white" opacity="0.9"/>
      <path d="M320 480 Q340 470 360 480 Q355 500 340 505 Q325 500 320 480Z" fill="#228B22"/>
      <path d="M330 475 Q340 470 350 475" stroke="#32CD32" strokeWidth="2" fill="none"/>
      
      <defs>
        <linearGradient id="paint0_linear" x1="155.648" y1="159.744" x2="784.784" y2="788.88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B4332"/>
          <stop offset="25%" stopColor="#2D5A3D"/>
          <stop offset="50%" stopColor="#40916C"/>
          <stop offset="75%" stopColor="#52B788"/>
          <stop offset="100%" stopColor="#74C69D"/>
        </linearGradient>
      </defs>
    </svg>
  );
}