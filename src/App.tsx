import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'antd/dist/antd.css';

import {
  Login,
  Lobby
} from './screens';

const App = () => {
  return (
    <Router>
      <Switch>
          <Route 
            path="/"
            component={Login}
            exact
          />
          <Route 
            path="/lobby"
            component={Lobby}
            exact
          />
        </Switch>
    </Router>
  );
}

export default App;
