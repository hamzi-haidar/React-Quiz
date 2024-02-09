import { useQuiz } from "../context/QuizContext";
import { useUsers } from "../context/UsersContext";

function ErrorMessage() {
  const { status } = useQuiz();
  const { usersStatus } = useUsers();

  return (
    <p className="error">
      <span>💥</span> There was an error fecthing{" "}
      {status === "error" && usersStatus === "error"
        ? "Data"
        : usersStatus === "error"
        ? "Users"
        : "Questions"}
    </p>
  );
}

export default ErrorMessage;
