
// // src/components/LandingPage.jsx
// import React from 'react';
// import './okapiSocialPage.scss';
// import Hero from '../../components/okapiSocialComponents/hero';
// import Problem from '../../components/okapiSocialComponents/problem';
// import Solution from '../../components/okapiSocialComponents/solutions';
// import Cases from '../../components/okapiSocialComponents/cases';
// import Why from '../../components/okapiSocialComponents/why';
// import Testimonials from '../../components/okapiSocialComponents/testimonials';
// import Footer from '../../components/globalComponents/footer/footer';
// import Menu from '../../components/globalComponents/headerMenu/menu';
// import GradientLine from '../../components/globalComponents/gradientLine/gradientLine';

// // Section components

// const OkapiSocialPage = () => {
//   return (
//     <>
//       <Menu />
//       <div className="landing-page">
//         <Hero />
//         <div className="problem-solution-wrapper">
//           <Problem />
//           <div className="ps-arrow">
//             {/* Arrow SVG between Problem and Solution */}
//             <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-font-title)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <line x1="2" y1="12" x2="22" y2="12" />
//               <polyline points="15 5 22 12 15 19" />
//             </svg>
//           </div>
//           <Solution />
//         </div>
//         <Cases />
//         <Why />
//         <Testimonials />
//       </div>
//       <GradientLine />
//       <Footer />
//     </>
//   );
// };

// export default OkapiSocialPage;


// src/components/LandingPage.jsx
import React from 'react';
import './okapiSocialPage.scss';
import Hero from '../../components/okapiSocialComponents/hero';
import Problem from '../../components/okapiSocialComponents/problem';
import Solution from '../../components/okapiSocialComponents/solutions';
import Cases from '../../components/okapiSocialComponents/cases';
import Why from '../../components/okapiSocialComponents/why';
import Testimonials from '../../components/okapiSocialComponents/testimonials';
import Footer from '../../components/globalComponents/footer/footer';
import Menu from '../../components/globalComponents/headerMenu/menu';
import GradientLine from '../../components/globalComponents/gradientLine/gradientLine';

const OkapiSocialPage = () => {
  return (
    <div className="okapi-social-wrapper">
      <Menu />
      <div className="landing-page">
        {/* Wrapper para el contenido principal */}
        <main className="main-content">
          <Hero />
          <div className="problem-solution-wrapper">
            <Problem />
            <div className="ps-arrow">
              {/* Arrow SVG between Problem and Solution */}
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="var(--color-font-title)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="2" y1="12" x2="22" y2="12" />
                <polyline points="15 5 22 12 15 19" />
              </svg>
            </div>
            <Solution />
          </div>
          <Cases />
          <Why />
          <Testimonials />
        </main>
        
        {/* Footer al final */}
        <GradientLine />
        <Footer />
      </div>
    </div>
  );
};

export default OkapiSocialPage;