import { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Ledger from "./pages/Ledger";
import Settings from "./pages/Settings";

function App() {
  const [height, setHeight] = useState(window.innerHeight);

  const onResize = () => {
    setHeight(window.innerHeight * 0.01);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return window.removeEventListener("resize", onResize);
  });

  return (
    <Router>
      <div className="app" style={{ height: height }}>
        <Routes>
          {/* 账本界面 */}
          <Route path="/ledger" element={<Ledger />}></Route>
          {/* 设置界面 */}
          <Route path="/settings" element={<Settings />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
