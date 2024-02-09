import { useUsers } from "../context/UsersContext";
import Form from "./Form";

function UserHighscore() {
  const { isOpen, users, curUser, removeUser, selectUser } = useUsers();

  return (
    <div className={`user-highscore-container ${isOpen ? "open" : ""}`}>
      {users.length > 0 && (
        <div className="users-info-container">
          <p className="users-number">
            {users.length} User{users.length > 1 ? "s" : ""}
          </p>

          <button
            className="btn-remove-user"
            onClick={() => {
              removeUser(curUser.id);
            }}
          >
            ❌
          </button>

          <select
            className="user-select"
            value={curUser?.userName}
            onChange={selectUser}
          >
            {users.map((user) => (
              <option value={user.userName} key={user.id}>
                {user.userName}
              </option>
            ))}
          </select>
          <p>Highscore: {curUser?.userHighscore}</p>
        </div>
      )}

      <Form />
    </div>
  );
}

export default UserHighscore;
