import Form from "./Form";

function UserHighscore({ dispatch, users, isOpen, newUser, curUser, error }) {
  /// removes the user from the json server after removing a user from the ui
  async function removeUserFromData(id) {
    await fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json/id",
      },
    });
  }

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
              dispatch({ type: "removeUser", payload: curUser.id });

              removeUserFromData(curUser.id);
            }}
          >
            ❌
          </button>

          <select
            className="user-select"
            value={curUser?.userName}
            onChange={(e) =>
              dispatch({
                type: "selectUser",
                payload: users.filter(
                  (user) => user.userName === e.target.value
                )[0],
              })
            }
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

      <Form
        dispatch={dispatch}
        newUser={newUser}
        error={error}
        users={users}
        isOpen={isOpen}
      />
    </div>
  );
}

export default UserHighscore;
