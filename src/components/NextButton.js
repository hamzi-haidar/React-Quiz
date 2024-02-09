import { useQuiz } from "../context/QuizContext";
import { useUsers } from "../context/UsersContext";

function NextButton() {
  const { dispatch, answer, numQuestions, index, points } = useQuiz();
  const { updateUserHighscore } = useUsers();

  if (answer === null) return null;

  if (index < numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );
  if (index === numQuestions - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "finish" });
          updateUserHighscore(points);
        }}
      >
        Finish
      </button>
    );
}

export default NextButton;
