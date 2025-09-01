
// // src/components/sections/Why.jsx
// import React from 'react';
// import { Loader2, ShieldCheck, Globe } from 'lucide-react';

// const whyPoints = [
//   { icon: <Loader2 size={40} />, title: 'Speed', desc: 'Get instant insights, no more waiting months.' },
//   { icon: <ShieldCheck size={40} />, title: 'Accuracy', desc: 'Data you can trust from official sources and AI validation.' },
//   { icon: <Globe size={40} />, title: 'Scalability', desc: 'A global standard for measuring social impact anywhere.' },
//   { icon: <Loader2 size={40} />, title: 'Customization', desc: 'Tailored dashboards for every stakeholder’s needs.' },
//   { icon: <ShieldCheck size={40} />, title: 'Security', desc: 'Enterprise-grade protection for your sensitive data.' }
// ];

// const Why = () => (
//   <section className="why">
//     <h2>Why Choose Okapi Social?</h2>
//     <p className="why__intro">Comprehensive features designed to maximize your social return on investment:</p>
//     <div className="why__list">
//       {whyPoints.map((w, i) => (
//         <div key={i} className="why__item">
//           <div className="why__icon">{w.icon}</div>
//           <h3>{w.title}</h3>
//           <p>{w.desc}</p>
//         </div>
//       ))}
//     </div>
//   </section>
// );

// export default Why;



// src/components/sections/Why.jsx
import React from 'react';
import { Zap, CheckCircle2, BarChart2 } from 'lucide-react';

const whyPoints = [
  {
    icon: <Zap size={48} color='white' />, 
    title: 'Immediate Insights',
    desc: 'Visualize social ROI the moment you invest—no more delays.'
  },
  {
    icon: <CheckCircle2 size={48} color='white'/>, 
    title: 'Data You Trust',
    desc: 'Powered by AI and vetted official sources for maximum credibility.'
  },
  {
    icon: <BarChart2 size={48} color='white'/>, 
    title: 'Scalable Impact',
    desc: 'From local projects to global programs, measure and compare effortlessly.'
  }
];

const Why = () => (
  <section className="why">
    <div className="why__header">
      <h2>Why OKAPI SOCIAL Stands Out</h2>
      <p className="text-center">Our platform is built to give social investors the clarity and control they need.</p>
    </div>
    <div className="why__list">
      {whyPoints.map((w, i) => (
        <div key={i} className="why__card">
          <div className="why__icon">{w.icon}</div>
          <h5 className="why__title">{w.title}</h5>
          <p className="why__desc">{w.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Why;
