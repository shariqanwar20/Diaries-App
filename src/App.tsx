import React from "react";
import "./App.css";
import { Auth } from "./components/authentication";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/rootReducer";
import { Home } from "./components/dashboard/Home";

function App() {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">{isLoggedIn ? <Home /> : <Auth />}</Route>
        </Switch>
      </Router>
      {/* <Diaries /> */}
    </div>
  );
}

export default App;
