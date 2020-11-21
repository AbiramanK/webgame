import * as React from 'react';
import './index.css'

import {
    Card,
    Row,
    Col,
    Typography
} from 'antd';
import {
    AudioOutlined,
} from '@ant-design/icons';
import {
    RouteComponentProps,
    withRouter
} from 'react-router-dom';
import {
    Colors
} from './../../Colors';

import {
    HeaderComponent,
    ChatComponent
} from './../../components';

export interface ILobbyLeaderBoardProps extends RouteComponentProps {
}

export interface ILobbyLeaderBoardState {
    leaderBoard: Array<object>;
}

export class LobbyLeaderBoard extends React.Component<ILobbyLeaderBoardProps, ILobbyLeaderBoardState> {
    constructor(props: ILobbyLeaderBoardProps) {
        super(props);

        this.state = {
            leaderBoard: [
                {
                    name: "Bobby",
                    points: 12
                },
                {
                    name: "Alex",
                    points: 8
                },
                {
                    name: "Sam",
                    points: 7
                },
                {
                    name: "Sarah",
                    points: 7
                },
                {
                    name: "James",
                    points: 7
                },
                {
                    name: "Bill",
                    points: 3
                },
                {
                    name: "Kim",
                    points: 1
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
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 10
                    }}
                >
                <Typography
                        style={{ fontSize: 25 }}
                    >Round 3 Completed! Time Until Next Round: 23s</Typography>
                    <Typography
                        style={{ fontSize: 16 }}
                    >Rounds Remaining: 3</Typography>
                </div>
                <Row className="lobby-row">
                    <Col>
                        <div className="lobby-site-card-border-less-wrapper">
                            <Card
                                className="lobby-ready-card"
                                title="Leaderboard"
                                bordered={true}
                                style={{ width: 350, height: 550, paddingTop: 0, paddingBottom: 0 }}
                                headStyle={{ ...styles.cardHeader }}
                            >
                                <div style={{ height: 400, overflow: 'auto' }}>
                                    {this.state.leaderBoard.map((player: any, index: number) => {
                                        return (
                                            <div className="player-status-card">
                                                <span className="player-name">{player.name}</span>
                                                <span className="player-status" style={{ color: Colors.BLACK }}>{player.points}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <ChatComponent data={ undefined }/>
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

export default withRouter(LobbyLeaderBoard);