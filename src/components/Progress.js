import { useQuiz } from "../context/QuizContext";

function Progress() {
  const { index, numQuestions, points, maxPoints, answer } = useQuiz();

  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />

      <p>
        Question{" "}
        <strong>
          {index + 1}/{numQuestions}
        </strong>{" "}
      </p>
      <p>
        points{" "}
        <strong>
          {points}/{maxPoints}
        </strong>{" "}
      </p>
    </header>
  );
}

export default Progress;
