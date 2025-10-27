
import "./socialIcons.scss"
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { RiYoutubeLine } from "react-icons/ri";
import { FaSquareXTwitter } from "react-icons/fa6";

const SocialIcons = () => {
  return (
    <div className="d-flex justify-content-center p-4 social-icons-container">
      <a href="https://www.youtube.com/@olawee_app/videos" target="_blank" rel="noopener noreferrer" className="social-icon">
      <RiYoutubeLine />
      </a>
      <a href="https://www.linkedin.com/company/olawee/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FaLinkedin />
      </a>
      <a href="https://www.instagram.com/olawee_app/" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FaInstagram />
      </a>
      <a href="https://x.com/OLAWEE_app/status/1982755081255882817" target="_blank" rel="noopener noreferrer" className="social-icon">
        <FaSquareXTwitter />
      </a>
    </div>
  );
};

export default SocialIcons;
