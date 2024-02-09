import { createContext, useContext, useEffect, useReducer } from "react";

const UsersContext = createContext();

const initialState = {
  users: [],
  curUser: null,
  newUser: "",
  isOpen: true,
  userExists: false,
  isNewHighscore: false,
  usersStatus: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "UsersDataReceived":
      if (state.users.length === 0) return { ...state, users: action.payload };

      return {
        ...state,
        users: action.payload,
        curUser: state.users[0],
      };

    case "usersDataFailed":
      return { ...state, usersStatus: "error" };

    case "selectUser":
      return {
        ...state,
        curUser: action.payload,
      };

    case "openAddUser":
      return { ...state, isOpen: !state.isOpen, newUser: "" };

    case "newUserName":
      const userNames = state.users.map((user) => user.userName);

      return {
        ...state,
        newUser: action.payload,
        userExists: userNames.includes(action.payload) ? true : false,
      };

    case "addUser":
      return {
        ...state,
        users: [...state.users, action.payload],
        isOpen: false,
        curUser: action.payload,
        newUser: "",
      };

    case "removeUser":
      if (state.users.length === 1)
        return {
          ...state,
          users: [],
          curUser: null,
          isOpen: true,
        };
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        curUser:
          state.users[0].id === state.curUser.id
            ? state.users[1]
            : state.users[0],
      };

    case "start":
      return {
        ...state,
        isOpen: state.users.length === 0 ? true : state.isOpen,
        newUser: "",
      };

    case "newHighscore":
      return {
        ...state,
        curUser: action.payload,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
        isNewHighscore: true,
      };

    case "notNewHighscore":
      return { ...state, isNewHighscore: false };

    default:
      throw new Error("Action Unknown");
  }
}

function UsersProvider({ children }) {
  const [
    {
      users,
      curUser,
      newUser,
      isOpen,
      userExists,
      isNewHighscore,
      usersStatus,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  function selectUser(e) {
    dispatch({
      type: "selectUser",
      payload: users.filter((user) => user.userName === e.target.value)[0],
    });
  }

  function openInput() {
    dispatch({ type: "openAddUser" });
  }

  function setUserName(e) {
    dispatch({ type: "newUserName", payload: e.target.value });
  }

  function setInputOnStart() {
    dispatch({ type: "start" });
  }

  // adds a new user to the data.json file and the state. this function is called in the form add button
  async function addUser(user) {
    try {
      const res = await fetch(`http://localhost:8000/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json/id",
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();

      dispatch({ type: "addUser", payload: data });
    } catch (err) {
      console.log(err);
    }
  }

  // removes the current user from the data.json file and the state. this function is called in the UserHighscore remove button
  async function removeUser(id) {
    try {
      const res = await fetch(`http://localhost:8000/users/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json/id",
        },
      });

      const data = await res.json();

      dispatch({ type: "removeUser", payload: data.id });
    } catch (err) {
      console.log(err);
    }
  }

  //updates the curUser highscore in the data.json file and the state, this function is called in the NextButton finish button
  async function updateUserHighscore(points) {
    if (points <= curUser?.userHighscore || curUser === null)
      return dispatch({ type: "notNewHighscore" });
    try {
      const res = await fetch(`http://localhost:8000/users/${curUser.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json/id",
        },
        body: JSON.stringify({ userHighscore: points }),
      });
      const data = await res.json();

      dispatch({ type: "newHighscore", payload: data });
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(function () {
    async function getUsersData() {
      try {
        const res = await fetch("http://localhost:8000/users");
        const data = await res.json();

        dispatch({ type: "UsersDataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "usersDataFailed" });
      }
    }
    getUsersData();
  }, []);

  return (
    <UsersContext.Provider
      value={{
        isOpen,
        newUser,
        users,
        curUser,
        userExists,
        isNewHighscore,
        addUser,
        removeUser,
        updateUserHighscore,
        selectUser,
        openInput,
        setUserName,
        setInputOnStart,
        usersStatus,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

function useUsers() {
  const context = useContext(UsersContext);

  if (context === undefined)
    throw new Error("usersContext was called outside UsersProvider");

  return context;
}

export { UsersProvider, useUsers };
