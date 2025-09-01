
import "./userCard.scss"


const UserCard = ({ user, isExpanded, toggleExpanded }) => {
  const defaultPhoto = "https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/person-circle.svg";

  return (
    <div className={`user-card ${isExpanded ? 'expanded' : ''}`}>
      {/* Imagen del usuario */}
      <div className="user-info d-flex justify-content-space-between col-12">
        <img src={user.photo || defaultPhoto } alt={user.name} className="user-photo" />
        <div className="user-header">
            <h5 className="user-name">{user.name}</h5>
            <p className="user-username">@{user.username}</p>
        </div>
      </div>
      
      {/* Contenido de la tarjeta */}
      <div className="container-opinion row col-12">
        <p className={`user-opinion ${isExpanded ? "expanded" : ""}`}>{user.opinion}</p>
      </div>

      {/* Leer más y fecha */}
      <div className="user-footer">
        <span className="read-more" onClick={() => toggleExpanded(user.id)}>
          {isExpanded ? "Leer menos" : "Leer más"}
        </span>
        <span className="opinion-date">{user.date}</span>
      </div>
    </div>
  );
};

export default UserCard;
