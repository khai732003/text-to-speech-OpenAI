import logo from "./logo.svg";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route>
          <Route index element={<Home />} />
        </Route>
      </Routes>

    </div>
  );
}

export default App;
