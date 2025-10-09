// import { useState } from "react";
// import BannerOferta from "../../components/globalComponents/bannerOferta/bannerOferta";
// import Menu from "../../components/globalComponents/headerMenu/menu"
// import "./homePage.scss"
// import GoalDescriptionInput from "../../components/homePageComponents/goalDescriptionInput/goalDescriptionInput";
// import TutorialWhitVideo from "../../components/homePageComponents/tutorialWhitVideo/tutorialWhitVideo";
// import SavingsAndBenefits from "../../components/homePageComponents/savingsAndBenefits/savingsAndBenefits";
// import CarouselCards from "../../components/homePageComponents/carouselCards/carouselCards";
// import BenefitsSection from "../../components/homePageComponents/benefitsSection/benefitsSection";
// // import PricingCards from "../../components/pricesComponents/pricingCards/pricingCards";
// import SocialIcons from "../../components/globalComponents/socialIcons/socialIcons";
// import GradientLine from "../../components/globalComponents/gradientLine/gradientLine";
// import Footer from "../../components/globalComponents/footer/footer";
// import ProductsSection from "../../components/pricesComponents/productsSection/productsSection";

// const HomePage = () => {
//     const [bannerHeight, setBannerHeight] = useState(0);
//     return(
//         <>
//             <BannerOferta setBannerHeight={setBannerHeight} />
            
//             <div className="page-content" 
//                 style={{  paddingTop: `${bannerHeight + 60}px`, 
//                     transition: "padding-top 0.4s ease-in-out"
//                 }} 
//             >
//                 <Menu bannerHeight={bannerHeight -20} customClass="custom-navbar-style"/>
                
//                 <div className="d-flex justify-content-center text-center">
//                     <h1 className="title-OKAPI"> OKAPI</h1>
//                 </div>
//                 <div className="d-flex justify-content-center text-center">
//                     <p className="mt-2 secondary-title">SMART CHOICES, BIG SAVINGS</p>
//                 </div>
//                 <div className="d-flex justify-content-center text-center">
//                     <p className="text">Describe your investment, and OKAPI will show you how much you can save, the benefits you'll gain, and the success you can achieve. Maximize your profits and reduce unnecessary costs.</p>
//                 </div>
//                 <GoalDescriptionInput />
//                 <div className="d-flex justify-content-center text-center container-subtitle">
//                     <p className="subtitle">Your own automated investment analyst</p>
//                 </div>
//                 <div className="container-second-text d-flex justify-content-center text-center">
//                     <p className="text second-text">Meet OKAPI, an advanced AI that makes investment analysis accessible to everyone. Calculate at the speed of thought and get results in minutes.</p>
//                 </div>
//                 <TutorialWhitVideo />
//                 <SavingsAndBenefits />
//                 <div className="gradient-background d-flex justify-content-center align-items-center text-center">
//                     <h2 className="text-gradient">Discover how others transformed their investments with OKAPI</h2>
//                 </div>
//                 <CarouselCards />
//                 <div className="gradient-background-end d-flex justify-content-center align-items-center text-center"></div>
//                 <BenefitsSection />
//                 {/* <PricingCards planType="monthly"/> */}
//                 <ProductsSection />
//                 <SocialIcons />
//                 <GradientLine />
//                 <Footer />

//             </div>
//         </>
//     )
// }

// export default HomePage;

import Menu from "../../components/globalComponents/headerMenu/menu"
import "./homePage.scss"
import TutorialWhitVideo from "../../components/homePageComponents/tutorialWhitVideo/tutorialWhitVideo";
import SavingsAndBenefits from "../../components/homePageComponents/savingsAndBenefits/savingsAndBenefits";
import CarouselCards from "../../components/homePageComponents/carouselCards/carouselCards";
import BenefitsSection from "../../components/homePageComponents/benefitsSection/benefitsSection";
import SocialIcons from "../../components/globalComponents/socialIcons/socialIcons";
import GradientLine from "../../components/globalComponents/gradientLine/gradientLine";
import Footer from "../../components/globalComponents/footer/footer";
import ProductsSection from "../../components/pricesComponents/productsSection/productsSection";
import myImgI from "../../../src/media/img/Logo_Olawee_Web.png";
import fondoHero from "../../../src/media/img/Img-oceano.jpg";
import FreeTrialButton from "../../components/globalComponents/principalButton/principalButton";

const HomePage = () => {
    // const [bannerHeight, setBannerHeight] = useState(0);
    return (
        <div className="homepage-wrapper">

            <div className="page-content"
                style={{
                    
                    transition: "padding-top 0.4s ease-in-out"
                }}
            >
                {/* Wrapper para el contenido principal */}
                <main className="main-content">
                    <Menu customClass="custom-navbar-style" />

                    <div
                        className="hero-section d-flex justify-content-center text-center position-relative"
                        style={{
                            minHeight: "70vh",
                            padding: "0rem 1rem",
                            color: "#fff",
                            backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url(${fondoHero})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                        }}
                        >
                        
                        {/* Contenido */}
                        <div className="hero-content w-100 position-relative" style={{ zIndex: 1 }}>
                            <div className="container-logo d-flex justify-content-center text-center">
                                <img src={myImgI} alt="logo-olawee" className="logo" />
                            </div>
                            <div className="d-flex justify-content-center text-center">
                                <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-blue-800 drop-shadow sm:text-5xl lg:text-6xl">INNOVACIÓN SIN BARRERAS, INTELIGENCIA COLECTIVA.
                                </h1>
                            </div>
                            <div className="d-flex justify-content-center text-center">
                                <p className="text">
                                La plataforma que democratiza el acceso a la inteligencia artificial para empresas, asociaciones y colectivos. Sin necesidad de conocimientos técnicos ni grandes inversiones.
                                </p>
                            </div>
                            <br />
                            <div className="d-flex flex-column align-items-center justify-content-center gap-3">
                                <FreeTrialButton text=" Únete al lanzamiento del 15 de octubre y consigue 1 año de OLAWEE gratis." className="btn-olawee-ghost btn-olawee-ghost--xl is-attention"  />
                                <a href="#products-section" className="ms-1 enlace-secundario">Ver cómo funciona</a>
                            </div>
                            
                        </div>
                    </div>

                    <TutorialWhitVideo />
                    <SavingsAndBenefits />
                    <div className="gradient-background d-flex justify-content-center align-items-center text-center">
                        <h2 className="text-gradient">Descubre cómo otros creadores diseñan, comparten y escalan sus agentes de IA.</h2>
                    </div>
                    <CarouselCards />
                    <div className="gradient-background-end d-flex justify-content-center align-items-center text-center"></div>
                    <BenefitsSection />
                    <ProductsSection />
                    <SocialIcons />
                    <GradientLine />
                </main>
                
                {/* Footer al final */}
                <Footer />
            </div>
        </div>
    )
}

export default HomePage;