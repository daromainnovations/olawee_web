
import UserCard from "../../globalComponents/card/userCard";
import "./carouselCards.scss";
import fotoUser from "../../../media/img/person-circle.svg";
import { useEffect, useState, useRef } from "react";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

// Genera un ID único
import { v4 as uuidv4 } from "uuid";
// Lista de usuarios
const users = [
  { id: uuidv4(), photo: fotoUser, name: "Carlos Pérez", username: "carlitos", opinion: "Desde que comencé a usar OLAWEE, mi equipo de ventas ha reducido tarea manuales y ha aumentado el tiempo con los clientes. La plataforma es increíblemnte intuitiva.", date: "3/7/2025" },
  { id: uuidv4(), photo: fotoUser, name: "Ana Gómez", username: "ana", opinion: "OLAWEE me ha permitido crear asistentes para RRHH y contabilidad. Nos ahorra horas de trabajo semanal.", date: "24/7/2025" },
  { id: uuidv4(), photo: fotoUser, name: "Juan López", username: "juan", opinion: "La mejor herramienta que he usado para organizar mi trabajo.", date: "15/8/2025" },
  { id: uuidv4(), photo: fotoUser, name: "María Fernández", username: "maria", opinion: "¡Totalmente recomendada! Facilita la digitalización en empresas pequeñas.", date: "16/8/2025" },
  { id: uuidv4(), photo: fotoUser, name: "Pedro Sánchez", username: "pedro", opinion: "Nos ha ayudado a mejorar nuestros procesos y productividad.", date: "14/9/2025" },
];

const CarouselCards = () => {
  const [cardsPerSlide, setCardsPerSlide] = useState(4);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [isBeginning, setIsBeginning] = useState(true); // Estado para el inicio del carrusel
  const [isEnd, setIsEnd] = useState(false); // Estado para el final del carrusel
  const swiperRef = useRef(null);

  // Detectar cuántas tarjetas mostrar según el ancho de la pantalla
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 576) {
        setCardsPerSlide(1);
      } else if (window.innerWidth < 768) {
        setCardsPerSlide(2);
      } else if (window.innerWidth < 992) {
        setCardsPerSlide(3);
      } else {
        setCardsPerSlide(4);
      }
    };

    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, []);

  const toggleExpanded = (id) => {
    setExpandedUserId(expandedUserId === id ? null : id);
  };

  return (
    <div className="cards-container">
      {/* Contenedor de botones fuera del Swiper */}
      <div className="swiper-buttons-container">
        <button
          className={`swiper-button-prev ${isBeginning ? "disabled" : ""}`}
          onClick={() => swiperRef.current?.slidePrev()}
          disabled={isBeginning}
        ></button>
        <button
          className={`swiper-button-next ${isEnd ? "disabled" : ""}`}
          onClick={() => swiperRef.current?.slideNext()}
          disabled={isEnd}
        ></button>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={cardsPerSlide}
        autoplay={{ delay: 30000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {users.map((user) => (
          <SwiperSlide key={user.id}>
            <UserCard user={user} isExpanded={expandedUserId === user.id} toggleExpanded={toggleExpanded} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselCards;
