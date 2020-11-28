import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import 'antd/dist/antd.css';

import { Host, Join, Lobby, Game, Leaderboard } from './screens';
import './SocketIO'

const App = () => {
  return (
    <Router>
      <Switch>
          <Route path="/game-rooms/:short_id/leaderboard" exact>
            <Leaderboard/>
          </Route>
          <Route path="/game-rooms/:short_id/game" exact>
            <Game/>
          </Route>
          <Route path="/game-rooms/:short_id/lobby" exact>
            <Lobby/>
          </Route>
          <Route path="/game-rooms/:short_id" exact>
            <Join/>
          </Route>
          <Route path="/game-rooms" exact>
            <Host/>
          </Route>
          <Redirect to="/game-rooms"/>
      </Switch>
    </Router>
  );
}

export default App;
