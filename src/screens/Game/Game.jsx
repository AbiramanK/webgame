import React from 'react';
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd'

import styles from './Game.module.css';
import { Chat, Header, Matrix, Question, Answer, Voting } from '../../components';
import { gameIO, vars, chatIO } from '../../SocketIO'
import { clearInterval } from 'timers'

export class Game extends React.Component {
    constructor(props) {
        super(props)  
        
        const vote = vars.round.meeting 
            && !vars.round.meeting.voted
            && vars.round.meeting.for !== -1
            ? true 
            : false

        this.state = {
            showModalQuestion: false,
            showModalAnswer: false,
            showModalVoting: false,
            showModal: true,
            from: {
                name: undefined,
                email: undefined,
                question: undefined
            },
            meetingCalled: false,
            meetingCaller: vote ? vars.round.meeting.by : '',
            timeout: false,
            isFinalGuessTime: false,
            counter: new Date(vars.round.endingAt).valueOf() - Date.now().valueOf(), 
            countdown: undefined,
            counts: [],
            questionAskedTimeout: undefined,
            questionAnsweredTimeout: undefined,
            meetingTimeout: undefined,
            askTimeout: undefined,
            answerTimeout: undefined,
            votingCompleted: false
        }
    }

    componentDidMount = () => {        
        if(!vars.init) {
            this.props.history.replace(`/game-rooms/${this.props.match.params.short_id}`)
            return 
        } 

        document.getElementById('popup-audio').play()

        setTimeout(() => {
            this.setState({
                ...this.state,
                countdown: setInterval(() => {
                    if(this.state.counter > 0) {
                        this.setState({ 
                            ...this.state, 
                            counter: this.state.counter - 1000 
                        })
                    } else {
                        if(this.countdown) clearInterval(this.state.countdown)
                        this.setState({
                            ...this.state,
                            counter: 0,
                            countdown: undefined
                        })
                    }
                }, 1000)
            })
        }, 50)

        if(vars.round.interactionCurrentBy) {
            if(vars.round.interactionCurrentBy.player_id) this.setState({ 
                ...this.state, 
                showModalQuestion: true,
                showModal: false,
            })
        }

        if(vars.interactions && vars.interactions.length > 0) {
            if(vars.interactions[0]._id) {
                const last = vars.interactions[vars.interactions.length - 1]
                if(!last.answer) {
                    if(last.question.to.email === vars.player.email) {
                        this.setState({ 
                            ...this.state, 
                            showModalAnswer: true, 
                            from: {
                                name: last.question.from.name,
                                email: last.question.from.email,
                                question: last.question.question
                            },
                            showModal: false,
                        })
                    }
                }
            }
        }

        gameIO.on('question', data => {
            console.log('Game_gameIO_question', data)

            if(!data.error) {
                if(
                    !this.state.timeout 
                    && !this.state.meetingCalled
                    && !this.state.showModalQuestion
                    && !this.state.showModalAnswer
                ) {
                    this.setState({ 
                        ...this.state, 
                        showModalQuestion: true,
                        showModal: false,
                        askTimeout: data.askTimeout
                    })
                }
            }
        })

        gameIO.on('askRes', data => {
            console.log('Game_gameIO_askRes', data)

            if(!data.error) {
                vars.interaction_id = data.interaction._id
                vars.round.interactions.push(data.interaction)
                chatIO.emit('message', {
                    short_id: vars.game.short_id,
                    name: data.interaction.question.from.name,
                    email: data.interaction.question.from.email,
                    message: data.interaction.question.question,
                    to: data.interaction.question.to.name
                })

                /**
                clearTimeout(this.state.questionAskedTimeout)
                this.setState({ 
                    ...this.state, 
                    questionAskedTimeout: undefined,
                    questionAnsweredTimeout: setTimeout(() => {
                        gameIO.on('enquireAnswer', {
                            short_id: vars.game.short_id,
                            answerCounter: data.answerCounter
                        })
                        this.setState({
                            ...this.state,
                            questionAnsweredTimeout: undefined
                        })
                    }, data.answerTimeout - Date.now().valueOf())
                })
                */
            }
        })

        gameIO.on('askResAll', data => {
            console.log('Game_gameIO_askResAll', data)

            if(!data.error) {
                vars.interaction_id = data.interaction._id
                vars.round.interactions.push(data.interaction)
                
                if(data.interaction.question.to.email === vars.player.email) {
                    if(
                        !this.state.timeout 
                        && !this.state.meetingCalled
                        && !this.state.showModalQuestion
                        && !this.state.showModalAnswer
                    ) { 
                        this.setState({ 
                            ...this.state, 
                            showModalAnswer: true, 
                            from: {
                                name: data.interaction.question.from.name,
                                email: data.interaction.question.from.email,
                                question: data.interaction.question.question
                            },
                            showModal: false,
                            answerTimeout: data.answerTimeout
                        })
                    }
                }

                /** 
                clearTimeout(this.state.questionAskedTimeout)
                this.setState({ 
                    ...this.state, 
                    questionAskedTimeout: undefined,
                    questionAnsweredTimeout: setTimeout(() => {
                        gameIO.on('enquireAnswer', {
                            short_id: vars.game.short_id,
                            answerCounter: data.answerCounter
                        })
                        this.setState({
                            ...this.state,
                            questionAnsweredTimeout: undefined
                        })
                    }, data.answerTimeout - Date.now().valueOf())
                })
                */
            }
        })

        gameIO.on('answerRes', data => {
            console.log('Game_gameIO_answerRes', data)

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

                /** 
                clearTimeout(this.state.questionAnsweredTimeout)
                this.setState({ 
                    ...this.state, 
                    questionAnsweredTimeout: undefined
                })
                */
            }
        })

