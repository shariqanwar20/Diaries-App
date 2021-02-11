import React from "react";
import "./App.css";
import { Auth } from "./components/authentication";
import { Diaries } from "./components/dashboard/Diaries";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./redux/rootReducer";

function App() {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">{isLoggedIn ? <Diaries /> : <Auth />}</Route>
        </Switch>
      </Router>
      {/* <Diaries /> */}
    </div>
  );
}

export default App;
