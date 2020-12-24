import React from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { withRouter} from 'react-router-dom';

import { Colors} from '../../Colors';
import { Header, Chat } from '../../components';
import moduleStyles from './Leaderboard.module.css'
import { playerIO, gameIO, chatIO, vars } from '../../SocketIO';

export class Leaderboard extends React.Component {
    constructor(props) {
        super(props)

        const now = Date.now().valueOf()
        const endedAt = new Date(vars.round.endedAt).valueOf()
        const diff = now - endedAt
        console.log('diff', diff / 1000)
        const counter = Math.max(30 - Math.trunc(diff / 1000), 1)

        this.state = {
            roundsRemaining: this.props.location.state.roundsLeft,
            leaderBoard: vars.game.players.map(player => ({ 
                name: player.name, 
                points: player.score 
            })),
            counter,
            restartClicked: false
        }
    }

    componentDidMount = () => {
        if(!vars.init) {
            this.props.history.replace(`/game-rooms/${this.props.match.params.shortId}`)
            return 
        }

        gameIO.on('newRoundRes', data => {
            console.log('Leaderboard_gameIO_newRoundRes', data)

            if(!data.error) gameIO.emit('roundInfo', { 
                shortId: vars.game.shortId, 
                playerId: vars.player._id 
            })
        })

        gameIO.on('newRoundResAll', data => {
            console.log('Leaderboard_gameIO_newRoundResAll', data)

            if(!data.error) gameIO.emit('roundInfo', { 
                shortId: vars.game.shortId, 
                playerId: vars.player._id 
            })
        })

        gameIO.on('roundInfoRes', data => {
            console.log('Leaderboard_gameIO_infoRes', data)

            this.setState({ ...this.state, startGameClicked: false })
            if(!data.error) {
                vars.player.isImposter = data.isImposter

                if(data.isImposter) {
                    vars.tempGuesses = data.round.imposter.tempGuesses
                    delete data.round.imposter
                    delete data.round.tiles.current
                }

                vars.interactions = data.round.interactions
                delete data.round.interactions 

                vars.round = data.round

                this.props.history.replace(`/game-rooms/${vars.game.shortId}/game`)
            }
        })

        gameIO.on('restartRes', data => {
            console.log("Leaderboard_gameIO_restartRes", data)

            if(!data.error) {
                gameIO.emit('leave', { prevShortId: vars.game.shortId })
                chatIO.emit('leave', { prevShortId: vars.game.shortId })
                playerIO.emit('leave', { prevShortId: vars.game.shortId })

                const playerId = vars.player._id
                vars.initialize()
                vars.game = data.game 
                vars.player = data.game.players.find(p => p._id === playerId)

                playerIO.emit('joinSocket', { shortId: vars.game.shortId })
                chatIO.emit('join', { shortId: vars.game.shortId })
                gameIO.emit('start', { 
                    shortId: vars.game.shortId,
                    playerId: vars.player._id
                })
                this.props.history.push(`/game-rooms/${vars.game.shortId}/lobby`)
            } else this.setState({ ...this.state, restartClicked: false })
        })

        gameIO.on('restartResAll', data => {
            console.log("Leaderboard_gameIO_restartResAll", data)

            if(!data.error) {
                gameIO.emit('leave', { prevShortId: vars.game.shortId })
                chatIO.emit('leave', { prevShortId: vars.game.shortId })
                playerIO.emit('leave', { prevShortId: vars.game.shortId })

                const playerId = vars.player._id
                vars.initialize()
                vars.game = data.game 
                vars.player = data.game.players.find(p => p._id === playerId)

                playerIO.emit('joinSocket', { shortId: vars.game.shortId })
                chatIO.emit('join', { shortId: vars.game.shortId })
                gameIO.emit('start', { 
                    shortId: vars.game.shortId,
                    playerId: vars.player._id
                })
                this.props.history.push(`/game-rooms/${vars.game.shortId}/lobby`)
            } else this.setState({ ...this.state, restartClicked: false })
        })

        document.body.style.overflow = 'auto'
        
        this.prepareNextRound()
    }

    componentWillUnmount = () => {
        gameIO.off('newRoundRes')
        gameIO.off('newRoundResAll')
        gameIO.off('roundInfoRes')
        gameIO.off('restartRes')
        gameIO.off('restartResAll')
        this.setState = () => {}
    }

    suffix = () => (<AudioOutlined style={{ fontSize: 16, color: '#1890ff' }}/>)

    prepareNextRound = () => {        
        const timeout = setInterval(() => {
            const counter = this.state.counter - 1
            this.setState({ ...this.state, counter })
            if(counter === 1 && vars.player.isHost && this.state.roundsRemaining > 0) {
                gameIO.emit('newRound', { shortId: vars.game.shortId })
            }
            if(counter === 0) clearInterval(timeout)
        }, 1000)
    }

    handleRestart = () => {
        if(!this.state.restartClicked) {
            this.setState({ ...this.state, restartClicked: true })
            gameIO.emit('restart', { shortId: vars.game.shortId })
        }
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
                        {
                            this.state.roundsRemaining === 0 &&
                            vars.player.isHost &&
                            this.returnButton()
                        }
                    </Typography>
                    {
                        this.state.roundsRemaining > 0 &&
                        <Typography style={{ fontSize: 16 }}>
                            { `Rounds Remaining: ${ this.state.roundsRemaining }` }
                        </Typography>
                    }
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

    returnButton = () => {
        const buttonStyle = {
          backgroundColor: Colors.PRIMARY,
          color: Colors.WHITE,
          padding: "0 30px",
          borderRadius: "5px",
          marginLeft: '50px'
        }
        return (
            <Button
              size="large"
              style={ buttonStyle }
              onClick={ this.handleRestart }
              loading={ this.state.restartClicked }
            >
              Restart
            </Button>
        )
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