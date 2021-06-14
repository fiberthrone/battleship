import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import { UIEventsContext } from "./UIEventsContext";
import { state$, uiEvents$, yourShots$ } from "./observables";
import socket from "./socket";
import App from "./App";
import "./index.css";

yourShots$.subscribe((uiEvent) => {
  socket.emit("action", { type: "shot", i: uiEvent.i, j: uiEvent.j });
});

const rootElement = document.getElementById("root");
state$.subscribe((state) => {
  ReactDOM.render(
    <React.StrictMode>
      <UIEventsContext.Provider value={uiEvents$}>
        <App {...state} />
      </UIEventsContext.Provider>
    </React.StrictMode>,
    rootElement
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
