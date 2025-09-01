
// import React from 'react';
// import { motion } from 'framer-motion';
// import mockupOkapi from '../../../src/media/img/mockup_okapi_social.png';

// const Hero = () => (
//   <section className="hero">
//     <div className="hero__content">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.2, duration: 0.8 }}
//       >
//         <h1>Transform your social impact with real‑time data</h1>
//       </motion.div>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4, duration: 0.8 }}
//       >
//         <p>Our AI‑powered platform shows you the social ROI of every euro invested instantly, using official data and precise metrics.</p>
//       </motion.div>
//       <motion.ul
//         className="hero__features"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.6, staggerChildren: 0.2 }}
//       >
//         {['Instant ROI', 'Full Automation', 'Contextualized Analytics'].map((feature, i) => (
//           <motion.li key={i} whileHover={{ color: "white", cursor: "pointer" }}>
//             {feature}
//           </motion.li>
//         ))}
//       </motion.ul>
//       <button
//         className="btn btn__demo"
//         onClick={() => {
//           /* Aquí disparas tu lógica de demo */
//         }}
//       >
//         Try the Live Demo
//       </button>
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.8 }}
//       >
//       </motion.div>
//     </div>
//     <div className="hero__image">
//       <motion.img
//         src={mockupOkapi}
//         alt="Okapi Social dashboard mockup"
//         loading="lazy"
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1.5 }}
//         transition={{ delay: 1.0, duration: 0.8 }}
//       />
//     </div>
//   </section>
// );
// export default Hero;




import React from 'react';
import { motion } from 'framer-motion';
import mockupOkapi from '../../../src/media/img/mockupOkapiSocial.png';

const Hero = () => (
  <section className="hero">
    <div className="hero__content">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <h1>Transform your social impact with innovative tools</h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <p>Our AI‑powered platform shows you the social ROI of every euro invested, using market data and precise metrics.</p>
      </motion.div>
      
      {/* Features para desktop - se ocultan en mobile con CSS */}
      <motion.ul
        className="hero__features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, staggerChildren: 0.2 }}
      >
        {['Instant ROI', 'Full Automation', 'Contextualized Analytics'].map((feature, i) => (
          <motion.li key={i} whileHover={{ color: "white", cursor: "pointer" }}>
            {feature}
          </motion.li>
        ))}
      </motion.ul>

      <button
        className="btn btn__demo"
        onClick={() => {
          /* Aquí disparas tu lógica de demo */
        }}
      >
        Try the Live Demo
      </button>
    </div>

    {/* Imagen para desktop - se oculta en mobile con CSS */}
    <div className="hero__image">
      <motion.img
        src={mockupOkapi}
        alt="Okapi Social dashboard mockup"
        loading="lazy"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1.5 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      />
    </div>

    {/* Container solo para mobile */}
    <div className="hero__bottom">
      {/* CRÍTICO: Este container faltaba en tu código */}
      <div className="hero__image-features">
        <div className="hero__image">
          <motion.img
            src={mockupOkapi}
            alt="Okapi Social dashboard mockup"
            loading="lazy"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ delay: 1.0, duration: 0.8 }}
          />
        </div>
        
        {/* Features para mobile - aparecen al lado derecho de la imagen */}
        <motion.ul
          className="hero__features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, staggerChildren: 0.2 }}
        >
          {['Instant ROI', 'Full Automation', 'Contextualized Analytics'].map((feature, i) => (
            <motion.li key={i} whileHover={{ color: "white", cursor: "pointer" }}>
              {feature}
            </motion.li>
          ))}
        </motion.ul>
      </div>

      {/* CRÍTICO: Este botón también faltaba */}
      <button
        className="btn btn__demo"
        onClick={() => {
          /* Aquí disparas tu lógica de demo */
        }}
      >
        Try the Live Demo
      </button>
    </div>
  </section>
);

export default Hero;