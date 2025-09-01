
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './components/globalComponents/login/styles/resetPassword.scss';


import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/homePage/homePage';
import { ChatProvider } from './context/chatContext';
import PricePage from './pages/pricesPage/pricePage';
import SucessPage from './pages/userCases/userCases';
import CaseStudyPage from './pages/caseStudyPage/caseStudyPage';
import FaqPages from './pages/faqPages/faqPages';
import LoginButton from './components/globalComponents/login/loginButton';
import SignUpButton from './components/globalComponents/login/signUpButton';
import { AuthProvider } from './context/authProviderContext';
import ResetPasswordForm from './components/globalComponents/login/resetPasswordForm';
import PrivateRoute from './routes/PrivateRoute';
import N8nChat from './components/globalComponents/chatBox/chatBoxN8N';
import UserPanel from './components/userComponents/userPanel/UserPanel';
import { NewsProvider } from './context/newsContext';
import { LicensesProvider } from './context/licensesContext';
import { ProjectsProvider } from './context/projectsContext';
import { useEffect, useState } from 'react';
import AuthModal from './components/globalComponents/login/authModal';
import CustomizeRoiPage from './pages/customizeRoiPage/customizeRoiPage';
import OkapiSocialPage from './pages/okapiSocialPage/okapiSocialPage';



const App = () => {
  const location = useLocation();
  const [modalType, setModalType] = useState(null);
  const [preloadedEmail, setPreloadedEmail] = useState("");

  // ESCUCHAR el evento para abrir el login modal
  useEffect(() => {
    if (location.state?.openLoginModal) {
      const email = localStorage.getItem("reset_email") || "";
      if (email) {
        setPreloadedEmail(email);
        localStorage.removeItem("reset_email");
      }
      setModalType("login");
    }
  }, [location]);
  
  return (
    <AuthProvider>
      <ChatProvider>
      <div id="n8n-chat" />
        <N8nChat />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Prices" element={<PricePage />} />
          <Route path="/User-Cases" element={<SucessPage />} />
          <Route path="/case-study/:id" element={<CaseStudyPage />} />
          <Route path="/customize" element={<CustomizeRoiPage />} />
          <Route path="/customize/social" element={<OkapiSocialPage />} />
          <Route path="/FAQ" element={<FaqPages />} />
          <Route path="/login" element={<LoginButton />} />
          <Route path="/signup" element={<SignUpButton />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <NewsProvider>
                <ProjectsProvider>
                  <LicensesProvider>
                    <UserPanel />
                  </LicensesProvider>
                </ProjectsProvider>
              </NewsProvider>
            </PrivateRoute>
          }
        />
        </Routes>
        {modalType && (
        <AuthModal
          modalType={modalType}
          setModalType={setModalType}
          preloadedEmail={preloadedEmail}
        />
      )}
      </ChatProvider>
    </AuthProvider>
  );
};

export default App;