
import React from 'react';
import Menu from "../../components/globalComponents/headerMenu/menu";
import Footer from "../../components/globalComponents/footer/footer";
import "./customizeRoiPage.scss";
import { useNavigate } from 'react-router-dom';

import imgSocialProject from "../../../src/media/img/proyectos-sociales.png"
import GradientLine from '../../components/globalComponents/gradientLine/gradientLine';
import { BsArrowUpRight, BsGear, BsGraphUp, BsPeople } from 'react-icons/bs';
import { FaBullseye, FaFlask, FaHandshake, FaLeaf } from 'react-icons/fa6';

const sections = [
  {
    key: 'social',
    title: 'Social Impact',
    image: imgSocialProject,
    stats: [
      { label: 'Engagement', value: '75%' },
      { label: 'Reach', value: '120K' },
    ],
    description: 'Analyze how your campaigns affect the community and measure interaction.',
    route: '/customize/social',
    color: '#87c4f8',
    icon: BsPeople
  },
  {
    key: 'carbon',
    title: 'Carbon Footprint',
    image: imgSocialProject,
    stats: [
      { label: 'CO₂ avoided (t)', value: '1.2' },
      { label: 'Reduction', value: '8%' },
    ],
    description: 'Calculate your footprint and get recommendations to reduce emissions.',
    route: '/customize-roi/carbon',
    color: '#70d286',
    icon: FaLeaf
  },
  {
    key: 'rdi',
    title: 'I+D+i',
    image: imgSocialProject,
    stats: [
      { label: 'Projects', value: '24' },
      { label: 'Investment (€)', value: '350K' },
    ],
    description: 'Manage your innovation initiatives and control your project ROI.',
    route: '/customize-roi/rdi',
    color: '#bea3fc',
    icon: FaFlask
  },
  {
    key: 'partners',
    title: 'Partnerships',
    image: imgSocialProject,
    stats: [
      { label: 'Partners', value: '15' },
      { label: 'References', value: '30' },
    ],
    description: 'Turn your collaborators into brand ambassadors.',
    route: '/customize-roi/partners',
    color: '#F59E0B',
    icon: FaHandshake
  },
];

const stats = [
  { value: '500+', label: 'Projects Analyzed' },
  { value: '95%', label: 'Prediction Accuracy' },
  { value: '€2.5M', label: 'Total ROI Optimized' },
  { value: '48h', label: 'Average Analysis Time' }
];

const processSteps = [
  {
    step: '01',
    title: 'Select your Area',
    description: 'Choose the type of investment you want to analyze',
    icon: FaBullseye
  },
  {
    step: '02',
    title: 'Configure Parameters',
    description: 'Adjust the specific criteria for your project',
    icon: BsGear
  },
  {
    step: '03',
    title: 'Analyze Results',
    description: 'Get detailed metrics and recommendations',
    icon: BsGraphUp
  },
  {
    step: '04',
    title: 'Optimize and Act',
    description: 'Implement improvements based on insights',
    icon: BsArrowUpRight
  }
];

const CustomizeRoiPage = () => {
  const navigate = useNavigate();

  const handleCardClick = (section) => {
    if (section.key === 'social') {
      navigate('/customize/social');
    } else {
      navigate(section.route);
    }
  };

  return (
    <div className="customize-roi-wrapper">
      <Menu />
      <div className="customize-roi-page">
        <main className="main-content">
          
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">
                Customize <span className="gradient-text">OKAPI</span> to fit your needs
              </h1>
              <p className="hero-subtitle">
                Every investment is unique. Configure OKAPI's analysis to match your specific sector, 
                objectives, and KPIs for maximum ROI optimization.
              </p>
              <div className="hero-cta">
                <div className="cta-highlight">
                  <span className="cta-text">Choose your investment area and start optimizing</span>
                  <div className="cta-arrow">↓</div>
                </div>
              </div>
            </div>
          </section>

          {/* Main Sections - Redesigned */}
          <section className="main-sections">
            <div className="sections-grid">
              {sections.map((section, index) => (
                <div
                  key={section.key}
                  className="analysis-card"
                  onClick={() => handleCardClick(section)}
                >
                  <div className="card-header">
                    <div className="card-icon">{section.icon}</div>
                    <h3 className="card-title">{section.title}</h3>
                  </div>
                  <div className="card-body">
                    <p className="card-description">{section.description}</p>
                    <div className="card-stats">
                      {section.stats.map(stat => (
                        <div key={stat.label} className="stat-item">
                          <span className="stat-value" style={{ color: section.color }}>{stat.value}</span>
                          <span className="stat-label">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer">
                    <span className="cta-text">Start Analysis</span>
                    <div className="card-arrow" style={{ color: section.color }}>→</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="stats-section">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="stat-card"
                >
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Process Section */}
          <section className="process-section">
            <div className="section-header">
              <h2>How it works</h2>
              <p>Simple 4-step process to optimize your investments</p>
            </div>
            <div className="process-grid">
              {processSteps.map((step, index) => (
                <div 
                  key={index}
                  className="process-step"
                >
                  <div className="step-number">{step.step}</div>
                  <div className="step-icon">{step.icon}</div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          

          {/* CTA Section */}
          <section className="cta-section">
            <div className="cta-content">
              <h2>Ready to optimize your investments?</h2>
              <p>Start today and see immediate results in your project ROI</p>
              <button className="cta-button">Start Free Analysis</button>
            </div>
          </section>

        </main>
        
        <GradientLine />
        <Footer />
      </div>
    </div>
  );
};

export default CustomizeRoiPage;