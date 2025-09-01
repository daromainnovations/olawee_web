
import Footer from "../../components/globalComponents/footer/footer";
import GradientLine from "../../components/globalComponents/gradientLine/gradientLine";
import Menu from "../../components/globalComponents/headerMenu/menu";
import SocialIcons from "../../components/globalComponents/socialIcons/socialIcons";
import CardCases from "../../components/userCasesComponents/cardCases/cardCases";
import "./userCases.scss";


const SucessPage = () => { 
    return(
        <>
            <Menu />
            <div className="d-flex justify-content-center text-center">
                <h1 className="title">Real Stories, Incredible Results</h1>
            </div>
            <CardCases />
            <SocialIcons />
            <GradientLine />
            <Footer />
            
        </>
    )
}

export default SucessPage;