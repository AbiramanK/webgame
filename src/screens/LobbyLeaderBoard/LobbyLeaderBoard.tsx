import * as React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { RouteComponentProps, withRouter} from 'react-router-dom';

import { Colors} from '../../Colors';
import { Header, Chat } from '../../components';
import moduleStyles from './LobbyLeaderBoard.module.css'

export interface ILobbyLeaderBoardProps extends RouteComponentProps {}

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

    suffix = () => (<AudioOutlined style={{ fontSize: 16, color: '#1890ff' }}/>)

    public render() {
        return (
            <div className={ moduleStyles['lobby-container'] }>
                <Header/>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 10
                    }}
                >
                <Typography style={{ fontSize: 25 }}>Round 3 Completed! Time Until Next Round: 23s</Typography>
                    <Typography style={{ fontSize: 16 }}>Rounds Remaining: 3</Typography>
                </div>
                <Row className={ moduleStyles['lobby-row'] }>
                    <Col>
                        <div className={ moduleStyles['lobby-site-card-border-less-wrapper'] }>
                            <Card
                                className={ moduleStyles['lobby-ready-card'] }
                                title="Leaderboard"
                                bordered={true}
                                style={{ width: 350, height: 550, paddingTop: 0, paddingBottom: 0 }}
                                headStyle={{ ...styles.cardHeader }}
                            >
                                <div style={{ height: 400, overflow: 'auto' }}>
                                    {this.state.leaderBoard.map((player: any, index: number) => {
                                        return (
                                            <div className={ moduleStyles['player-status-card'] }>
                                                <span className={ moduleStyles['player-name'] }>{ player.name }</span>
                                                <span 
                                                    className={ moduleStyles['player-status'] } 
                                                    style={{ color: Colors.BLACK }}
                                                >
                                                    { player.points }
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <Chat join={ false } showInput={ true } chats={ [] }/>
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