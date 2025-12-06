import { useState } from "react";
import LoginPage from "./components/LoginPage";
import InvestorDashboard from "./components/InvestorDashboard";

function App() {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  return (
    <div className="app-root">
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <InvestorDashboard userName={userName} />
      )}
    </div>
  );
}

export default App;
