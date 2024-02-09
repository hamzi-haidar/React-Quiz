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
import { useQuiz } from "../context/QuizContext";
import { useUsers } from "../context/UsersContext";

export default function App() {
  const { status } = useQuiz();
  const { usersStatus } = useUsers();

  return (
    <div className="app">
      <Header />
      {status !== "finished" && usersStatus !== "error" && <UserHighscore />}
      <Main>
        {status === "loading" && <Loader />}
        {(status === "error" || usersStatus === "error") && <ErrorMessage />}
        {status === "ready" && <StartScreen />}
        {status === "active" && (
          <>
            <Progress />
            <Question />
            <Footer>
              <Timer />
              <NextButton />
            </Footer>
          </>
        )}
        {status === "finished" && <FinishScreen />}
      </Main>
    </div>
  );
}
