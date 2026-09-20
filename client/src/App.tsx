import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import { useState } from "react";
import Main from "./pages/Main";
import Login from "./pages/Login";

function App() {
  const [isLoggedIn] = useState(true);

  return isLoggedIn ? <Main /> : <Login />;
}

export default App;
