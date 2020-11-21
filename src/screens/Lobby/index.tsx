import * as React from 'react';
import './index.css'
import {
    Card,
    Button,
    Row,
    Col,
} from 'antd';
import {
    AudioOutlined,
} from '@ant-design/icons';
import {
    RouteComponentProps,
    withRouter,
} from 'react-router-dom';
import {
    Colors
} from './../../Colors';
import {
    HeaderComponent,
    ChatComponent
} from './../../components';

interface LocationState {
    playerIO: any,
    chatIO: any,
    gameIO: any,
    data: any
}
 
export interface ILobbyProps extends RouteComponentProps<{}, {}, LocationState> {
   
}

export interface ILobbyState {
    players: Array<object>;
    chats: Array<object>;
} 

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {
    constructor(props: ILobbyProps) {
        super(props);

        this.state = {
            players: [],
            chats: [
                {
                    name: "Alex",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "RECEIVE"
                },
                {
                    name: "Alex",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "RECEIVE"
                },
                {
                    name: "James",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "SENT"
                },
                {
                    name: "Alex",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "RECEIVE"
                }
            ]
        }
    }

    componentDidMount = () => {

        console.log(this.props.location)
        
        //let state = this.props.location.state;
        
        /*
        socket.on('joinResAll', (data: any) => {
            console.log("response join all", data)
            this.setState({
                players: data.players
            })
        })
        */
        // socket.emit("setState", {
        //     short_id: shortId
        // });

        // socket.on("setStateRes", (data: any) => {
        //     console.log("data", data)

        // });
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
                                                    <span className="player-name">{player.name}</span>
                                                    <span className="player-status" 
                                                        style={{ color: player.isHost ? Colors.PRIMARY : player.state === "READY" ? Colors.LAWNGREEN : Colors.RED }}
                                                    >{player.isHost ? 'HOST': player.state}</span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div
                                    className="login-submit-button-container"
                                >
                                    <Button
                                        type="primary"
                                        className="lobby-ready-buttom"
                                    // onClick={this.login}
                                    >Ready</Button>
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <ChatComponent/>
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