import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Card, Button, Row, Col } from 'antd';

import styles from './Lobby.module.css'
import { Colors } from '../../Colors';
import { Header, Chat } from '../../components';
import { playerIO, vars } from '../../SocketIO'

export interface IChat {
    name: string,
    email: string,
    message: string
}
 
export interface ILobbyProps extends RouteComponentProps {}

export interface ILobbyState {
    chats: IChat[]
    player: any,
    players: Array<object>
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

            if(!data.error) this.setState({ ...this.state, players: data.players })
        })

        playerIO.on('setStateRes', (data: any) => {
            console.log('Lobby_setStateRes', data)
            
            if(!data.error) {
                this.setState({ 
                    players: data.players, 
                    player: data.players.find((player: any) => player.email === this.state.player.email) 
                })
            }
        })

        playerIO.on('setStateResAll', (data: any) => {
            console.log('Lobby_componentDidMount_setStateResAll', data)

            if(!data.error) this.setState({ ...this.state, players: data.players })
        })
    };
    
    handleReadyState = (state: any) => {
        const game = vars.game
        const player = this.state.player
        playerIO.emit('setState', { short_id: game.short_id, email: player.email, state })
    }

    handleStart = () => {
        console.log('start')
    }

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
                        <Chat join={ true }/>
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