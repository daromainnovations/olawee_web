

import React, { useEffect, useState, useRef } from "react";
// import PrincipalButton from "../principalButton/principalButton";
import "./pricingCards.scss";
import CustomCard from "../customCard/customCard";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import plansData from "../../globalComponents/plansData";

const PricingCards = ({ planType = "monthly" }) => {
  const plans = plansData[planType];

  // const [hoveredId, setHoveredId] = useState(null);
  const [cardsPerSlide, setCardsPerSlide] = useState(3);
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(plans.length <= cardsPerSlide);
  const [shouldHideButtons, setShouldHideButtons] = useState(plans.length <= cardsPerSlide);

  // Ajustar el número de tarjetas visibles según el ancho de la pantalla
  useEffect(() => {
    const updateCardsPerSlide = () => {
      let newCardsPerSlide = 3;
      if (window.innerWidth < 576) newCardsPerSlide = 1;
      else if (window.innerWidth < 768) newCardsPerSlide = 2;

      setCardsPerSlide(newCardsPerSlide);
      setShouldHideButtons(plans.length <= newCardsPerSlide);

      if(swiperRef.current){
        swiperRef.current.update();
        setTimeout(() => {
          setIsBeginning(swiperRef.current.isBeginning);
          setIsEnd(swiperRef.current.isEnd);  
        },0)
      }
    };

    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, [plans.length]);

  return (
    <div className="pricing-container">
      {/* Controles fuera de Swiper */}
      {!shouldHideButtons && (
        <div className="swiper-buttons-container">
          <button
            className={`swiper-button-prev ${isBeginning ? "disabled" : ""}`}
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
          >
          </button>
          <button
            className={`swiper-button-next ${isEnd ? "disabled" : ""}`}
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
          >
          </button>
        </div>
      )}

      {/* Swiper para el carrusel */}
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={cardsPerSlide}
        autoplay={{ delay: 50000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setTimeout(() => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }, 0);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {plans.map((plan) => (
          <SwiperSlide key={plan.id}>
            <CustomCard
              title={plan.title}
              price={plan.price}
              features={plan.features}
              buttonText="GET STARTED"
              onButtonClick={() => console.log(`Plan seleccionado: ${plan.title}`)}
              featuresAsList={true}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PricingCards;
