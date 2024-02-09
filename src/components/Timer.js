import { useEffect } from "react";
import { useQuiz } from "../context/QuizContext";
import { useUsers } from "../context/UsersContext";

function Timer() {
  const { dispatch, secondsRemaining, points } = useQuiz();
  const { updateUserHighscore } = useUsers();

  const mins = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
        secondsRemaining === 1 && updateUserHighscore(points);
      }, 1000);

      return function () {
        clearInterval(id);
      };
    },
    [dispatch, updateUserHighscore, points, secondsRemaining]
  );

  return (
    <div className="timer">
      {mins < 10 && 0}
      {mins}:{seconds < 10 && 0}
      {seconds}
    </div>
  );
}

export default Timer;