        gameIO.on('answerResAll', data => {
            console.log('Game_gameIO_answerResAll', data)

            if(!data.error) {
                vars.interaction_id = data.interaction._id
                const interaction = vars.round
                    .interactions
                    .find(interaction => interaction._id === data.interaction._id)
                if(interaction !== undefined) interaction.answer = data.interaction.answer

                /** 
                clearTimeout(this.state.questionAnsweredTimeout)
                this.setState({ 
                    ...this.state, 
                    questionAnsweredTimeout: undefined
                })
                */
            }
        })

        gameIO.on('skipRes', data => {
            console.log('Game_gameIO_skipRes', data)
            
            if(!data.error) {
                /**
                clearTimeout(this.state.questionAskedTimeout)
                clearTimeout(this.state.questionAnsweredTimeout)
                this.setState({ 
                    ...this.state, 
                    questionAskedTimeout: undefined,
                    questionAnsweredTimeout: undefined
                })
                */
            }
        })

        gameIO.on('callMeetingRes', data => {
            console.log('Game_gameIO_callMeeting', data)

            if(!data.error) this.setState({ 
                ...this.state, 
                showModalQuestion: false,
                showModalAnswer: false,
                showModalVoting: true,
                showModal: false,
                meetingCalled: true,
                meetingCaller: data.name,
                meetingTimeout: undefined
                /**
                setTimeout(() => {
                    gameIO.emit('enquireMeeting', {
                        short_id: vars.game.short_id,
                        meetingCounter: data.meetingCounter
                    })
                    this.setState({
                        ...this.state,
                        showModalVoting: false,
                        meetingCalled: false
                    })
                }, data.MEETING_TIMEOUT),
                */
            })
        })

        gameIO.on('callMeetingResAll', data => {
            console.log('Game_gameIO_callMeetingAll', data)

            if(!data.error) this.setState({ 
                ...this.state, 
                showModalQuestion: false,
                showModalAnswer: false,
                showModalVoting: true,
                showModal: false,
                meetingCalled: true,
                meetingCaller: data.name,
                meetingTimeout: undefined
                /**
                setTimeout(() => {
                    gameIO.emit('enquireMeeting', {
                        short_id: vars.game.short_id,
                        meetingCounter: data.meetingCounter
                    })
                    this.setState({
                        ...this.state,
                        showModalVoting: false,
                        meetingCalled: false
                    })
                }, data.MEETING_TIMEOUT),
                */
            })
        })
        
        gameIO.on('voteRes', data => {
            console.log('Game_gameIO_voteRes', data)

            if(!data.error) {
                //clearTimeout(this.state.meetingTimeout)
                this.setState({ 
                    ...this.state, 
                    counts: data.counts,
                    meetingTimeout: undefined
                })

                if(data.completed) {
                    this.setState({ ...this.state, votingCompleted: true })
                    gameIO.emit('leaderboard', {
                        short_id: vars.game.short_id,
                        round_id: vars.round._id
                    })
                }
            }
        })
        
        gameIO.on('voteResAll', data => {
            console.log('Game_gameIO_voteResAll', data)

            if(!data.error) {
                //clearTimeout(this.state.meetingTimeout)
                this.setState({ 
                    ...this.state, 
                    counts: data.counts,
                    meetingTimeout: undefined
                })

                if(data.completed) {
                    this.setState({ ...this.state, votingCompleted: true })
                    gameIO.emit('leaderboard', {
                        short_id: vars.game.short_id,
                        round_id: vars.round._id
                    })
                }
            }
        })

        gameIO.on('leaderboardRes', data => {
            console.log('Game_gameIO_leaderboardRes', data)

            if(!data.error) {
                vars.game.players = data.players 
                vars.round.endedAt = data.endedAt
                vars.round.imposterWon = data.imposterWon
                this.props.history.replace({
                    pathname: `/game-rooms/${vars.game.short_id}/leaderboard`,
                    state: { roundsLeft: data.roundsLeft }
                })
                document.body.style.overflow = 'auto'
            }
        })
    
        gameIO.on('timeout', data => {
            console.log('Game_gameIO_timeout', data)

            if(!data.error) {
                this.setState({ ...this.state, timeout: true })

                gameIO.emit('leaderboard', {
                    short_id: vars.game.short_id,
                    round_id: vars.round._id
                })
            }
        })

