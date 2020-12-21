import React from 'react'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import 'antd/dist/antd.css'

import { Host, Join, Lobby, Game, Leaderboard } from './screens'
import './SocketIO'
import popup from './assets/popup.mp3'

const App = () => {
  return (
    <BrowserRouter>
        <audio 
          id="popup-audio"
          style={{ display: 'none' }} 
          preload="auto" 
          src={ popup }
          muted={ true }
        /> 
      <Switch>

          <Route path="/game-rooms/:shortId/leaderboard" exact>
            <Leaderboard/>
          </Route>

          <Route path="/game-rooms/:shortId/game" exact>
            <Game/>
          </Route>

          <Route path="/game-rooms/:shortId/lobby" exact>
            <Lobby/>
          </Route>

          <Route path="/game-rooms/:shortId" exact>
            <Join/>
          </Route>

          <Route path="/game-rooms" exact>
            <Host/>
          </Route>

          <Redirect to="/game-rooms"/>

      </Switch>
    </BrowserRouter>
  )
}

export default App
