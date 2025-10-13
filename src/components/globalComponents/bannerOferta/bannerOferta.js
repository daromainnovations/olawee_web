// import { useEffect, useRef, useState } from "react";
// import "./bannerOferta.scss"

// const BannerOferta = ({setBannerHeight}) => {

//     const [visible, setVisible] = useState(false);
//     const bannerRef = useRef(null);

//     useEffect(() => {
//       const timer = setTimeout(() => {
//         setVisible(true);
//         if (bannerRef.current) {
//           setBannerHeight(bannerRef.current.clientHeight); // Capturar altura real del banner
//         }
//       }, 1000); // Mostrar después de 1 segundo
  
//       return () => clearTimeout(timer);
//     }, [setBannerHeight]);
    
//       return (
//         <div ref={bannerRef} className={`d-flex justify-content-center text-center banner-oferta ${visible ? "visible" : ""}`}>
//           🎉 ¡Oferta por tiempo limitado: ahorra hasta un 25% en OLAWEE hoy! 🚀
//         </div>
//       );
// }

// export default BannerOferta;