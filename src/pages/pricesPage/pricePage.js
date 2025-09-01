
import Menu from "../../components/globalComponents/headerMenu/menu"
// import PricingCards from "../../components/pricesComponents/pricingCards/pricingCards";
// import SwitchButton from "../../components/pricesComponents/switchButton/switchButton";
import SocialIcons from "../../components/globalComponents/socialIcons/socialIcons";
import GradientLine from "../../components/globalComponents/gradientLine/gradientLine";
import Footer from "../../components/globalComponents/footer/footer";

import "./pricePage.scss"
import PlansTable from "../../components/pricesComponents/comparativeTable/comparativeTable";
// import { useState } from "react";
import ProductsSection from "../../components/pricesComponents/productsSection/productsSection";

const PricePage = () => {
    // const [selectedPlan, setSelectedPlan] = useState("monthly");

    return(
        <>
            <Menu />
            <div className="prices">
                <div className="container-title d-flex justify-content-center">
                    <h1 className="title-prices">Save, grow, and succeed with every decision</h1>
                </div>
                {/* <SwitchButton selected={selectedPlan} onChange={setSelectedPlan} /> */}
                {/* <PricingCards planType={selectedPlan} /> Cambia dinámicamente */}
                <ProductsSection />
                <div className="plans-container">
                    <h1 className="title-compare-plans">Compare Plans</h1>
                    <PlansTable />
                </div>
            </div>
            <SocialIcons />
            <GradientLine />
            <Footer />
            
        </>
        
    )
}

export default PricePage;