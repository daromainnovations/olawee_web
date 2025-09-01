
import "./socialIcons.scss"
import { FaFacebookSquare, FaLinkedin, FaInstagram } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const SocialIcons = () => {
  return (
    <div className="d-flex justify-content-center p-4 social-icons-container">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FaFacebookSquare  />
      </a>
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FaLinkedin />
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FaInstagram />
      </a>
      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FaSquareXTwitter />
      </a>
    </div>
  );
};

export default SocialIcons;
