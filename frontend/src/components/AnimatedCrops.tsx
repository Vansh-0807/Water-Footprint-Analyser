import React from 'react';

/* Grass blade cluster using pure CSS divs */
function GrassCluster({ left, delay = 0, size = 'md' }) {
  const heights = size === 'sm' 
    ? [18, 24, 16, 20, 14] 
    : size === 'lg' 
      ? [35, 45, 30, 40, 28, 38] 
      : [25, 32, 22, 28, 20, 30];

  return (
    <div 
      className="crop" 
      style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: `${left}%`, 
        animationDelay: `${delay}s`,
        display: 'flex',
        alignItems: 'flex-end',
        gap: '2px',
      }}
    >
      <div className="crop-sway" style={{ display: 'flex', alignItems: 'flex-end', gap: '2px' }}>
        {heights.map((h, i) => (
          <div 
            key={i} 
            style={{ 
              width: '2px', 
              height: `${h}px`, 
              background: i % 2 === 0 ? '#4d7c0f' : '#65a30d',
              opacity: 0.35 + (i * 0.05),
              borderRadius: '1px 1px 0 0',
              transform: `rotate(${(i - Math.floor(heights.length / 2)) * 4}deg)`,
              transformOrigin: 'bottom center',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* Wheat stalk */
function WheatStalk({ left, height = 90, delay = 0, swayClass = 'crop-sway' }) {
  return (
    <div 
      className="crop" 
      style={{ position: 'absolute', bottom: 0, left: `${left}%`, animationDelay: `${delay}s` }}
    >
      <div className={swayClass} style={{ position: 'relative' }}>
        {/* Stem */}
        <div style={{ 
          width: '2.5px', height: `${height}px`, 
          background: 'linear-gradient(to top, #4d7c0f, #65a30d)', 
          opacity: 0.5, borderRadius: '1px',
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        }} />
        {/* Wheat head */}
        <div style={{
          width: '8px', height: '18px',
          background: 'radial-gradient(ellipse, #ca8a04 40%, #a16207 100%)',
          opacity: 0.45, borderRadius: '40%',
          position: 'absolute', bottom: `${height - 2}px`, left: '50%', transform: 'translateX(-50%)',
        }} />
        {/* Leaf right */}
        <div style={{
          width: '14px', height: '2px', background: '#65a30d', opacity: 0.35,
          position: 'absolute', bottom: `${height * 0.35}px`, left: '50%',
          transform: 'rotate(-25deg)', transformOrigin: 'left center', borderRadius: '1px',
        }} />
        {/* Leaf left */}
        <div style={{
          width: '12px', height: '2px', background: '#65a30d', opacity: 0.35,
          position: 'absolute', bottom: `${height * 0.55}px`, right: '50%',
          transform: 'rotate(20deg)', transformOrigin: 'right center', borderRadius: '1px',
        }} />
      </div>
    </div>
  );
}

/* Realistic Corn Stalk */
function CornStalk({ left, height = 140, delay = 0, swayClass = 'crop-sway-slow' }) {
  return (
    <div className="crop" style={{ position: 'absolute', bottom: 0, left: `${left}%`, animationDelay: `${delay}s` }}>
      <div className={swayClass} style={{ position: 'relative' }}>
        {/* Thick segmented stem */}
        <div style={{
          width: '5px', height: `${height}px`,
          background: 'repeating-linear-gradient(to top, #3f6212, #3f6212 10px, #4d7c0f 10px, #4d7c0f 12px)',
          opacity: 0.85, borderRadius: '2px',
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)'
        }} />
        
        {/* Long drooping leaves */}
        <div style={{
          width: '35px', height: '6px', background: 'linear-gradient(to right, #4d7c0f, #22c55e)', opacity: 0.75,
          position: 'absolute', bottom: `${height * 0.3}px`, left: '50%',
          transform: 'rotate(-40deg)', transformOrigin: 'left center', borderRadius: '100% 0 100% 0'
        }} />
        <div style={{
          width: '40px', height: '6px', background: 'linear-gradient(to left, #4d7c0f, #22c55e)', opacity: 0.75,
          position: 'absolute', bottom: `${height * 0.55}px`, right: '50%',
          transform: 'rotate(45deg)', transformOrigin: 'right center', borderRadius: '0 100% 0 100%'
        }} />
        <div style={{
          width: '30px', height: '5px', background: 'linear-gradient(to right, #4d7c0f, #22c55e)', opacity: 0.75,
          position: 'absolute', bottom: `${height * 0.8}px`, left: '50%',
          transform: 'rotate(-30deg)', transformOrigin: 'left center', borderRadius: '100% 0 100% 0'
        }} />

        {/* Corn cobs */}
        <div style={{
          width: '8px', height: '22px', background: 'linear-gradient(to top, #eab308, #fef08a)',
          position: 'absolute', bottom: `${height * 0.45}px`, left: '50%', transform: 'translateX(-12px) rotate(-15deg)', borderRadius: '4px'
        }}>
          {/* Husk */}
          <div style={{ width: '4px', height: '20px', background: '#4d7c0f', position: 'absolute', left: '-2px', borderRadius: '2px', transform: 'rotate(-10deg)' }} />
        </div>
      </div>
    </div>
  );
}

/* Realistic Sunflower */
function Sunflower({ left, height = 120, delay = 0, swayClass = 'crop-sway' }) {
  // Generate 12 petals around the center
  const petals = Array.from({ length: 12 }).map((_, i) => (
    <div key={i} style={{
      position: 'absolute',
      width: '6px', height: '16px',
      background: 'linear-gradient(to top, #f59e0b, #fde047)',
      borderRadius: '50%',
      top: '-2px', left: '7px',
      transformOrigin: 'bottom center',
      transform: `rotate(${i * 30}deg) translateY(-8px)`
    }} />
  ));

  return (
    <div className="crop" style={{ position: 'absolute', bottom: 0, left: `${left}%`, animationDelay: `${delay}s` }}>
      <div className={swayClass} style={{ position: 'relative' }}>
        {/* Stem */}
        <div style={{
          width: '3px', height: `${height}px`,
          background: 'linear-gradient(to right, #166534, #22c55e)',
          opacity: 0.9, borderRadius: '2px',
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)'
        }} />
        
        {/* Broad Leaves */}
        <div style={{
          width: '18px', height: '10px', background: '#166534', opacity: 0.85,
          position: 'absolute', bottom: `${height * 0.4}px`, left: '50%',
          transform: 'rotate(-20deg)', transformOrigin: 'left center', borderRadius: '0 50% 0 50%'
        }} />
        <div style={{
          width: '16px', height: '8px', background: '#166534', opacity: 0.85,
          position: 'absolute', bottom: `${height * 0.65}px`, right: '50%',
          transform: 'rotate(25deg)', transformOrigin: 'right center', borderRadius: '50% 0 50% 0'
        }} />

        {/* Flower Head */}
        <div style={{
          position: 'absolute', bottom: `${height - 10}px`, left: '50%', transform: 'translateX(-50%)',
          width: '20px', height: '20px'
        }}>
          {/* Petals */}
          {petals}
          {/* Dark center disc */}
          <div style={{
            position: 'absolute', top: '0', left: '0', width: '20px', height: '20px',
            background: 'radial-gradient(circle, #451a03 30%, #78350f 80%)',
            borderRadius: '50%', zIndex: 2
          }} />
        </div>
      </div>
    </div>
  );
}


/* Small seedling */
function Seedling({ left, height = 40, delay = 0, swayClass = 'crop-sway-alt' }) {
  return (
    <div 
      className="crop" 
      style={{ position: 'absolute', bottom: 0, left: `${left}%`, animationDelay: `${delay}s` }}
    >
      <div className={swayClass} style={{ position: 'relative' }}>
        <div style={{ 
          width: '2px', height: `${height}px`, 
          background: '#15803d', opacity: 0.45,
          position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        }} />
        {/* Leaves */}
        <div style={{
          width: '12px', height: '8px', background: '#22c55e', opacity: 0.25,
          borderRadius: '50% 50% 50% 0', position: 'absolute',
          bottom: `${height * 0.6}px`, left: '50%',
          transform: 'rotate(-30deg)', transformOrigin: 'bottom left',
        }} />
        <div style={{
          width: '12px', height: '8px', background: '#22c55e', opacity: 0.25,
          borderRadius: '50% 50% 0 50%', position: 'absolute',
          bottom: `${height * 0.6}px`, right: '50%',
          transform: 'rotate(30deg)', transformOrigin: 'bottom right',
        }} />
        <div style={{
          width: '6px', height: '10px', background: '#22c55e', opacity: 0.3,
          borderRadius: '50%', position: 'absolute',
          bottom: `${height - 2}px`, left: '50%', transform: 'translateX(-50%)',
        }} />
      </div>
    </div>
  );
}

export default function AnimatedCrops() {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '200px',
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden',
    }}>
      {/* Ground strip */}
      <div 
        className="absolute bottom-0 left-0 w-full h-2 bg-emerald-700/30 dark:bg-stone-900/50 transition-colors duration-500"
      />

      {/* Dense grass across the full bottom — every ~2-3% */}
      <GrassCluster left={1} delay={0.2} size="sm" />
      <GrassCluster left={4} delay={0.5} size="md" />
      <GrassCluster left={7} delay={0.3} size="sm" />
      <GrassCluster left={10} delay={0.8} size="md" />
      <GrassCluster left={13} delay={0.4} size="sm" />
      <GrassCluster left={16} delay={0.6} size="lg" />
      <GrassCluster left={19} delay={0.9} size="sm" />
      <GrassCluster left={22} delay={0.3} size="md" />
      <GrassCluster left={25} delay={0.7} size="sm" />
      <GrassCluster left={28} delay={0.5} size="md" />
      <GrassCluster left={31} delay={1.0} size="sm" />
      <GrassCluster left={34} delay={0.4} size="lg" />
      <GrassCluster left={37} delay={0.6} size="sm" />
      <GrassCluster left={40} delay={0.8} size="md" />
      <GrassCluster left={43} delay={0.3} size="sm" />
      <GrassCluster left={46} delay={0.7} size="md" />
      <GrassCluster left={49} delay={0.5} size="sm" />
      <GrassCluster left={52} delay={0.9} size="lg" />
      <GrassCluster left={55} delay={0.4} size="sm" />
      <GrassCluster left={58} delay={0.6} size="md" />
      <GrassCluster left={61} delay={0.8} size="sm" />
      <GrassCluster left={64} delay={0.3} size="md" />
      <GrassCluster left={67} delay={1.0} size="sm" />
      <GrassCluster left={70} delay={0.5} size="lg" />
      <GrassCluster left={73} delay={0.7} size="sm" />
      <GrassCluster left={76} delay={0.4} size="md" />
      <GrassCluster left={79} delay={0.6} size="sm" />
      <GrassCluster left={82} delay={0.9} size="md" />
      <GrassCluster left={85} delay={0.3} size="sm" />
      <GrassCluster left={88} delay={0.8} size="lg" />
      <GrassCluster left={91} delay={0.5} size="sm" />
      <GrassCluster left={94} delay={0.7} size="md" />
      <GrassCluster left={97} delay={0.4} size="sm" />

      {/* Taller crops scattered throughout */}
      <WheatStalk left={3} height={85} delay={0.5} />
      <Sunflower left={8} height={110} delay={0.8} swayClass="crop-sway-alt" />
      <CornStalk left={14} height={130} delay={1.0} />
      <WheatStalk left={20} height={90} delay={0.6} swayClass="crop-sway-slow" />
      <Seedling left={26} height={42} delay={0.9} />
      <Sunflower left={32} height={125} delay={0.7} />
      <CornStalk left={38} height={150} delay={1.1} swayClass="crop-sway-slow" />
      <WheatStalk left={44} height={88} delay={0.5} swayClass="crop-sway-alt" />
      <Seedling left={50} height={40} delay={0.8} />
      <CornStalk left={56} height={145} delay={1.0} />
      <Sunflower left={62} height={115} delay={0.6} swayClass="crop-sway" />
      <WheatStalk left={68} height={92} delay={0.9} swayClass="crop-sway-slow" />
      <Seedling left={74} height={44} delay={0.7} />
      <CornStalk left={80} height={135} delay={0.5} swayClass="crop-sway-alt" />
      <Sunflower left={86} height={120} delay={1.0} swayClass="crop-sway-slow" />
      <WheatStalk left={92} height={90} delay={0.8} />
      <Seedling left={96} height={42} delay={0.6} />
    </div>
  );
}
