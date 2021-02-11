import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider } from "theme-ui";
import { deep } from "@theme-ui/presets";
import { setupServer } from "./services/mirage/server";
import { Provider } from "react-redux";
import store from "./redux/store";

setupServer();

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={deep}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
