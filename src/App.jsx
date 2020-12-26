import React, { useState, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import 'antd/dist/antd.css'
import { Modal } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { Host, Join, Lobby, Game, Leaderboard } from './screens'
import { vars, playerIO, chatIO, gameIO } from './SocketIO'
import popup from './assets/popup.mp3'

const App = () => {
  const [modal, setModal] = useState({ show: false, message: '' })
  useSocketInfo(setModal)

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
      <Modal 
          title="Oops!" 
          visible={ modal.show }
          onCancel={ () => setModal({ show: false, message: '' }) }
          footer={ null }
          closable={ false }
      >
          <h3 style={{ textAlign: 'center' }}>
            { modal.message }
            <span style={{ marginLeft: '10px' }}><LoadingOutlined /></span>
          </h3>
      </Modal>
    </BrowserRouter>
  )
}

const useSocketInfo = (setModal) => {
  useEffect(() => {
    playerIO.on('disconnect', () => {
      console.log('PLAYERIO DISCONNECT')
      setModal(modal => vars.init ? ({ show: true, message: 'Player disconnected' }) : modal)
    })
    chatIO.on('disconnect', () => {
      console.log('CHATIO DISCONNECT')
      setModal(modal => vars.init ? ({ show: true, message: 'Chat disconnected' }) : modal)
    })
    gameIO.on('disconnect', () => {
      console.log('GAMEIO DISCONNECT')
      setModal(modal => vars.init ? ({ show: true, message: 'Game disconnected' }) : modal)
    })

    playerIO.on('connect', () => {
      console.log('PLAYERIO CONNECT')
      setModal(modal => modal.show ? window.location.reload() : modal)
    })
    chatIO.on('connect', () => {
      console.log('CHATIO CONNECT')
      setModal(modal => modal.show ? window.location.reload() : modal)
    })
    gameIO.on('connect', () => {
      console.log('GAMEIO CONNECT')
      setModal(modal => modal.show ? window.location.reload() : modal)
    })

    return () => {
      playerIO.off('disconnect')
      chatIO.off('disconnect')
      gameIO.off('disconnect')

      playerIO.off('connect')
      chatIO.off('connect')
      gameIO.off('connect')
    }
  }, [setModal])
}

export default App
