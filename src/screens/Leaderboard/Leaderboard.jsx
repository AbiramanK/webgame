import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { withRouter} from 'react-router-dom';

import { Colors} from '../../Colors';
import { Header, Chat } from '../../components';
import moduleStyles from './Leaderboard.module.css'
import { gameIO, vars } from '../../SocketIO';

export class Leaderboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            roundsRemaining: this.props.location.state.roundsLeft,
            leaderBoard: vars.game.players.map(player => {
                return { 
                    name: player.name, 
                    points: player.score 
                }
            }),
            counter: 30,
        }
    }

    componentDidMount = () => {
        if(!vars.init) {
            this.props.history.replace(`/game-rooms/${this.props.match.params.short_id}`)
            return 
        }

        gameIO.on('newRoundRes', data => {
            console.log('Leaderboard_gameIO_newRoundRes', data)

            if(!data.error) gameIO.emit('info', { 
                short_id: vars.game.short_id, 
                player_id: vars.player._id
            })
        })

        gameIO.on('newRoundResAll', data => {
            console.log('Leaderboard_gameIO_newRoundResAll', data)

            if(!data.error) gameIO.emit('info', { 
                short_id: vars.game.short_id, 
                player_id: vars.player._id
            })
        })

        gameIO.on('infoRes', data => {
            console.log('Leaderboard_gameIO_infoRes', data)

            this.setState({ ...this.state, startGameClicked: false })
            if(!data.error) {
                vars.player.isImposter = data.isImposter

                if(data.isImposter) {
                    vars.tempGuesses = data.round.imposter.tempGuesses
                    delete data.round.imposter
                } else {
                    vars.location = data.round.location
                    delete data.round.location
                }
                vars.round = data.round
                vars.interactions = data.round.interactions

                this.props.history.replace(`/game-rooms/${vars.game.short_id}/game`)
            }
        })

        this.prepareNextRound()
    }

    componentWillUnmount = () => {
        gameIO.off('newRoundRes')
        gameIO.off('newRoundResAll')
        gameIO.off('infoRes')
        this.setState = () => {}
    }

    suffix = () => (<AudioOutlined style={{ fontSize: 16, color: '#1890ff' }}/>)

    prepareNextRound = () => {
        const now = Date.now().valueOf()
        const endedAt = new Date(vars.round.endedAt).valueOf()
        const diff = now - endedAt
        let counter = Math.max(40 - Math.trunc(diff / 1000), 1)
        this.setState({ ...this.state, counter })
        
        const timeout = setInterval(() => {
            counter -= 1
            this.setState({ ...this.state, counter })
            if(counter === 1 && vars.player.isHost && this.state.roundsRemaining > 0) {
                gameIO.emit('newRound', { short_id: vars.game.short_id })
            }
            if(counter === 0) clearInterval(timeout)
        }, 1000)
    }

    render() {
        return (
            <div className={ moduleStyles['lobby-container'] }>
                <Header/>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 10,
                        textAlign: 'center'
                    }}
                >
                    <Typography style={{ fontSize: 25 }}>
                        { vars.round.name } Completed! 
                        {
                            this.state.roundsRemaining > 0 
                            ? ` Time Until Next Round: ${ this.state.counter.toString().padStart(2, '0') }s`
                            : ' Game Over'
                        }
                    </Typography>
                    <Typography style={{ fontSize: 16 }}>
                        {
                            this.state.roundsRemaining > 0 &&
                            `Rounds Remaining: ${ this.state.roundsRemaining }`
                        }
                    </Typography>
                </div>
                <h2 style={{ textAlign: 'center', color: Colors.PRIMARY }}>
                    {
                        vars.round.imposterWon === undefined
                        ? 'Timeout'
                        : vars.round.imposterWon
                            ? vars.player.isImposter
                                ? 'You Won!'  
                                : 'Imposter Won!'
                            : vars.player.isImposter
                                ? 'You lost the round'
                                : 'Imposter lost the round'
                    }
                </h2>
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
                                    {
                                        this.state.leaderBoard.map((player, index) => {
                                            return (
                                                <div 
                                                    className={ moduleStyles['player-status-card'] }
                                                    key={ index }
                                                >
                                                    <span className={ moduleStyles['player-name'] }>{ player.name }</span>
                                                    <span 
                                                        className={ moduleStyles['player-status'] } 
                                                        style={{ color: Colors.BLACK }}
                                                    >
                                                        { player.points }
                                                    </span>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </Card>
                        </div>
                    </Col>
                    <Col>
                        <Chat join={ false } showInput={ true } chats={ vars.round.leaderboardChats }/>
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

export default withRouter(Leaderboard);