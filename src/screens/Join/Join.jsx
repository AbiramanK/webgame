import React from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Input, Button, Form, Modal } from 'antd'

import styles from './Join.module.css'
import { Colors } from '../../Colors'
import { Header } from '../../components'
import { playerIO, vars, chatIO, gameIO } from '../../SocketIO'

export class Login extends React.Component {
    constructor(props) {
        super(props)

        const name = sessionStorage.getItem('name')
        const email = sessionStorage.getItem('email')

        this.state = {
            name: name ?? '',
            email: email ?? '',
            joinClicked: false,
            showModal: false,
            modalMessage: '',
            nameError: false,
            emailError: false
        } 
    }

    componentDidMount() {
        
        playerIO.on('joinRes', data => {
            console.log('Join_playerIO_joinRes', data)

            if(!data.error) {
                vars.init = true
                vars.game = data.game
                vars.player = data.player
            
                sessionStorage.setItem('name', data.player.name)
                sessionStorage.setItem('email', data.player.email)
                sessionStorage.setItem('shortId', data.game.shortId)

                chatIO.emit('join', { shortId: data.game.shortId })
            } else {
                this.setState({ 
                    ...this.state, 
                    joinClicked: false,
                    showModal: true,
                    modalMessage: data.error
                })
            }
        })
    
        chatIO.on('joinRes', data => {
            console.log('Join_chatIO_joinRes', data)

            if(!data.error) gameIO.emit('start', {
                shortId: vars.game.shortId,
                playerId: vars.player._id
            }) 
            else this.setState({ ...this.state, joinClicked: false })
        })

        gameIO.on('startRes', data => {
            console.log('Join_gameIO_startRes', data)

            if(!data.error) {
                if(vars.game.state === 'LOBBY') {
                    this.setState({ ...this.state, joinClicked: false })
                    this.props.history.push(`/game-rooms/${vars.game.shortId}/lobby`)
                } else {
                    gameIO.emit('roundInfo', { 
                        shortId: vars.game.shortId, 
                        playerId: vars.player._id
                    })
                }
            } else this.setState({ ...this.state, joinClicked: false })
        })

        gameIO.on('roundInfoRes', data => {
            console.log('Join_gameIO_roundInfoRes', data)

            if(!data.error) {
                this.setState({ ...this.state, startGameClicked: false })

                vars.player.isImposter = data.isImposter

                if(data.isImposter) {
                    vars.tempGuesses = data.round.imposter.tempGuesses
                }

                vars.interactions = data.round.interactions

                vars.round = data.round

                if(vars.round.state !== 'LEADERBOARD') {
                    this.props.history.replace(`/game-rooms/${vars.game.shortId}/game`)
                } else {
                    gameIO.emit('leaderboard', { shortId: vars.game.shortId })
                }
            } else {
                this.setState({ ...this.state, startGameClicked: false })
            }
        })

        gameIO.on('leaderboardRes', data => {
            console.log('Join_gameIO_leaderboardRes', data)

            this.setState({ ...this.state, joinClicked: false })
            if(!data.error) {
                vars.game.players = data.players 
                vars.round.endedAt = data.endedAt
                vars.round.imposterWon = data.imposterWon
                this.props.history.push({
                    pathname: `/game-rooms/${vars.game.shortId}/leaderboard`,
                    state: { roundsLeft: data.roundsLeft }
                })
                document.body.style.overflow = 'auto'
            }
        })

        if(
            this.state.name 
            && this.state.email
            && sessionStorage.getItem('shortId') === this.props.match.params.shortId 
        ) this.join({ 
            joinClicked: true,
            name: this.state.name, 
            email: this.state.email 
        })
    }

    componentWillUnmount = () => {
        playerIO.off("joinRes")
        chatIO.off('joinRes')
        gameIO.off('startRes')
        gameIO.off('roundInfoRes')
        gameIO.off('leaderboardRes')
        this.setState = () => {}
    }

    join = values => { 
        this.setState({
            ...this.state,
            nameError: false,
            emailError: false
        })
        if(!values.name) this.setState({ ...this.state, nameError: true }) 
        if(!/.+@.+\..+/.test(values.email)) this.setState({ ...this.state, emailError: true })
        if(
            !this.state.nameError
            && !this.state.emailError
            && !this.state.joinClicked
        ) {
            this.setState({ ...this.state, joinClicked: true})
            playerIO.emit('join', { ...values, shortId: this.props.match.params.shortId })
        }
    }

    handleModalCancel = () => this.setState({ ...this.state, showModal: false })

    render() {
        return (
            <div className={ styles['container'] }>
                <Header/>
                <div className={ styles['card-wrapper'] }>
                    <Card
                        className={ styles['birthmap-card'] }
                        title="Join Imposter"
                        bordered={true}
                        style={{ width: 350, paddingTop: 0, paddingBottom: 0 }}
                        headStyle={{ ...jsxStyles.cardHeader }}
                    >
                        <Form layout="vertical" onFinish={ this.join }>
                            <Form.Item 
                                label="Name" 
                                name="name"
                                className={ styles['input-label'] }
                                initialValue={ this.state.name }
                            >
                                <Input 
                                    style={ this.state.nameError ? { border: `2px solid ${Colors.RED}` } : {}}
                                    onFocus={ () => this.setState({ ...this.state, nameError: false })}
                                />
                            </Form.Item>
                            <Form.Item 
                                label="Email" 
                                name="email" 
                                className={ styles['input-label'] }
                                initialValue={ this.state.email }
                            >
                                <Input 
                                    style={ this.state.emailError ? { border: `2px solid ${Colors.RED}` } : {}}
                                    onFocus={ () => this.setState({ ...this.state, emailError: false })}
                                />
                            </Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className={ styles['submit-button'] }
                                loading={ this.state.joinClicked }
                            >
                                Join
                            </Button>
                        </Form>
                    </Card>
                </div> 
                <Modal 
                    title="Oops!" 
                    visible={ this.state.showModal }
                    onCancel={ this.handleModalCancel }
                    footer={ null }
                >
                    <h3 className={ styles['modal'] }>
                        { this.state.modalMessage }
                    </h3>
                </Modal>
            </div>
        )
    }
}

const jsxStyles = {
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

export default withRouter(Login);