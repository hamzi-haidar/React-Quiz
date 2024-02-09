import { useEffect, useRef } from "react";
import { useUsers } from "../context/UsersContext";

function Form() {
  const {
    newUser,
    isOpen,
    users,
    addUser,
    userExists,
    openInput,
    setUserName,
  } = useUsers();

  // adds a user to the jason server after adding a user from the ui

  useEffect(
    function () {
      const onkeydown = function (e) {
        if (e.code !== "Escape" || users.length === 0) return;

        openInput();
      };

      document.addEventListener("keydown", onkeydown);

      return function () {
        document.removeEventListener("keydown", onkeydown);
      };
    },
    [openInput, users]
  );

  const el = useRef(null);
  useEffect(
    function () {
      el.current?.focus();
    },
    [isOpen]
  );
  return (
    <>
      <form
        className={`form-add-user`}
        onSubmit={(e) => e.preventDefault()}
        style={
          users.length === 0
            ? {
                marginLeft: "4rem",
              }
            : {}
        }
      >
        <input
          disabled={!isOpen}
          ref={el}
          value={newUser}
          type="text"
          placeholder="Add new user"
          onChange={setUserName}
        />
        {newUser && (
          <div className="form-btn-box">
            <button
              style={
                userExists
                  ? {
                      backgroundColor: "black",
                      cursor: "not-allowed",
                    }
                  : {}
              }
              onClick={(e) => {
                e.preventDefault();

                const newAddedUser = {
                  userName: newUser,
                  userHighscore: 0,
                };

                addUser(newAddedUser);
              }}
              disabled={userExists}
            >
              {userExists ? "🚫" : "Add"}
            </button>

            {userExists && <p>User already exists</p>}
          </div>
        )}
      </form>
      {!newUser && (
        <>
          {users.length === 0 ? (
            <p>Add users to save the highscores</p>
          ) : (
            <button className="btn-open-add" onClick={openInput}>
              {!isOpen ? "➕" : "✖️"}
            </button>
          )}
        </>
      )}
    </>
  );
}

export default Form;
