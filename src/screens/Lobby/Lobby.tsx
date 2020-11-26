import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Card, Button, Row, Col } from 'antd';

import styles from './Lobby.module.css'
import { Colors } from '../../Colors';
import { Header, Chat } from '../../components';
import { playerIO, vars, chatIO, gameIO } from '../../SocketIO'

export interface IChat {
    name: string,
    email: string,
    message: string
}
 
export interface ILobbyProps extends RouteComponentProps {}

export interface ILobbyState {
    chats: IChat[]
    player: any,
    players: object[]
} 

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {
    constructor(props: ILobbyProps) {
        super(props);

        this.state = { 
            chats: [],
            player: vars.player,
            players: vars.game.players
        }
    }

    componentDidMount = () => {        
        playerIO.on('joinResAll', (data: any) => {
            console.log('Lobby_joinResAll', data)

            if(!data.error) {
                vars.game.players = data.players 
                this.setState({ ...this.state, players: data.players })
            }
        })

        playerIO.on('setStateRes', (data: any) => {
            console.log('Lobby_setStateRes', data)
            
            if(!data.error) {
                vars.game.players = data.players 
                this.setState({ 
                    players: data.players, 
                    player: data.players.find((player: any) => player.email === this.state.player.email) 
                })
            }
        })

        playerIO.on('setStateResAll', (data: any) => {
            console.log('Lobby_setStateResAll', data)

            if(!data.error) {
                vars.game.players = data.players 
                this.setState({ ...this.state, players: data.players })
            }
        })

        chatIO.on('startGameRes', (data: any) => {
            console.log('Lobby_startGameRes', data)

            if(!data.error) gameIO.emit('start', { short_id: vars.game.short_id, player_id: vars.player._id })
        })

        chatIO.on('startGameResAll', (data: any) => {
            console.log('Lobby_startGameResAll', data)

            if(!data.error) gameIO.emit('start', { short_id: vars.game.short_id, player_id: vars.player._id })
        })

        gameIO.on('startRes', (data: any) => {
            console.log('Lobby_startRes', data)

            if(!data.error && vars.player.isHost) gameIO.emit('newRound', { short_id: vars.game.short_id })
        })

        gameIO.on('newRoundRes', (data: any) => {
            console.log('Lobby_newRoundRes', data)

            if(!data.error) {
                vars.ROUND_TIMEOUT = data.ROUND_TIMEOUT 

                gameIO.emit('info', { 
                    short_id: vars.game.short_id, 
                    email: vars.player.email, 
                    round_id: data.round_id 
                })
            }
        })

        gameIO.on('newRoundResAll', (data: any) => {
            console.log('Lobby_newRoundResAll', data)

            if(!data.error) {
                vars.ROUND_TIMEOUT = data.ROUND_TIMEOUT 
                
                gameIO.emit('info', { 
                    short_id: vars.game.short_id, 
                    email: vars.player.email, 
                    round_id: data.round_id 
                })
            }
        })

        gameIO.on('infoRes', (data: any) => {
            console.log('Lobby_infoRes', data)

            if(!data.error) {
                data.round.tiles.locations = this.parseLocations(data.round.tiles)
                data.tempGuesses = this.parseTempGuesses(data.round.tiles, data.tempGuesses)

                vars.player.isImposter = data.isImposter
                vars.round = data.round
                vars.location = data.location
                vars.tempGuesses = data.tempGuesses

                this.props.history.replace(`/game-rooms/${vars.game.short_id}/game`)
            }
        })
    }

    componentWillUnmount = () => {
        playerIO.off('joinResAll')
        playerIO.off('setStateRes')
        playerIO.off('setStateResAll')
        chatIO.off('startGameRes')
        chatIO.off('startGameResAll')
        gameIO.off('startRes')
        gameIO.off('newRoundRes')
        gameIO.off('newRoundResAll')
        gameIO.off('infoRes')
        this.setState = () => {}
    }

    parseLocations = (tiles: any) => {
        const parsedLocations = new Array(tiles.rows).fill(undefined).map(() => new Array(tiles.columns).fill(undefined))
        tiles.locations.forEach((location: any) => {
            parsedLocations[location.position.i][location.position.j] = {
                name: location.name,
                image: location.image
            }
        })
        return parsedLocations
    }

    parseTempGuesses = (tiles: any, tempGuesses: any) => {
        const parsedGuesses = new Array(tiles.rows).fill(undefined).map(() => new Array(tiles.columns).fill(undefined))
        tempGuesses.forEach((guess: any) => { parsedGuesses[guess.position.i][guess.position.j] = guess })
        return parsedGuesses
    }
    
    handleReadyState = (state: any) => { 
        const game = vars.game
        const player = this.state.player
        playerIO.emit('setState', { short_id: game.short_id, player_id: player._id, state })
    }

    handleStart = () => chatIO.emit('startGame', { short_id: vars.game.short_id })

    public render() {
        const href = window.location.href
        const split = href.split('/')
        split.pop()
        const link = split.join('/')
        
        return (
            <div className={ styles['container'] }>
                <Header/>
                <Row className={ styles['row'] } style={{ marginLeft: 20, justifyContent: 'left', color: Colors.PRIMARY }}>
                    <Col>
                        <span style={{ color: Colors.DARKGREY, MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}>
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
                                        this.state.players.map((player: any, index: any) => {
                                            return (
                                                <div className={ styles['player-status-card'] } key={ index }>
                                                    <span className={ styles['player-name'] } style={{ marginRight: 10 }}>
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
                                            onClick={ () => this.handleReadyState(this.state.player.state === 'READY' ? 'NOT-READY' : 'READY') }
                                        >
                                            { this.state.player.state === 'READY' ? 'NOT-READY' : 'READY' }
                                        </Button>
                                }
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <Chat join={ true } showInput={ true } chats={ [] }/>
                    </Col>
                </Row>
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