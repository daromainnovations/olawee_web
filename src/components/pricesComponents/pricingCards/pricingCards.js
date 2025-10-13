
// import React, { useMemo, useRef, useState } from "react";
// import "./pricingCards.scss";
// import CustomCard from "../customCard/customCard";

// // Swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation, Autoplay } from "swiper/modules";

// import plansData from "../../globalComponents/plansData";

// const PricingCards = ({ planType = "monthly", featuredPlanId }) => {
//   const plans = useMemo(
//     () => plansData[planType] ?? [],
//     [planType] // si plansData te llega por props, usa [planType, plansData]
//   );
//   const swiperRef = useRef(null);
//   const [isBeginning, setIsBeginning] = useState(true);
//   const [isEnd, setIsEnd] = useState(plans.length <= 3);

//   // Destacar un plan: prioridad featuredPlanId -> plan.popular -> centro
//   const featuredId = useMemo(() => {
//     if (featuredPlanId) return featuredPlanId;
//     const popular = plans.find(p => p.popular || p.isPopular);
//     return popular?.id ?? plans[Math.floor(plans.length / 2)]?.id;
//   }, [featuredPlanId, plans]);

//   if (!plans.length) return null;
  
//   return (
//     <div className="pricing-container" role="region" aria-label="Planes y precios">
//       {/* Controles fuera de Swiper */}
//       {plans.length > 1 && (
//         <div className="swiper-buttons-container" aria-hidden="true">
//           <button
//             className={`swiper-button-prev ${isBeginning ? "disabled" : ""}`}
//             onClick={() => swiperRef.current?.slidePrev()}
//             disabled={isBeginning}
//             aria-label="Ver planes anteriores"
//           />
//           <button
//             className={`swiper-button-next ${isEnd ? "disabled" : ""}`}
//             onClick={() => swiperRef.current?.slideNext()}
//             disabled={isEnd}
//             aria-label="Ver planes siguientes"
//           />
//         </div>
//       )}

//       <Swiper
//         modules={[Navigation, Autoplay]}
//         spaceBetween={24}
//         // autoplay muy largo para no ser intrusivo
//         autoplay={{ delay: 20000, disableOnInteraction: false }}
//         onSwiper={(swiper) => {
//           swiperRef.current = swiper;
//           setIsBeginning(swiper.isBeginning);
//           setIsEnd(swiper.isEnd);
//         }}
//         onResize={(swiper) => {
//           setIsBeginning(swiper.isBeginning);
//           setIsEnd(swiper.isEnd);
//         }}
//         onSlideChange={(swiper) => {
//           setIsBeginning(swiper.isBeginning);
//           setIsEnd(swiper.isEnd);
//         }}
//         // Breakpoints nativos para slides por vista
//         breakpoints={{
//           0:   { slidesPerView: 1 },
//           576: { slidesPerView: 1.15, centeredSlides: true },
//           768: { slidesPerView: 2 },
//           992: { slidesPerView: 3 },
//         }}
//       >
//         {plans.map((plan) => {
//   const isFeatured = plan.id === featuredId;
//   const hasBadge = plan.badge || plan.popular || plan.isPopular;

//   return (
//     <SwiperSlide key={`${planType}-${plan.id}`}>
//       <div
//         className={`pricing-card ${isFeatured ? "is-featured" : ""}`}
//         tabIndex={0}
//         aria-label={`Plan ${plan.label}${isFeatured ? " destacado" : ""}`}
//       >
//         {hasBadge && (
//           <span className="pricing-card__badge" aria-hidden="true">
//             {plan.badge ?? "Más popular"}
//           </span>
//         )}

//         <div className="pricing-card__inner">
//           <CustomCard
//             title={plan.label}
//             price={plan.price}
//             features={plan.features}    
//             buttonText={plan.buttonText || "GET STARTED"}
//             onButtonClick={() => console.log(`Plan seleccionado: ${plan.label}`)}
//             featuresAsList
//             badge={plan.badge}
//           />
//         </div>
//       </div>
//     </SwiperSlide>
//   );
// })}

