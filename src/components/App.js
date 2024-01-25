import { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import UserHighscore from "./UserHighscore";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  users: [],
  //'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  isNewHighscore: false,
  curUser: "",
  newUser: "",
  secondsRemaining: null,
  isOpen: true,
  error: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      if (state.users.length === 0)
        return {
          ...state,
          questions: action.payload.data,
          users: action.payload.data2,
          status: "ready",
        };

      return {
        ...state,
        questions: action.payload.data,
        users: action.payload.data2,
        curUser: state.users[0],
        highscore: state.users[0]?.userHighscore,
        status: "ready",
      };

    case "dataFailed":
      return { ...state, status: "error" };

    case "selectUser":
      return {
        ...state,
        curUser: action.payload,
        highscore: action.payload.userHighscore,
      };

    case "openAddUser":
      return { ...state, isOpen: !state.isOpen, newUser: "" };

    case "newUserName":
      const userNames = state.users.map((user) => user.userName);

      return {
        ...state,
        newUser: action.payload,
        error: userNames.includes(action.payload) ? true : false,
      };

    case "addUser":
      return {
        ...state,
        addedUser: action.payload,
        users: [...state.users, action.payload],
        isOpen: false,
        curUser: action.payload,
        highscore: action.payload.userHighscore,
        newUser: "",
      };

    case "removeUser":
      if (state.users.length === 1)
        return {
          ...state,
          users: [],
          curUser: "",
          highscore: 0,
          isOpen: true,
        };

      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
        curUser:
          state.users[0].id === state.curUser.id
            ? state.users[1]
            : state.users[0],
        highscore:
          state.users[0].id === state.curUser.id
            ? state.users[1]?.userHighscore
            : state.users[0]?.userHighscore,
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
        isOpen: state.users.length === 0 ? true : state.isOpen,
        newUser: "",
      };

    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index++,
        answer: null,
      };
    case "finish":
      if (state.points > state.highscore)
        return {
          ...state,
          status: "finished",
          highscore: state.points,
          curUser: { ...state.curUser, userHighscore: state.points },
          users: state.users.map((user) =>
            user.id === state.curUser.id
              ? { ...user, userHighscore: state.points }
              : user
          ),
          isNewHighscore: true,
        };
      return { ...state, status: "finished", isNewHighscore: false };

    case "restart":
      return {
        ...state,
        status: "ready",
        points: 0,
        answer: null,
        index: 0,
        secondsRemaining: null,
        isOpen: true,
        isNewHighscore: false,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining--,
        status: state.secondsRemaining < -1 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      users,
      curUser,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      isOpen,
      newUser,
      error,
      isNewHighscore,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  const numQuestions = questions.length;

  useEffect(function () {
    async function getData() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();

        const res2 = await fetch("http://localhost:8000/users");
        const data2 = await res2.json();

        dispatch({ type: "dataReceived", payload: { data, data2 } });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    }
    getData();
  }, []);

  useEffect(
    function () {
      async function postHighscoreData() {
        return await fetch(`http://localhost:8000/users/${curUser.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json/id",
          },
          body: JSON.stringify({ userHighscore: curUser.userHighscore }),
        });
      }

      isNewHighscore && curUser.id && postHighscoreData();
    },
    [isNewHighscore, curUser]
  );

  return (
    <div className="app">
      <Header />
      {status !== "finished" && (
        <UserHighscore
          highscore={highscore}
          dispatch={dispatch}
          users={users}
          isOpen={isOpen}
          newUser={newUser}
          curUser={curUser}
          error={error}
        />
      )}
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <ErrorMessage />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
                curUser={curUser}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highscore={highscore}
            dispatch={dispatch}
            isNewHighscore={isNewHighscore}
          />
        )}
      </Main>
    </div>
  );
}
