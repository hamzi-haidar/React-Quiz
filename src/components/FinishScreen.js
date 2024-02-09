import { useQuiz } from "../context/QuizContext";
import { useUsers } from "../context/UsersContext";

function FinishScreen() {
  const { points, maxPoints, dispatch } = useQuiz();
  const { curUser, isNewHighscore } = useUsers();

  const percentage = (points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 50 && percentage < 100) emoji = "🥈";
  if (percentage >= 0 && percentage < 50) emoji = "🥉";
  if (percentage === 0) emoji = "😔";

  return (
    <>
      <p className="result">
        {emoji} You scored <strong>{points}</strong> out of {maxPoints}{" "}
        {Math.ceil(percentage)}%
      </p>

      <p className="highscore">
        {curUser
          ? `${isNewHighscore ? "⭐ New" : ""} Highscore: ${
              curUser.userHighscore
            } points`
          : `There is no users. Please add a user to view highscores`}
      </p>

      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart quiz
      </button>
    </>
  );
}

export default FinishScreen;
