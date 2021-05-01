import React from "react";
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";

import AppWorkspace from './AppWorkspace';

function App() {
  return (
    <Router>
      <Route path="/">
        
      </Route>
      <Route path="/app">
        <AppWorkspace />

      </Route>
    </Router>
  );
}

export default App;
