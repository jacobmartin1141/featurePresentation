import React from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import Header from './Header';

import AppWorkspace from './AppWorkspace';
import About from './About';

function App() {
  return (
    <Router>
      <Route exact path="/">
        <Header />
        <About />
      
      </Route>
      <Route path="/app">
        <AppWorkspace />

      </Route>
    </Router>
  );
}

export default App;