//       </Swiper>
//     </div>
//   );
// };

// export default PricingCards;













import React, { useMemo, useRef, useState } from "react";
import "./pricingCards.scss";
import CustomCard from "../customCard/customCard";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

import plansData from "../../globalComponents/plansData";

const PricingCards = ({ planType = "monthly", featuredPlanId }) => {
  // Memoiza planes por tipo (evita warnings de deps y renders extra)
  const plans = useMemo(() => plansData[planType] ?? [], [planType]);

  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd,     setIsEnd]       = useState(plans.length <= 3);

  // Destacado UX: featuredId -> popular -> centro
  const featuredId = useMemo(() => {
    if (featuredPlanId) return featuredPlanId;
    const popular = plans.find(p => p.popular || p.isPopular);
    return popular?.id ?? plans[Math.floor(plans.length / 2)]?.id;
  }, [featuredPlanId, plans]);

  if (!plans.length) return null;

  return (
    <div className="pricing-container" role="region" aria-label="Planes y precios">
      {/* Controles fuera de Swiper */}
      {plans.length > 1 && (
        <div className="swiper-buttons-container" aria-hidden="true">
          <button
            className={`swiper-button-prev ${isBeginning ? "disabled" : ""}`}
            onClick={() => swiperRef.current?.slidePrev()}
            disabled={isBeginning}
            aria-label="Ver planes anteriores"
          />
          <button
            className={`swiper-button-next ${isEnd ? "disabled" : ""}`}
            onClick={() => swiperRef.current?.slideNext()}
            disabled={isEnd}
            aria-label="Ver planes siguientes"
          />
        </div>
      )}

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        autoplay={{ delay: 20000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onResize={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        breakpoints={{
          0:   { slidesPerView: 1 },
          576: { slidesPerView: 1.15, centeredSlides: true },
          768: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
        }}
      >
        {plans.map((plan, idx) => {
          console.log("Pricing plan item →", {
            idx,
            id: plan.id,
            label: plan.label,
            title: plan.title,
            name: plan.name,
            recommended: plan.recommended,
            popular: plan.popular
          });
          const isFeatured = plan.id === featuredId;

          // ✅ RECOMENDADO si el id es 93 (numérico o string),
          //    o si lo marcas por datos (recommended/popular),
          //    o como fallback el del centro.
          const isRecommended = Boolean(
            Number(plan.id) === 93 ||
            plan.recommended === true ||
            plan.popular === true ||
            /impulsa/i.test(String(plan.label || plan.title || "")) ||
            idx === Math.floor(plans.length / 2)
          );

          const hasBadge = plan.badge || plan.popular || plan.isPopular;

          return (
            <SwiperSlide key={`${planType}-${plan.id}`}>
              <div className="pricing-card-wrap" data-plan-id={plan.id}>
                {isRecommended && (
                  <span className="pricing-card-recommend" aria-hidden="true">
                    RECOMENDADO
                  </span>
                )}

                <div
                  className={`pricing-card ${isFeatured ? "is-featured" : ""}`}
                  tabIndex={0}
                  aria-label={`Plan ${plan.label || plan.title}${isFeatured ? " destacado" : ""}`}
                >
                  {hasBadge && (
                    <span className="pricing-card__badge" aria-hidden="true">
                      {plan.badge ?? "Más popular"}
                    </span>
                  )}

                  <div className="pricing-card__inner">
                    <CustomCard
                      title={plan.label || plan.title}
                      price={plan.price}
                      features={plan.features}
                      buttonText={plan.buttonText || "GET STARTED"}
                      onButtonClick={() => console.log(`Plan seleccionado: ${plan.label || plan.title}`)}
                      featuresAsList
                      badge={plan.badge}
                    />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

      </Swiper>
    </div>
  );
};

export default PricingCards;
