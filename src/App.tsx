import {BrowserRouter, Route, Routes} from "react-router-dom";
import Quiz from "./pages/Quiz";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={"/quiz"} element={<Quiz />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;