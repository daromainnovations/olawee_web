
// // src/components/sections/Solution.jsx
// import React from 'react';

// const Solution = () => (
//   <section className="solution">
//     <h2>Okapi Social: Inteligencia artificial para tu inversión social</h2>
//     <ul>
//       <li>ROI inmediato: sin esperas ni informes manuales.</li>
//       <li>Datos reales: integra fuentes oficiales y estudios validados.</li>
//       <li>Contexto dinámico: ajusta resultados según variables locales.</li>
//     </ul>
//     <div className="solution__image">
//       <img
//           src="https://source.unsplash.com/600x400/?artificial-intelligence,technology"
//           alt="Ilustración IA calculando ROI"
//           loading="lazy"
//         />
//     </div>
//   </section>
// );
// export default Solution;

// src/components/sections/Solution.jsx
import React from 'react';

// Solutions mapping to specific problems
const solutions = [
  {
    title: 'Instant Impact Visibility',
    desc: 'Turn ambiguity into clarity with real-time dashboards that eliminate guesswork.'
  },
  {
    title: 'Unified Data Pipeline',
    desc: 'Automatically aggregate and update metrics from all sources—no more broken flows.'
  },
  {
    title: 'Live ROI Tracking',
    desc: 'Monitor social returns as they happen, enabling immediate course corrections.'
  }
];

const Solution = () => (
  <section className="solution">
    <h4>Solving Social Investment Challenges</h4>
    <p className='text-center mb-5'>OKAPI SOCIAL directly addresses the blind spots holding back your impact:</p>
    <div className="solution__cards">
      {solutions.map((item, i) => (
        <div key={i} className="solution__card">
          <div className="solution__content">
            <h6>{item.title}</h6>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Solution;