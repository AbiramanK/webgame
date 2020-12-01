import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Button, Row, Col, Modal } from 'antd';

import styles from './Lobby.module.css'
import { Colors } from '../../Colors';
import { Header, Chat } from '../../components';
import { playerIO, vars, gameIO, chatIO } from '../../SocketIO'

export class Lobby extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            startGameClicked: false,
            ownState: vars.player.state,
            players: vars.game.players.map(player => {
                return {
                    _id: player._id,
                    name: player.name,
                    email: player.email,
                    state: player.state,
                    isHost: player.isHost
                }
            }),
            showModal: false,
            modalMessage: ''
        }
    }

    componentDidMount = () => {     
        if(!vars.init) {
            this.props.history.replace(`/game-rooms/${this.props.match.params.short_id}`)
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
                this.setState({ 
                    ...this.state,
                    players: vars.game.players.map(player => {
                        return {
                            _id: player._id,
                            name: player.name,
                            email: player.email,
                            state: player.state,
                            isHost: player.isHost
                        }
                    }) 
                })
            }
        })

        playerIO.on('setStateRes', data => {
            console.log('Lobby_playerIO_setStateRes', data)
            
            if(!data.error) {
                vars.game
                    .players    
                    .find(player => player._id === data.player_id)
                    .state = data.state 
                vars.player.state = data.state
            }
        })

        playerIO.on('setStateResAll', data => {
            console.log('Lobby_playerIO_setStateResAll', data)

            if(!data.error) {
                vars.game
                    .players
                    .find(player => player._id === data.player_id)
                    .state = data.state 

                this.state
                    .players
                    .find(player => player._id === data.player_id)
                    .state = data.state
                this.setState({ ...this.state })
            }
        })

        chatIO.on('startGameRes', data => {
            console.log('Lobby_chatIO_startGameRes', data)

            if(!data.error) gameIO.emit('newRound', { short_id: vars.game.short_id })
            else this.setState({ 
                ...this.state, 
                startGameClicked: false,
                showModal: true,
                modalMessage: data.error 
            })
        })

        playerIO.on('disconnected', data => {
            console.log('Lobby_playerIO_disconnected', data)

            if(!data.error) {
                const player = vars.game.players.find(p => p._id === data.player_id)
                player.state = 'DISCONNECTED'
                this.setState({ 
                    ...this.state,
                    players: vars.game.players.map(player => {
                        return {
                            _id: player._id,
                            name: player.name,
                            email: player.email,
                            state: player.state,
                            isHost: player.isHost
                        }
                    }) 
                })
            }
        })

        gameIO.on('newRoundRes', data => {
            console.log('Lobby_gameIO_newRoundRes', data)

            if(!data.error) gameIO.emit('info', { 
                short_id: vars.game.short_id, 
                player_id: vars.player._id 
            })
            else this.setState({ ...this.state, startGameClicked: false })
        })

        gameIO.on('newRoundResAll', data => {
            console.log('Lobby_gameIO_newRoundResAll', data)

            if(!data.error) gameIO.emit('info', { 
                short_id: vars.game.short_id, 
                player_id: vars.player._id
            })
        })
     
        gameIO.on('infoRes', data => {
            console.log('Lobby_gameIO_infoRes', data)

            this.setState({ ...this.state, startGameClicked: false })
            if(!data.error) {
                vars.player.isImposter = data.isImposter

                if(data.isImposter) vars.tempGuesses = data.round.imposter.tempGuesses
                else vars.location = data.round.location
                vars.round = data.round
                vars.interactions = data.round.interactions

                this.props.history.replace(`/game-rooms/${vars.game.short_id}/game`)
            }
        })

    }

    componentWillUnmount = () => {
        playerIO.off('joinResAll')
        playerIO.off('setStateRes')
        playerIO.off('setStateResAll')
        gameIO.off('newRoundRes')
        gameIO.off('newRoundResAll')
        gameIO.off('infoRes')
        this.setState = () => {}
    }
    
    handleReadyState = state => { 
        playerIO.emit('setState', { 
            short_id: vars.game.short_id, 
            player_id: vars.player._id, 
            state 
        })

        this.state
            .players
            .find(player => player._id === vars.player._id)
            .state = state
        this.setState({ 
            ...this.state,
            ownState: state
        })
    }

    handleStart = () => {
        if(!this.state.startGameClicked) {
            chatIO.emit('startGame', { short_id: vars.game.short_id })
            this.setState({ ...this.state, startGameClicked: true })
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
                    style={{ marginLeft: 20, justifyContent: 'left', color: Colors.PRIMARY }}
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
                                style={{ width: 350, height: 550, paddingTop: 0, paddingBottom: 0 }}
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
                                        >
                                            START
                                        </Button>
                                    :   <Button
                                            type="primary"
                                            className={ styles['ready-button'] }
                                            onClick={ () => this.handleReadyState(this.state.ownState === 'READY' ? 'NOT-READY' : 'READY') }
                                        >
                                            { this.state.ownState === 'READY' ? 'NOT-READY' : 'READY' }
                                        </Button>
                                }
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <Chat showInput={ true } chats={ vars.game.lobby.chats }/>
                    </Col>
                </Row>
                <Modal 
                    title="Oops!" 
                    visible={ this.state.showModal }
                    onCancel={ () => this.setState({ ...this.state, showModal: false, modalMessage: '' }) }
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