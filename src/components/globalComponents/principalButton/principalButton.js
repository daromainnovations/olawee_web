
// import './principalButton.scss'


// const PrincipalButton = ({text, onClick, style, className, containerClass, disabled}) => {

//     return(
//         <div className={containerClass}>
//             <button
//                 className={className}
//                 onClick={onClick}
//                 style={style}
//                 disabled={disabled}
//                 >
//             {text}
//             </button>
//     </div>
//     )
// }

// export default PrincipalButton;




// PrincipalButton.jsx
import './principalButton.scss';

const LANDING_URL = 'https://landing-page-tau-six-50.vercel.app/';

const PrincipalButton = ({
  text,
  onClick,
  style,
  className,
  containerClass,
  disabled,
  href = LANDING_URL,     // opcional: si quieres otra URL en algún caso
  openNewTab = false      // opcional: abrir en nueva pestaña
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    if (onClick) onClick(e);

    if (openNewTab) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  };

  return (
    <div className={containerClass}>
      <button
        type="button"
        className={className}
        onClick={handleClick}
        style={style}
        disabled={disabled}
      >
        {text}
      </button>
    </div>
  );
};

export default PrincipalButton;
