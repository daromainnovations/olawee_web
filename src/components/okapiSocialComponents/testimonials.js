
// src/components/LandingPage.jsx
import React from 'react';
import Slider from 'react-slick';
import { Star } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const testimonials = [
  { name: 'NGO Alpha', quote: 'With Okapi, we saw measurable impact in just 48 hours!', rating: 5, date: 'May 10, 2025' },
  { name: 'Social Fund Beta', quote: 'Decisions are now data-driven and lightning fast.', rating: 4, date: 'April 22, 2025' },
  { name: 'Community Org Gamma', quote: 'Our ROI tracking has never been clearer.', rating: 5, date: 'March 15, 2025' },
  { name: 'Global Impact Inc', quote: 'Our funding strategy transformed with real-time ROI visibility.', rating: 4, date: 'February 28, 2025' },
  { name: 'Youth Outreach Delta', quote: 'Engagement and effectiveness increased by 30% thanks to Okapi Social.', rating: 5, date: 'January 12, 2025' },
  { name: 'Education Trust Epsilon', quote: 'Education programs scaled faster with precise impact metrics.', rating: 5, date: 'December 5, 2024' }
];

const sliderSettings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  autoplay: false,
  autoplaySpeed: 4000,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1, centerPadding: '30px' } },
    { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1, centerPadding: '20px' } }
  ]
};

const Testimonials = () => (
  <section className="testimonials">
    <div className="testimonials__header">
      <h2>What Our Partners Say</h2>
      <p className="testimonials__sub">Real feedback from organizations transforming social impact with Okapi Social.</p>
    </div>
    <div className="testimonials__carousel">
      <Slider {...sliderSettings}>
        {testimonials.map((t, i) => (
          <div key={i} className="testimonial__card">
            <div className="testimonial__header">
              <div className="testimonial__avatar-wrapper">
                <img
                  src={`https://i.pravatar.cc/64?img=${i + 3}`}
                  alt={t.name}
                  className="testimonial__avatar-img"
                  loading="lazy"
                />
              </div>
              <div className='container__name__stars'>
                <cite className="testimonial__name">{t.name}</cite>
                <div className="testimonial__stars">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    color={idx < t.rating ? '#fb8509' : 'rgba(193,198,199,0.3)'}
                    fill={idx < t.rating ? '#fb8509' : 'none'}
                  />
                ))}
                </div>
              </div>
              
            </div>
            
            <p className="testimonial__quote">“{t.quote}”</p>
            <span className="testimonial__date">{t.date}</span>
          </div>
        ))}
      </Slider>
    </div>
  </section>
);

export default Testimonials;
