import React from 'react';
import { withRouter } from 'react-router-dom'
import { Modal } from 'antd' 

import styles from './Game.module.css';
import { Chat, Header, Matrix, Question, Answer, Voting } from '../../components';
import { gameIO, vars, chatIO } from '../../SocketIO'

export class Game extends React.Component {
    constructor(props) {
        super(props)  

        const location = vars.player.isImposter
            ? undefined 
            : vars.round
                .tiles
                .locations
                .find(l => l._id === vars.round.tiles.current)

        
        const voted = vars.round.meeting 
            && !vars.round.meeting.candidates.find(c => c === vars.player._id)
            ? true 
            : false

        this.state = {
            showModalQuestion: false,
            showModalAnswer: false,
            showModalVoting: vars.round.meeting && !voted,
            showModal: true,
            location,
            from: {
                name: undefined,
                question: undefined
            },
            meetingCaller: vars.round.meeting && !voted ? vars.game.players.find(p => p._id === vars.round.meeting.by).name : '',
            timeout: false,
            isFinalGuessTime: false,
            counter: new Date(vars.round.endingAt).valueOf() - Date.now().valueOf(), 
            countdown: undefined,
            votingCompleted: false,
        }
    }

    componentDidMount = () => {        
        if(!vars.init) {
            this.props.history.replace(`/game-rooms/${this.props.match.params.shortId}`)
            return 
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
                    && !this.state.showModalVoting
                    && !this.state.showModalQuestion
                    && !this.state.showModalAnswer
                ) {
                    this.setState({ 
                        ...this.state, 
                        showModalQuestion: true,
                        showModal: false,
                    })
                }
            }
        })

        gameIO.on('askRes', data => {
            console.log('Game_gameIO_askRes', data)

            if(!data.error) {
                vars.interactions.list.push(data.interaction)
                vars.interactions.curent = data.interaction._id

                chatIO.emit('message', {
                    shortId: vars.game.shortId,
                    playerId: data.interaction.question.from,
                    message: data.interaction.question.message,
                    to: data.interaction.question.to
                })
            }
        })

        gameIO.on('askResAll', data => {
            console.log('Game_gameIO_askResAll', data)

            if(!data.error) {
                vars.interactions.list.push(data.interaction)
                vars.interactions.current = data.interaction._id
                
                if(data.interaction.question.to === vars.player._id) {
                    if(
                        !this.state.timeout 
                        && !this.state.showModalVoting
                        && !this.state.showModalQuestion
                        && !this.state.showModalAnswer
                    ) { 
                        const { interactions: intes } = vars
                        const inte = !intes.current 
                            ? undefined 
                            : intes.list.find(i => i._id === intes.current)
                        const intePlayerFrom = !inte ? undefined : vars.game.players.find(p => p._id === inte.question.from)
                        const from = !intePlayerFrom
                            ? { name: undefined, question: undefined }
                            : { name: intePlayerFrom.name, question: inte.question.message }

                        this.setState({ 
                            ...this.state, 
                            showModalAnswer: true, 
                            from,
                            showModal: false,
                        })
                    }
                }
            }
        })

        gameIO.on('answerRes', data => {
            console.log('Game_gameIO_answerRes', data)

            if(!data.error) {
                vars.interactions.list[
                    vars
                        .interactions
                        .list
                        .findIndex(i => i._id === data.interaction._id) 
                ] = data.interaction

                chatIO.emit('message', {
                    shortId: vars.game.shortId,
                    playerId: vars.player._id,
                    message: data.interaction.answer
                })
            }
        })

        gameIO.on('answerResAll', data => {
            console.log('Game_gameIO_answerResAll', data)

            if(!data.error) {
                vars.interactions.list[
                    vars
                        .interactions
                        .list
                        .findIndex(i => i._id === data.interaction._id) 
                ] = data.interaction
            }
        })

        gameIO.on('skipAskRes', data => {
            console.log('Game_gameIO_skipRes', data)
            
            if(!data.error) {}
        })

        gameIO.on('callMeetingRes', data => {
            console.log('Game_gameIO_callMeetingRes', data)

            if(!data.error) {
                vars.round.meeting = data 

                this.setState({ 
                    ...this.state, 
                    showModalQuestion: false,
                    showModalAnswer: false,
                    showModalVoting: true,
                    showModal: false,
                    meetingCaller: vars.game.players.find(p => p._id === data.by).name
                })
            }
        })

        gameIO.on('callMeetingResAll', data => {
            console.log('Game_gameIO_callMeetingAll', data)

            if(!data.error){
                vars.round.meeting = data

                this.setState({ 
                    ...this.state, 
                    showModalQuestion: false,
                    showModalAnswer: false,
                    showModalVoting: true,
                    showModal: false,
                    meetingCaller: vars.game.players.find(p => p._id === data.by).name
                })
            }
        })
        
        gameIO.on('leaderboardRes', data => {
            console.log('Game_gameIO_leaderboardRes', data)

            if(!data.error) {
                vars.game.players = data.players 
                vars.round.endedAt = data.endedAt
                vars.round.imposterWon = data.imposterWon
                this.props.history.replace({
                    pathname: `/game-rooms/${vars.game.shortId}/leaderboard`,
                    state: { roundsLeft: data.roundsLeft }
                })
            }
        })
    
        gameIO.on('timeout', data => {
            console.log('Game_gameIO_timeout', data)

            if(!data.error) {
                this.setState({ ...this.state, timeout: true })

                gameIO.emit('leaderboard', {
                    shortId: vars.game.shortId,
                })
            }
        })

        const askee = vars.round.nextAskee 
        const showModalQuestion = vars.game.players[askee.index]._id === vars.player._id 
            && !askee.askedAt
            && askee.givenChanceAt
            ? true 
            : false

        const { interactions: intes } = vars
        const inte = !intes.current 
            ? undefined 
            : intes.list.find(i => i._id === intes.current)
        const intePlayerFrom = !inte ? undefined : vars.game.players.find(p => p._id === inte.question.from)
        const intePlayerTo = !inte ? undefined : inte.question.to === vars.player._id
        const inteAns = !inte ? undefined : inte.answer
        const from = intePlayerFrom && intePlayerTo && !inteAns
            ? { name: intePlayerFrom.name, question: inte.question.message }
            : { name: undefined, question: undefined }

        if(from.name) {
            this.setState({ ...this.state, showModal: false, showModalAnswer: true, from })
        } else if(this.state.showModalQuestion !== showModalQuestion) {
            this.setState({ ...this.state, showModal: false, showModalQuestion })
        } else if(
            this.state.showModalAnswer
            || this.state.showModalQuestion
            || this.state.showModalVoting
        ) this.setState({ ...this.state, showModal: false })

        document.getElementById('popup-audio').play()

        this.setCountdown()
    }

    componentWillUnmount = () => {
        gameIO.off('question')
        gameIO.off('askRes')
        gameIO.off('askResAll')
        gameIO.off('skipAskRes')
        gameIO.off('answerRes')
        gameIO.off('answerResAll')
        gameIO.off('callMeetingRes')
        gameIO.off('callMeetingResAll')
        gameIO.off('leaderboardRes')
        gameIO.off('timeout')
        this.setState = () => {}
    }

    setCountdown = () => {
        const countdown = setInterval(() => {
            if(this.state.counter > 0) {
                this.setState({ 
                    ...this.state, 
                    counter: this.state.counter - 1000 
                })
            } else {
                clearInterval(countdown)
            }
        }, 1000)
        setTimeout(() => {
            this.setState({ ...this.state, countdown })
        }, 50)
    }

    handleAsk = data => {
        if(!vars.round.endedAt) {
            if(data.question) {
                gameIO.emit('ask', { 
                    shortId: vars.game.shortId, 
                    question: {
                        from: vars.player._id, 
                        to: data.playerId,
                        message: data.question
                    }
                })
                this.setState({ ...this.state, showModalQuestion: false })
            } else {
                this.handleCancel()
            }
        }
    }

    handleAnswer = data => { 
        if(!vars.round.endedAt) {
            if(data.answer) {
                gameIO.emit('answer', {  
                    shortId: vars.game.shortId, 
                    interactionId: vars.interactions.current,
                    answer: data.answer 
                })
                this.setState({ ...this.state, showModalAnswer: false })
            } else {
                this.handleCancel()
            }
        }
    }

    handleCancel = () => {
        if(!vars.round.endedAt) {
            gameIO.emit('skipAsk', { shortId: vars.game.shortId })
            this.setState({ 
                ...this.state, 
                showModalQuestion: false, 
                showModalAnswer: false,
                showModalVoting: false,
                showModal: false
            })
        }
    }

    handleMeetingCall = () => {
        if(!vars.round.endedAt) {
            gameIO.emit('callMeeting', {
                shortId: vars.game.shortId,
                playerId: vars.player._id
            })
        }
    }

    parseChats = () => {
        const interactionsList = vars.round.interactions 
            ? vars.round.interactions.list 
            : []
        
        const chats = []        
        interactionsList.forEach(interaction => {
            const { question, answer } = interaction

            chats.push({
                playerId: question.from,
                message: question.message,
                to: question.to
            })

            if(answer) {
                chats.push({
                    playerId: question.to,
                    message: answer
                })
            }
        })

        return chats
    } 

    render() {
        return (
            <>
                { this.returnUIModal() }
                <div>
                    <Header />
                    <div className={styles['container']}>
                        { this.returnUIHUD() }
                        { this.returnUITimer() }
                        <div className={ styles['gameMatrix'] }>
                            <Matrix isFinalGuessTime={ this.state.isFinalGuessTime }/>
                        </div>
                        <div className={ styles['chat'] }>
                            <Chat showInput={ false } chats={ this.parseChats() }/>
                        </div>
                    </div>
                </div>
                {
                    this.state.showModalQuestion && !vars.round.endedAt &&
                    this.returnUIQuestion()
                }
                {
                    this.state.showModalAnswer && !vars.round.endedAt &&
                    this.returnUIAnswer()
                }
                {
                    this.state.showModalVoting && !vars.round.endedAt &&
                    this.returnUIVoting()
                }
            </>
        )
    }

    returnUIModal = () => (
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

    returnUIHUD = () => (
        <div className={ styles['HUD'] }>
            { this.returnUIHUDInfo() }
            { this.returnUIHUDButton() }
        </div>
    )

    returnUIHUDInfo = () => (
        <div className={ styles['userInfo'] }>
            <h1>
                {
                    vars.player.isImposter
                        ? 'You are the Imposter!'
                        : `The game location is: ${ this.state.location.name }`
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

    returnUIHUDButton = () => (
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
                    onClick={ () => {
                        if(!vars.round.endedAt) {
                            this.setState({ ...this.state, isFinalGuessTime: true }) 
                        }
                    }}
                >
                    Guess the location!
                </button>
            }
        </div>
    )

    returnUITimer = () => (
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

    returnUIQuestion = () => {
        return (
            <Question 
                location={ this.state.location }
                handleAsk={ this.handleAsk } 
                handleCancel={ this.handleCancel }
            />
        )
    }

    returnUIAnswer = () => {
        return (
            <Answer 
                location={ this.state.location }
                from={ this.state.from }
                handleAnswer={ this.handleAnswer } 
                handleCancel={ this.handleCancel }
            />
        )
    }

    returnUIVoting = () => {
        return (
            <Voting 
                caller={ this.state.meetingCaller } 
                handleCancel={ () => this.setState({ 
                    ...this.state, 
                    showModalQuestion: false, 
                    showModalAnswer: false,
                    showModalVoting: false,
                    showModal: false,
                }) }
            />
        )
    }
}

export default withRouter(Game)
