import * as React from 'react';
import './index.css'

import {
    Card,
    Input,
    Button,
    Row,
    Col,
    Typography
} from 'antd';
import { 
    AudioOutlined,
    ArrowRightOutlined 
} from '@ant-design/icons';
import {
    Colors
} from './../../Colors';

import {
    HeaderComponent
} from './../../components';
import Item from 'antd/lib/list/Item';

export interface ILobbyProps {
}

export interface ILobbyState {
    playerStatus: Array<object>;
    chat: Array<object>;
}

export class Lobby extends React.Component<ILobbyProps, ILobbyState> {
    constructor(props: ILobbyProps) {
        super(props);

        this.state = {
            playerStatus: [
                {
                    name: "Bobby",
                    status: "Host"
                },
                {
                    name: "Alex",
                    status: "Not Ready"
                },
                {
                    name: "Sam",
                    status: "Not Ready"
                },
                {
                    name: "Sarah",
                    status: "Ready"
                },
                {
                    name: "James",
                    status: "Ready"
                },
                {
                    name: "Bill",
                    status: "Not Ready"
                },
                {
                    name: "Kim",
                    status: "Ready"
                }
            ],
            chat: [
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
                                style={{ width: 350, paddingTop: 0, paddingBottom: 0 }}
                                headStyle={{ ...styles.cardHeader }}
                            >
                                <div style={{ height: 400, overflow: 'auto' }}>
                                {this.state.playerStatus.map((player: any, index: number) => {
                                    return (
                                        <div className="player-status-card">
                                            <span className="player-name">{player.name}</span>
                                            <span className="player-status" style={{ color: player.status == "Host" ? Colors.PRIMARY : player.status == "Ready" ? Colors.LAWNGREEN : Colors.RED }}>{player.status}</span>
                                        </div>
                                    )
                                })}
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
                        <div className="lobby-site-card-border-less-wrapper">
                            <Card
                                className="chat-card"
                                title="Chat"
                                bordered={true}
                                style={{ width: 350, paddingTop: 0, paddingBottom: 0 }}
                                headStyle={{ ...styles.cardHeader, fontSize: 21, padding: 0 }}
                            >
                                <div style={{ height: 400, overflow: 'auto' }}>
                                    {this.state.chat.map((chat: any, index: number) => {
                                        return (
                                            <div className="lobby-chat-message-card-container" style={{ alignItems: chat.type == "RECEIVE" ? "flex-start" : "flex-end" }}>
                                                <Typography className="lobby-player-name-text">{chat.name}</Typography>
                                                <Card id="lobby-chat-message-card" className="lobby-chat-message-card" style={{ width: 250, borderRadius: 10, backgroundColor: chat.type == "RECEIVE" ? "#D3D3D3" : Colors.PRIMARY }}>
                                                    <Typography
                                                        style={{ color: chat.type == "RECEIVE" ? Colors.BLOCK : Colors.WHITE }}
                                                    >{chat.message}</Typography>
                                                </Card>
                                            </div>
                                        )
                                    })}
                                </div>
                                <Input 
                                    className="chact-text-input-box"
                                    placeholder="Write a reply..."
                                    size="large"
                                    suffix={<ArrowRightOutlined
                                        style={{
                                            fontSize: 16,
                                            color: '#1890ff',
                                        }}
                                    />}
                                />
                            </Card>
                        </div>
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

export default Lobby;