
// // src/components/sections/Problem.jsx
// import React from 'react';
// import { Eye, FileText, Heart } from 'lucide-react';

// const Problem = () => (
//   <section className="problem">
//     <h2>¿Cómo toman decisiones hoy?</h2>
//     <p>La mayoría lo hace con intuición, informes parciales e impacto emocional…</p>
//     <div className="problem__icons">
//       <Eye size={48} />
//       <FileText size={48} />
//       <Heart size={48} />
//     </div>
//   </section>
// );
// export default Problem;


// src/components/sections/Problem.jsx
import React from 'react';
import { EyeOff, FileWarning, Clock } from 'lucide-react';

const issues = [
  {
    icon: <EyeOff size={40} />,  
    title: 'Impact in the Dark',  
    desc: 'Decisions lack solid metrics, leaving social opportunities unmeasured.'
  },
  {
    icon: <FileWarning size={40} />,  
    title: 'Broken Data Flow',  
    desc: 'Static reports are outdated the moment they land on your desk.'
  },
  {
    icon: <Clock size={40} />,  
    title: 'ROI on Hold',  
    desc: 'You wait months to see if investments paid off—too late for adjustments.'
  }
];

const Problem = () => (
  <section className="problem">
    <h4>Why Fly Blind in Social Investing?</h4>
    <p className='text-center mb-5'>Gut feelings and fragmented reports can’t capture true impact.</p>
    <div className="problem__cards">
      {issues.map((item, i) => (
        <div key={i} className="problem__card align-content-center">
          <div className="problem__icon">{item.icon}</div>
          <div className="problem__content">
            <h6>{item.title}</h6>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Problem;