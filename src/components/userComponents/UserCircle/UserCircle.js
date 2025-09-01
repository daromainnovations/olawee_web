import { useState } from "react";
import "./UserCircle.scss";
import UserSidebarModal from "../userSidebarModal/userSidebarModal";
import { useAuth } from "../../../context/authProviderContext";

const UserCircle = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const initial =
    (user?.first_name ||
      user?.billing?.first_name ||
      user?.username ||
      user?.email)?.charAt(0).toUpperCase();

  return (
    <>
      <div className="user-circle-button">
        <button className="circle" onClick={() => setSidebarOpen(true)}>
          {initial || <i className="bi bi-person-fill"></i>}
        </button>
      </div>

      <UserSidebarModal isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
};

export default UserCircle;
