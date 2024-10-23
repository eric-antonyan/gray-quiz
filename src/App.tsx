import {BrowserRouter, Route, Routes} from "react-router-dom";
import Quiz from "./pages/Quiz";
import Account from "./pages/Account";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={"/quiz"} element={<Quiz />} />
          <Route path={"/account"} element={<Account />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;