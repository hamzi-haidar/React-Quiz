import { createContext, useContext, useEffect, useReducer } from "react";

const QuizContext = createContext();

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [],
  //'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "quizDataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "quizDataFailed":
      return { ...state, status: "error" };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
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
      return {
        ...state,
        status: "finished",
      };

    case "restart":
      return {
        ...state,
        status: "ready",
        points: 0,
        answer: null,
        index: 0,
        secondsRemaining: null,
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining--,
        status: state.secondsRemaining < 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, secondsRemaining, highscore },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);

  const numQuestions = questions.length;

  useEffect(function () {
    async function getQuizData() {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();

        dispatch({ type: "quizDataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "quizDataFailed" });
      }
    }
    getQuizData();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        status,
        index,
        answer,
        points,
        highscore,
        questions,
        numQuestions,
        dispatch,
        secondsRemaining,
        maxPoints,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuiz() {
  const context = useContext(QuizContext);

  if (context === undefined)
    throw new Error("useQuiz was used outside QuizProvider");
  return context;
}

export { QuizProvider, useQuiz };
