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



import { useState } from "react";
import BannerOferta from "../../components/globalComponents/bannerOferta/bannerOferta";
import Menu from "../../components/globalComponents/headerMenu/menu"
import "./homePage.scss"
import GoalDescriptionInput from "../../components/homePageComponents/goalDescriptionInput/goalDescriptionInput";
import TutorialWhitVideo from "../../components/homePageComponents/tutorialWhitVideo/tutorialWhitVideo";
import SavingsAndBenefits from "../../components/homePageComponents/savingsAndBenefits/savingsAndBenefits";
import CarouselCards from "../../components/homePageComponents/carouselCards/carouselCards";
import BenefitsSection from "../../components/homePageComponents/benefitsSection/benefitsSection";
import SocialIcons from "../../components/globalComponents/socialIcons/socialIcons";
import GradientLine from "../../components/globalComponents/gradientLine/gradientLine";
import Footer from "../../components/globalComponents/footer/footer";
import ProductsSection from "../../components/pricesComponents/productsSection/productsSection";
import myImgI from "../../../src/media/img/letraImagen.png";

const HomePage = () => {
    const [bannerHeight, setBannerHeight] = useState(0);
    return(
        <div className="homepage-wrapper">
            <BannerOferta setBannerHeight={setBannerHeight} />
            
            <div className="page-content" 
                style={{  paddingTop: `${bannerHeight + 60}px`, 
                    transition: "padding-top 0.4s ease-in-out"
                }} 
            >
                {/* Wrapper para el contenido principal */}
                <main className="main-content">
                    <Menu bannerHeight={bannerHeight -20} customClass="custom-navbar-style"/>
                    
                    <div className="d-flex justify-content-center text-center">
                        <img src={myImgI} alt="logo-okapi"></img>
                    </div>
                    <div className="d-flex justify-content-center text-center">
                        <p className="mt-2 secondary-title">EQUIPOS INTELIGENTES, GRAN PRODUCTIVIDAD</p>
                    </div>
                    <div className="d-flex justify-content-center text-center">
                        <p className="text">Describe tus retos diarios y OLAWEE te mostrará cuánto tiempo puedes ahorrar, la eficiencia que puedes ganar y la colaboración que puedes lograr. Maximiza tu productividad y reduce la carga de trabajo innecesaria</p>
                    </div>
                    <GoalDescriptionInput />
                    <div className="d-flex justify-content-center text-center container-subtitle">
                        <p className="subtitle">Tu propio asistente de IA automatizado para el trabajo</p>
                    </div>
                    <div className="container-second-text d-flex justify-content-center text-center">
                        <p className="text second-text">Conoce OLAWEE, una plataforma SaaS avanzada que hace que la inteligencia artificial sea accesible para todas las PYMEs. Crea, entrena y comparte tus propios agentes de IA, adáptalos a tus tareas diarias y colabora con tu equipo en minutos.</p>
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