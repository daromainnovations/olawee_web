
import './principalButton.scss'


const PrincipalButton = ({text, onClick, style, className, containerClass, disabled}) => {

    return(
        <div className={containerClass}>
            <button
                className={className}
                onClick={onClick}
                style={style}
                disabled={disabled}
                >
            {text}
            </button>
    </div>
    )
}

export default PrincipalButton;