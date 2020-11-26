import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'

import styles from './Game.module.css';
import { Chat, Header, Matrix, Question, Answer, Voting } from '../../components';
import { gameIO, vars, chatIO } from '../../SocketIO'
import { clearInterval } from 'timers';

export interface MatchParams {
    short_id: string
}

export interface IGameProps extends RouteComponentProps<MatchParams> {}

export interface IGameState {
    counter: number | undefined,
    countdown: NodeJS.Timeout | undefined
    question: boolean,
    answer: boolean,
    from: {
        name: string | undefined,
        email: string | undefined,
        question: string | undefined
    },
    isFinalGuessTime: boolean,
    vote: boolean,
    caller: string
    timeout: boolean
}

export class Game extends React.Component<IGameProps, IGameState> {
    constructor(props: IGameProps) {
        super(props)

        this.state = {
            counter: 0,
            countdown: undefined,
            question: false,
            answer: false,
            from: {
                name: undefined,
                email: undefined,
                question: undefined
            },
            isFinalGuessTime: false,
            vote: false,
            caller: '',
            timeout: false
        }
    }

    componentDidMount = () => {
        if(!vars.init) {
            this.props.history.replace(`/game-rooms/${this.props.match.params.short_id}`)
            return 
        }
        
        if(this.state.countdown) clearInterval(this.state.countdown)
        this.setState({ 
            ...this.state,
            isFinalGuessTime: false,
            counter: vars.ROUND_TIMEOUT, 
            countdown: setInterval(() => {
                if(this.state.counter !== undefined) {
                    if(this.state.counter >= 0) {
                        this.setState({
                            ...this.state,
                            counter: this.state.counter ? this.state.counter - 1000 : 0
                        })
                    } else {
                        if(this.state.countdown) clearInterval(this.state.countdown)
                        this.setState({
                            ...this.state,
                            counter: 0,
                            countdown: undefined
                        })
                    }
                }
            }, 1000) 
        })

        gameIO.on('question', (data: any) => {
            console.log('Game_question', data)

            if(!data.error) {
                if(!this.state.timeout && !this.state.vote) this.setState({ 
                    ...this.state, 
                    question: true 
                })
            }
        })

        gameIO.on('askRes', (data: any) => {
            console.log('Game_askRes', data)

            if(!data.error) {
                vars.interaction_id = data.interaction._id
                vars.round.interactions.push(data.interaction)
                chatIO.emit('message', {
                    short_id: vars.game.short_id,
                    name: data.interaction.question.from.name,
                    email: data.interaction.question.from.email,
                    message: data.interaction.question.question
                })
            }
        })

        gameIO.on('askResAll', (data: any) => {
            console.log('Game_askResAll', data)

            if(!data.error) {
                vars.interaction_id = data.interaction._id
                vars.round.interactions.push(data.interaction)

                console.log(data.interaction.question.to.email, vars.player.email)
                
                if(data.interaction.question.to.email === vars.player.email) {
                    if(!this.state.timeout && !this.state.vote) this.setState({ 
                        ...this.state, 
                        answer: true, 
                        from: {
                            name: data.interaction.question.from.name,
                            email: data.interaction.question.from.email,
                            question: data.interaction.question.question
                        } 
                    })
                }
            }
        })

        gameIO.on('answerRes', (data: any) => {
            console.log('Game_answerRes', data)

            if(!data.error) {
                vars.interaction_id = data.interaction._id
                const interaction = vars.round
                    .interactions
                    .find(interaction => interaction._id === data.interaction._id)
                if(interaction !== undefined) interaction.answer = data.interaction.answer
                chatIO.emit('message', {
                    short_id: vars.game.short_id,
                    name: data.interaction.question.to.name,
                    email: data.interaction.question.to.email,
                    message: data.interaction.answer
                })
            }
        })

        gameIO.on('answerResAll', (data: any) => {
            console.log('Game_answerResAll', data)

            if(!data.error) {
                vars.interaction_id = data.interaction._id
                const interaction = vars.round
                    .interactions
                    .find(interaction => interaction._id === data.interaction._id)
                if(interaction !== undefined) interaction.answer = data.interaction.answer
            }
        })

        gameIO.on('skipRes', (data: any) => console.log('Game_skipRes', data))

        gameIO.on('callMeetingRes', (data: any) => {
            console.log('Game_callMeeting', data)

            if(!data.error) this.setState({ 
                ...this.state, 
                vote: true,
                caller: data.name
            })
        })

        gameIO.on('callMeetingResAll', (data: any) => {
            console.log('Game_callMeetingAll', data)

            if(!data.error) this.setState({ 
                ...this.state, 
                vote: true,
                caller: data.name
            })
        })
        
        gameIO.on('voteRes', (data: any) => {
            console.log('Game_voteRes', data)

            if(!data.error) {
                if(data.completed) gameIO.emit('leaderboard', {
                    short_id: vars.game.short_id,
                    round_id: vars.round._id
                })
            }
        })
        
        gameIO.on('voteResAll', (data: any) => {
            console.log('Game_voteResAll', data)

            if(!data.error) {
                if(data.completed) gameIO.emit('leaderboard', {
                    short_id: vars.game.short_id,
                    round_id: vars.round._id
                })
            }
        })

        gameIO.on('leaderboardRes', (data: any) => {
            console.log('Game_leaderboardRes', data)

            if(!data.error) {
                vars.game.players = data.players 
                this.props.history.replace({
                    pathname: `/game-rooms/${vars.game.short_id}/leaderboard`,
                    state: { roundsLeft: data.roundsLeft }
                })
            }
        })
    
        gameIO.on('timeout', (data: any) => {
            console.log('Game_timeout', data)

            if(!data.error) {
                this.setState({ ...this.state, timeout: true })

                gameIO.emit('leaderboard', {
                    short_id: vars.game.short_id,
                    round_id: vars.round._id
                })
            }
        })
    }

