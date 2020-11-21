import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import 'antd/dist/antd.css';

import {
  Login,
  Lobby,
  LobbyLeaderBoard
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
          <Route 
            path="/lobby-leader-board"
            component={LobbyLeaderBoard}
            exact
          />
        </Switch>
    </Router>
  );
}

export default App;
