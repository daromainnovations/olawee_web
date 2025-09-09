
import "./benefitsSection.scss"

import { TfiAlarmClock } from "react-icons/tfi";
import { MdAttachMoney } from "react-icons/md";
import { GiArtificialIntelligence } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";
import { FaArrowsRotate } from "react-icons/fa6";


const BenefitsSection = () => {
  const items = [
    { icon: <TfiAlarmClock />, title: "AHORRO DE TIEMPO", text: "Gestiona tareas en minutos, sin necesidad de conocimientos técnicos." },
    { icon: <MdAttachMoney />, title: "AHORRO DE COSTES", text: "Reduce la necesidad de formación externa y consultoría gracias a recursos de IA integrados." },
    { icon: <GiArtificialIntelligence />, title: "DECISIONES INTELIGENTES", text: "Recibe recomendaciones impulsadas por IA adaptadas a cada departamento." },
    { icon: <PiNotePencilDuotone />, title: "RESULTADOS PERSONALIZADOS", text: "Crea tus propios agentes y prompts ajustados a tus flujos de trabajo." },
    { icon: <FaArrowsRotate />, title: "PROGRESO CONTINUO", text: "Accede a una biblioteca compartida que crece con tu organización." },
  ];

  return (
    <div className="container-fluid">
      <h2 className="main-title">BENEFICIOS DE USAR OLAWEE</h2>
      
      <div className="items-container">
        {items.map((item, index) => (
          <div key={index} className="item">
            <div className="icon">{item.icon}</div>
            <h5 className="item-title">{item.title}</h5>
            <p className="item-text">{item.text}</p>
          </div>
        ))}
      </div>

      <hr className="divider" />

      <h2 className="secondary-title">Elige el plan perfecto para ti</h2>
    </div>
  );
};

export default BenefitsSection;
