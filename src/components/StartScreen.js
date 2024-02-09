import { useQuiz } from "../context/QuizContext";
import { useUsers } from "../context/UsersContext";

function StartScreen() {
  const { numQuestions, dispatch } = useQuiz();
  const { setInputOnStart } = useUsers();

  return (
    <div className="start">
      <h2>Welocome to the React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "start" });
          setInputOnStart();
        }}
      >
        Let's start
      </button>{" "}
    </div>
  );
}

export default StartScreen;
