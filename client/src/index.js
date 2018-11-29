import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import  { BrowserRouter } from "react-router-dom";
//

ReactDOM.render(
  <BrowserRouter>
  <App />
</BrowserRouter>, document.querySelector("#App"));
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}
