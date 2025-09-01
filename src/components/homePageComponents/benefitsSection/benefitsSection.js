
import "./benefitsSection.scss"

import { TfiAlarmClock } from "react-icons/tfi";
import { MdAttachMoney } from "react-icons/md";
import { GiArtificialIntelligence } from "react-icons/gi";
import { PiNotePencilDuotone } from "react-icons/pi";
import { FaArrowsRotate } from "react-icons/fa6";


const BenefitsSection = () => {
  const items = [
    { icon: <TfiAlarmClock />, title: "TIME-SAVING", text: "Analyze investments in minutes, without the need for complex manual calculations." },
    { icon: <MdAttachMoney />, title: "COST-SAVINGS", text: "Identify opportunities to reduce costs and maximize your savings." },
    { icon: <GiArtificialIntelligence />, title: "SMART DECISIONS", text: "Receive AI-powered recommendations to optimize your investments." },
    { icon: <PiNotePencilDuotone />, title: "CUSTOMIZED RESULTS", text: "Set specific variables to receive tailored analysis and get detailed reports with a clear breakdown of ROI, benefits, and savings." },
    { icon: <FaArrowsRotate />, title: "ONGOING PROGRESS", text: "Receive AI-based recommendations to optimize your investments." },
  ];

  return (
    <div className="container-fluid">
      <h2 className="main-title">BENEFITS OF USING OKAPI</h2>
      
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

      <h2 className="secondary-title">Choose the perfect plan for you</h2>
    </div>
  );
};

export default BenefitsSection;
