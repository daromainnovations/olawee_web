
// src/components/sections/Cases.jsx
import React from 'react';

import case_school from "../../../src/media/img/school.jpg"
import case_telecare from "../../../src/media/img/telecare.jpg"
import case_training from "../../../src/media/img/training.jpg"

const cases = [
  {
    key: 'school',
    title: 'School Enrollment for a Child',
    description: 'Reduces social exclusion, juvenile crime, and future dependency on the system.',
    roi: 'Positive ROI from the first year.'
  },
  {
    key: 'telecare',
    title: '24/7 Telecare for Seniors',
    description: 'Prevents emergency hospitalizations by 60% and lowers healthcare costs.',
    roi: '€5 saved for every €1 invested.'
  },
  {
    key: 'training',
    title: 'Job Training for Youth',
    description: 'Reduces youth unemployment by 40% and boosts tax revenue.',
    roi: '€8 generated for every €1 invested.'
  }
];
const caseImages = {
  'school': case_school,
  'telecare': case_telecare,
  'training': case_training,
};
const Cases = () => (
  <section className="cases">
    <h2>REAL USERS CASES</h2>
    <div className="cases__grid">
      {cases.map((c, i) => (
        <div key={i} className="case-card">
          <img
            src={caseImages[c.key]}
            alt={c.title}
            loading="lazy"
          />
          <h6>{c.title}</h6>
          <p>{c.description}</p>
          <span className="case-card__roi">{c.roi}</span>
        </div>
      ))}
    </div>
  </section>
);
export default Cases;