import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { AudioOutlined } from '@ant-design/icons';
import { RouteComponentProps, withRouter} from 'react-router-dom';

import { Colors} from '../../Colors';
import { Header, Chat } from '../../components';
import moduleStyles from './Leaderboard.module.css'
import { gameIO, vars } from '../../SocketIO';

export interface IScore {
    name: string | undefined 
    points: number | undefined
}

export interface LocationState {
    roundsLeft: number
}

export interface ILeaderboardProps extends RouteComponentProps<{}, {}, LocationState> {}

export interface ILeaderboardState {
    roundsRemaining: number
    leaderBoard: IScore[]
    counter: number
}

export class Leaderboard extends React.Component<ILeaderboardProps, ILeaderboardState> {
    constructor(props: ILeaderboardProps) {
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

        console.log(this.props.location.state.roundsLeft, this.state)

        this.prepareNextRound()
    }

    componentWillUnmount = () => {
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

    suffix = () => (<AudioOutlined style={{ fontSize: 16, color: '#1890ff' }}/>)

    prepareNextRound = () => {
        let counter = 30
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
                                        this.state.leaderBoard.map((player: any, index: number) => {
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

export default withRouter(Leaderboard);