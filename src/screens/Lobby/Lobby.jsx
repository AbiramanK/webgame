import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Button, Row, Col, Modal } from 'antd';

import styles from './Lobby.module.css'
import { Colors } from '../../Colors';
import { Header, Chat } from '../../components';
import { playerIO, vars, gameIO } from '../../SocketIO'

export class Lobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            stateChangeClicked: false,
            startGameClicked: false,
            ownState: vars.player.state,
            players: vars.game.players,
            showModal: false,
            modalMessage: ''
        }
    }

    componentDidMount = () => {     
        if(!vars.init) {
            this.props.history.replace(`/game-rooms/${this.props.match.params.shortId}`)
            return 
        } 

        playerIO.on('joinResAll', data => {
            console.log('Lobby_playerIO_joinResAll', data)

            if(!data.error) {
                const player = vars.game.players.find(player => player._id === data.player._id)
                if(player) { 
                    vars.game.players = vars.game.players.filter(p => p._id !== player._id)
                } 
                vars.game.players.push(data.player) 
                this.setState({ ...this.state, players: vars.game.players})
            }
        })

        playerIO.on('setStateRes', data => {
            console.log('Lobby_playerIO_setStateRes', data)
            
            if(!data.error) {
                vars.game
                    .players    
                    .find(player => player._id === data.playerId)
                    .state = data.state 
                vars.player.state = data.state

                this.setState({ 
                    ...this.state, 
                    stateChangeClicked: false,
                    players: vars.game.players,
                    ownState: data.state
                })
            } else {
                this.setState({ ...this.state, stateChangeClicked: false})
            }
        })

        playerIO.on('setStateResAll', data => {
            console.log('Lobby_playerIO_setStateResAll', data)

            if(!data.error) {
                vars.game
                    .players
                    .find(player => player._id === data.playerId)
                    .state = data.state 

                this.setState({ 
                    ...this.state,
                    players: vars.game.players
                })
            }
        })

        playerIO.on('disconnectingResAll', data => {
            console.log('Lobby_playerIO_disconnectingResAll', data)

            if(!data.error) {
                vars.game
                    .players
                    .find(p => p._id === data.playerId)
                    .state = 'DISCONNECTED'
                this.setState({ 
                    ...this.state,
                    players: vars.game.players
                })
            }
        })

        gameIO.on('newRoundRes', data => {
            console.log('Lobby_gameIO_newRoundRes', data)

            if(!data.error) gameIO.emit('roundInfo', { 
                shortId: vars.game.shortId, 
                playerId: vars.player._id 
            })
            else this.setState({ ...this.state, startGameClicked: false })
        })

        gameIO.on('newRoundResAll', data => {
            console.log('Lobby_gameIO_newRoundResAll', data)

            if(!data.error) gameIO.emit('roundInfo', { 
                shortId: vars.game.shortId, 
                playerId: vars.player._id
            })
        })
     
        gameIO.on('roundInfoRes', data => {
            console.log('Lobby_gameIO_roundInfoRes', data)

            this.setState({ ...this.state, startGameClicked: false })
            if(!data.error) {
                vars.player.isImposter = data.isImposter

                if(data.isImposter) {
                    vars.tempGuesses = data.round.imposter.tempGuesses
                }

                vars.interactions = data.round.interactions

                vars.round = data.round

                this.props.history.replace(`/game-rooms/${vars.game.shortId}/game`)
            }
        })

    }

    componentWillUnmount = () => {
        playerIO.off('joinResAll')
        playerIO.off('setStateRes')
        playerIO.off('setStateResAll')
        playerIO.off('disconnectingResAll')
        gameIO.off('newRoundRes')
        gameIO.off('newRoundResAll')
        gameIO.off('roundInfoRes')
        this.setState = () => {}
    }
    
    handleReadyState = state => { 
        if(!this.state.stateChangeClicked) {
            this.setState({ ...this.state, stateChangeClicked: true })
            playerIO.emit('setState', { 
                shortId: vars.game.shortId, 
                playerId: vars.player._id, 
                state 
            })
        }
    }

    handleStart = () => {
        if(!this.state.startGameClicked) {
            if(vars.game.players.length < 3) {
                this.setState({
                    ...this.state,
                    showModal: true,
                    modalMessage: 'Min. 3 players needed'
                })
            } else if(vars.game.players.find(p => p.state !== 'READY')) {
                this.setState({ 
                    ...this.state, 
                    showModal: true,
                    modalMessage: 'Everyone is not ready yet'
                })
            } else {
                this.setState({ ...this.state, startGameClicked: true })
                gameIO.emit('newRound', { shortId: vars.game.shortId })
            }
        }
    }

    render() {
        const href = window.location.href
        const split = href.split('/')
        split.pop()
        const link = split.join('/')
        
        return (
            <div className={ styles['container'] }>
                <Header/>
                <Row 
                    className={ styles['row'] } 
                    style={{ 
                        marginLeft: 20, 
                        justifyContent: 'left',
                        color: Colors.PRIMARY 
                    }}
                >
                    <Col>
                        <span style={{ 
                            color: Colors.DARKGREY, 
                            MozUserSelect: 'none', 
                            WebkitUserSelect: 'none', 
                            msUserSelect: 'none' 
                        }}>
                            Invitation Link:
                        </span> { link }
                    </Col>
                </Row>
                <Row className={ styles['row'] }>
                    <Col>
                        <div className={ styles['card-wrapper'] }>
                            <Card className={ styles['ready-card'] }
                                title="Ready to play?"
                                bordered={ true }
                                style={{ 
                                    width: 350, 
                                    height: 550, 
                                    paddingTop: 0, 
                                    paddingBottom: 0 
                                }}
                                headStyle={ jsxStyles.cardHeader }
                            >
                                <div style={{ height: 400, overflow: 'auto' }}>
                                    {
                                        this.state.players.map((player, index) => {
                                            return (
                                                <div 
                                                    className={ styles['player-status-card'] } 
                                                    key={ index }
                                                >
                                                    <span 
                                                        className={ styles['player-name'] } 
                                                        style={{ marginRight: 10 }}
                                                    >
                                                        { player.name }
                                                    </span>
                                                    <span 
                                                        className={ styles['player-status'] }
                                                        style={{ 
                                                            color: player.isHost 
                                                                ? Colors.PRIMARY
                                                                : player.state === "READY" 
                                                                    ? Colors.LAWNGREEN 
                                                                    : Colors.RED 
                                                        }}
                                                    >
                                                        { player.isHost ? 'HOST' : player.state }
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                {
                                    vars.player.isHost 
                                        ?   <Button
                                                type="primary"
                                                className={ styles['ready-button'] }
                                                onClick={ this.handleStart }
                                                loading={ this.state.startGameClicked }
                                            >
                                                START
                                            </Button>
                                        :   <Button
                                                type="primary"
                                                className={ styles['ready-button'] }
                                                onClick={ () => this.handleReadyState(
                                                    this.state.ownState === 'READY' 
                                                        ? 'NOT-READY' 
                                                        : 'READY'
                                                    ) 
                                                }
                                                loading={ this.state.stateChangeClicked }
                                            >
                                                { this.state.ownState === 'READY' ? 'NOT-READY' : 'READY' }
                                            </Button>
                                }
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <Chat showInput={ true } chats={ vars.game.lobbyChats }/>
                    </Col>
                </Row>
                <Modal 
                    title="Oops!" 
                    visible={ this.state.showModal }
                    onCancel={ () => this.setState({ 
                        ...this.state, 
                        showModal: false, 
                        modalMessage: '' 
                    }) }
                    footer={ null }
                >
                    <h3 className={ styles['modal'] }>{ this.state.modalMessage }</h3>
                </Modal>
            </div>
        );
    }
}

const jsxStyles = {
    cardHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        color: Colors.WHITE,
        backgroundColor: Colors.PRIMARY,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
}

export default withRouter(Lobby);