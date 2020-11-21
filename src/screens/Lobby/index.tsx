import * as React from 'react';
import './index.css'
import { Card, Button, Row, Col } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Colors } from './../../Colors';
import { HeaderComponent, ChatComponent } from './../../components';
import { playerIO } from '../../SocketIO'

interface LocationState {
    data: any
}
 
export interface ILobbyProps extends RouteComponentProps<{}, {}, LocationState> {
   
}

export interface ILobbyState {
    player: any,
    players: Array<object>
} 

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {
    constructor(props: ILobbyProps) {
        super(props);

        this.state = { 
            player: this.props.location.state.data.player,
            players: this.props.location.state.data.game.players
        }
    }

    componentDidMount = () => {        
        playerIO.on('joinResAll', (data: any) => {
            console.log('Lobby_componentDidMount_joinResAll', data)
            if(!data.error) this.setState({ ...this.state, players: data.players })
        })

        playerIO.on('setStateRes', (data: any) => {
            console.log('Lobby_componentDidMount_setStateRes', data)
            if(!data.error) this.setState({ 
                players: data.players, 
                player: data.players.find((player: any) => player.email === this.state.player.email) 
            })
        })

        playerIO.on('setStateResAll', (data: any) => {
            console.log('Lobby_componentDidMount_setStateResAll', data)
            if(!data.error) this.setState({ ...this.state, players: data.players })
        })
    };
    

    suffix = () => {
        return (
            <AudioOutlined
                style={{
                    fontSize: 16,
                    color: '#1890ff',
                }}
            />
        )
    }

    handleReadyState = (state: any) => {
        const game = this.props.location.state.data.game
        const player = this.state.player
        playerIO.emit('setState', { short_id: game.short_id, email: player.email, state })
    }

    public render() {
        return (
            <div className="lobby-container">
                <HeaderComponent />
                <Row className="lobby-row">
                    <Col>
                        <div className="lobby-site-card-border-less-wrapper">
                            <Card
                                className="lobby-ready-card"
                                title="Ready to play?"
                                bordered={true}
                                style={{ width: 350, height: 550, paddingTop: 0, paddingBottom: 0 }}
                                headStyle={{ ...styles.cardHeader }}
                            >
                                <div style={{ height: 400, overflow: 'auto' }}>
                                    {
                                        this.state.players.map((player: any, index: any) => {
                                            return (
                                                <div className="player-status-card" key={ index }>
                                                    <div>
                                                        <span className="player-name" style={{ marginRight: 10 }}>{player.name}</span>
                                                        {
                                                            player.isHost &&
                                                            <span className="player-status" style={{ color: Colors.PRIMARY }}>HOST</span>
                                                        }
                                                    </div>
                                                    <span className="player-status" 
                                                        style={{ color: player.state === "READY" ? Colors.LAWNGREEN : Colors.RED }}
                                                    >{player.state}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div className="login-submit-button-container">
                                    <Button
                                        type="primary"
                                        className="lobby-ready-buttom"
                                        onClick={ () => this.handleReadyState(this.state.player.state === 'READY' ? 'NOT-READY' : 'READY') }
                                    >{ this.state.player.state === 'READY' ? 'NOT-READY' : 'READY' }</Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <ChatComponent data={ this.props.location.state.data }/>
                    </Col>
                </Row>
            </div>
        );
    }
}

const styles = {
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