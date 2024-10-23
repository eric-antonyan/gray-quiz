import {BrowserRouter, Route, Routes} from "react-router-dom";
import Quiz from "./pages/Quiz";
import Account from "./pages/Account";
import Panel from "./pages/Panel";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={"/quiz"} element={<Quiz />} />
          <Route path={"/account"} element={<Account />} />
          <Route path={"/panel"} element={<Panel />} />

        </Routes>
      </BrowserRouter>
  )
}

export default App;