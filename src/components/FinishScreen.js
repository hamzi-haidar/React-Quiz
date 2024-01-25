function FinishScreen({
  points,
  maxPoints,
  highscore,
  isNewHighscore,
  dispatch,
}) {
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
        {isNewHighscore ? "⭐ New" : ""} Highscore: {highscore} points
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
