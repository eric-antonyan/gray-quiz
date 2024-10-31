import {BrowserRouter, Route, Routes} from "react-router-dom";
import Quiz from "./pages/Quiz";
import Account from "./pages/Account";
import Panel from "./pages/Panel";
import TestQuiz from "./pages/TestQuiz";
import Raiting from "./pages/Raiting";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={"/quiz/:quizId"} element={<Quiz/>}/>
                <Route path={"/test/:quizId"} element={<TestQuiz/>}/>
                <Route path={"/account"} element={<Account/>}/>
                <Route path={"/panel"} element={<Panel />} />
                <Route path={"/raiting"} element={<Raiting />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App;