import { useEffect, useRef } from "react";

function Form({ dispatch, newUser, error, users, isOpen }) {
  // adds a user to the jason server after adding a user from the ui
  async function addUserToData(user) {
    try {
      await fetch(`http://localhost:8000/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json/id",
        },
        body: JSON.stringify(user),
      });
    } catch (err) {
      // console.log(err);
    }
  }

  useEffect(
    function () {
      const onkeydown = function (e) {
        if (e.code !== "Escape" || users.length === 0) return;

        dispatch({ type: "openAddUser" });
      };

      document.addEventListener("keydown", onkeydown);

      return function () {
        document.removeEventListener("keydown", onkeydown);
      };
    },
    [dispatch, users]
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
          onChange={(e) =>
            dispatch({ type: "newUserName", payload: e.target.value })
          }
        />
        {newUser && (
          <div className="form-btn-box">
            <button
              style={
                error
                  ? {
                      backgroundColor: "black",
                      cursor: "not-allowed",
                    }
                  : {}
              }
              onClick={(e) => {
                e.preventDefault();
                const id = Date.now().toString().slice(8, -1);
                const newAddedUser = {
                  id,
                  userName: newUser,
                  userHighscore: 0,
                };

                dispatch({
                  type: "addUser",
                  payload: newAddedUser,
                });

                addUserToData(newAddedUser);
              }}
              disabled={error}
            >
              {error ? "🚫" : "Add"}
            </button>

            {error && <p>User already exists</p>}
          </div>
        )}
      </form>
      {!newUser && (
        <>
          {users.length === 0 ? (
            <p>Add users to save the highscores</p>
          ) : (
            <button
              className="btn-open-add"
              onClick={() => {
                dispatch({ type: "openAddUser" });
              }}
            >
              {!isOpen ? "➕" : "✖️"}
            </button>
          )}
        </>
      )}
    </>
  );
}

export default Form;
