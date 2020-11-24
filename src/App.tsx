import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import 'antd/dist/antd.css';

import { Host, Join, Lobby } from './screens';
import { Cell } from './components'
import './SocketIO'

const App = () => {
  return (
    <Router>
      <Switch>
          <Route path="/game-rooms/:short_id/game" exact>
            <Lobby/>
          </Route>
          <Route path="/game-rooms/:short_id" exact>
            <Join/>
          </Route>
          <Route path="/game-rooms" exact>
            <Host/>
          </Route>
          <Route path="/test" exact>

            <Cell isImposter={ false } isJackpot={ true } markChanged={ (mark: string) => console.log(mark) } name={ 'moscow' } image={ 'http://localhost:4000/webgame/locations/Bank.svg' }/>

          </Route>
          <Redirect to="/game-rooms"/>
      </Switch>
    </Router>
  );
}

export default App;