        /** 
        gameIO.on('questionAll', data => {
            console.log('Game_gameIO_questionAll', data)

            if(!data.error) {
                this.setState({ 
                    ...this.state, 
                    questionAskedTimeout: setTimeout(() => {
                        this.setState({
                            ...this.state,
                            showModalQuestion: false,
                            questionAskedTimeout: undefined
                        })
                        gameIO.emit('enquireQuestion', { 
                            short_id: vars.game.short_id,
                            questionCounter: data.questionCounter 
                        })
                    }, data.askTimeout - Date.now().valueOf())
                })
            }
        })
        */
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

    handleAsk = data => {
        if(data.question) {
            gameIO.emit('ask', { 
                short_id: vars.game.short_id, 
                round_id: vars.round._id, 
                from: vars.player, 
                to: vars.game.players.find(player => player._id === data.player_id),
                question: data.question 
            })
            this.setState({ ...this.state, showModalQuestion: false })
        } else {
            this.handleCancel()
        }
    }

    handleAnswer = data => { 
        if(data.answer) {
            gameIO.emit('answer', {  
                short_id: vars.game.short_id, 
                round_id: vars.round._id, 
                interaction_id: vars.interaction_id,
                answer: data.answer 
            })
            this.setState({ ...this.state, showModalAnswer: false })
        } else {
            this.handleCancel()
        }
    }

    handleCancel = () => {
        gameIO.emit('skip', { 
            short_id: vars.game.short_id, 
            round_id: vars.round._id 
        })
        this.setState({ 
            ...this.state, 
            showModalQuestion: false, 
            showModalAnswer: false,
            showModalVoting: false,
            showModal: false
        })
    }

    handleMeetingCall = () => {
        gameIO.emit('callMeeting', {
            short_id: vars.game.short_id,
            round_id: vars.round._id,
            player_id: vars.player._id
        })
    }

    parseChats = () => {
        const interactions = vars.round.interactions ? vars.round.interactions : []
        let chats = []        
        interactions.forEach(interaction => {
            chats.push({
                name: interaction.question.from.name,
                email: interaction.question.from.email,
                message: interaction.question.question,
                to: interaction.question.to.name
            })

            if(interaction.answer) {
                chats.push({
                    name: interaction.question.to.name,
                    email: interaction.question.to.email,
                    message: interaction.answer
                })
            }
        })

        return chats
    } 

    render() {
        return (
            <>
                
                {
                    this.returnModal()
                }
                <div>
                    <Header />
                    <div className={styles['container']}>
                        {
                            this.returnHUD()
                        }
                        {
                            this.returnTimer()
                        }
                        <div className={ styles['gameMatrix'] }>
                            <Matrix isFinalGuessTime={ this.state.isFinalGuessTime }/>
                        </div>
                        <div className={ styles['chat'] }>
                            <Chat showInput={ false } chats={ this.parseChats() }/>
                        </div>
                    </div>
                </div>
                {
                    this.state.showModalQuestion &&
                    this.returnQuestion()
                }
                {
                    this.state.showModalAnswer &&
                    this.returnAnswer()
                }
                {
                    this.state.showModalVoting &&
                    this.returnVoting()
                }
            </>
        )
    }

    returnHUD = () => {
        return (
            <div className={ styles['HUD'] }>
                {
                    this.returnHUDInfo()
                }
                {
                    this.returnHUDButton()
                }
            </div>
        )
    }

    returnHUDInfo = () => {
        return (
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
        )
    }

    returnHUDButton = () => {
        return (
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
        )
    }

    returnTimer = () => {
        return (
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
        )
    }

    returnModal = () => {
        return (
            <Modal 
                title={ vars.round.name } 
                visible={ this.state.showModal }
                onCancel={ () => this.setState({ ...this.state, showModal: false }) }
                footer={ null }
            >
                <h3 className={ styles['modal'] }>
                    { 
                        vars.player.isImposter
                        ? 'You are the imposter'
                        : 'You are not the imposter' 
                    }
                </h3>
            </Modal>
        )
    }

    returnQuestion = () => {
        return (
            <Question 
                handleAsk={ this.handleAsk } 
                handleCancel={ this.handleCancel }
                askTimeout={ this.state.askTimeout }
            />
        )
    }

    returnAnswer = () => {
        return (
            <Answer 
                from={ this.state.from }
                handleAnswer={ this.handleAnswer } 
                handleCancel={ this.handleCancel }
                answerTimeout={ this.state.answerTimeout }
            />
        )
    }

    returnVoting = () => {
        return (
            <Voting 
                caller={ this.state.meetingCaller } 
                counts={ this.state.counts }
                votingCompleted={ this.state.votingCompleted }
                handleCancel={ () => this.setState({ ...this.state, showModalVoting: false }) }
            />
        )
    }
}

export default withRouter(Game)
