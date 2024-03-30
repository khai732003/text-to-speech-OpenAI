import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route>
          <Route index element={<Home />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
