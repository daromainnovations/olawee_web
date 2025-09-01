
import ProductsSection from "../../../components/pricesComponents/productsSection/productsSection";
import ActiveLicensesSection from "./activeLicensesSection";

import "../sections/styles/buyLicense.scss";

const BuyLicense = () => {

  return (
    <div className="div-principal-licencias">
      <ActiveLicensesSection />
      <div className="products-title-motivator">
        <h2>Get new licenses and keep saving with OKAPI!  </h2>
        <p>Explore the plans that best suit your needs and boost your ROI even further.</p>
      </div>
      <ProductsSection />
    </div>
  );
};

export default BuyLicense;