    componentWillUnmount = () => {
        gameIO.off('question')
        gameIO.off('askRes')
        gameIO.off('askResAll')
        gameIO.off('skipRes')
        gameIO.off('answerRes')
        gameIO.off('answerResAll')
        gameIO.off('callMeetingRes')
        gameIO.off('callMeetingResAll')
        gameIO.off('voteRes')
        gameIO.off('voteResAll')
        gameIO.off('leaderboardRes')
        gameIO.off('timeout')
        this.setState = () => {}
    }

    handleAsk = (data: any) => {
        gameIO.emit('ask', { 
            short_id: vars.game.short_id, 
            round_id: vars.round._id, 
            from: vars.player, 
            to: vars.game.players.find(player => player._id === data.player_id),
            question: data.question 
        })
        this.setState({ ...this.state, question: false })
    }

    handleAnswer = (data: any) => { 
        gameIO.emit('answer', {  
            short_id: vars.game.short_id, 
            round_id: vars.round._id, 
            interaction_id: vars.interaction_id,
            answer: data.answer 
        })
        this.setState({ ...this.state, answer: false })
    }

    handleCancel = () => {
        gameIO.emit('skip', { short_id: vars.game.short_id, round_id: vars.round._id, })
        this.setState({ 
            ...this.state, 
            question: false, 
            answer: false,
            from: {
                name: undefined,
                email: undefined,
                question: undefined
            },
            vote: false,
            caller: ''
        })
    }

    handleMeetingCall = () => gameIO.emit('callMeeting', {
        short_id: vars.game.short_id,
        round_id: vars.round._id,
        player_id: vars.player._id
    })

    public render() {
        return (
            <>
                <div>
                    <Header />
                    <div className={styles['container']}>
                        <div className={ styles['HUD'] }>
                            <div className={ styles['userInfo'] }>
                                <h1>
                                    {
                                        vars.player.isImposter
                                        ? 'You are the Imposter!'
                                        : `The game location is: ${
                                            vars.location.name 
                                            ? vars.location.name
                                            : '' 
                                        }`
                                    }
                                </h1>
                                <p>
                                    {
                                        vars.player.isImposter
                                        ? 'Try your best to blend in with the others and guess the location.' 
                                        : 'Ask strategic questions and pay close attention to what others say to catch the imposter'
                                    }
                                </p>
                            </div>
                            <div>
                                <button 
                                    className={ styles['userActionBtn'] }
                                    onClick={ this.handleMeetingCall }
                                >
                                    Call a meeting!
                                </button>
                                {
                                    vars.player.isImposter &&
                                    <button 
                                        className={ styles['userActionBtn'] }
                                        onClick={ () => this.setState({ ...this.state, isFinalGuessTime: true }) }
                                    >
                                        Guess the location!
                                    </button>
                                }
                            </div>
                        </div>
                        <div className={ styles['timer'] }>
                            <div className={ styles['timeDisplay'] }>
                                <h1>
                                    { 
                                        this.state.counter
                                        ? Math.trunc(this.state.counter / 60000).toString().padStart(2, '0')
                                        : '00'
                                    }
                                </h1>
                                <p>Minutes</p>
                            </div>
                            <div className={ styles['timeDisplay'] }>
                                <h1>
                                    { 
                                        this.state.counter
                                        ? Math.trunc(this.state.counter / 1000 % 60).toString().padStart(2, '0')
                                        : '00'
                                    }
                                </h1>
                                <p>Seconds</p>
                            </div>
                        </div>
                        <div className={ styles['gameMatrix'] }>
                            <Matrix isFinalGuessTime={ this.state.isFinalGuessTime }/>
                        </div>
                        <div className={ styles['chat'] }>
                            <Chat join={ false } showInput={ false } chats={ [] }/>
                        </div>
                    </div>
                </div>
                {
                    this.state.question &&
                    <Question 
                        show={ this.state.question } 
                        handleAsk={ this.handleAsk } 
                        handleCancel={ this.handleCancel }
                    />
                }
                {
                    this.state.answer &&
                    <Answer 
                        show={ this.state.answer } 
                        from={ this.state.from }
                        handleAnswer={ this.handleAnswer } 
                        handleCancel={ this.handleCancel }
                    />
                }
                {
                    this.state.vote &&
                    <Voting caller={ this.state.caller } handleCancel={ this.handleCancel }/>
                }
            </>
        )
    }
}

export default withRouter(Game)
