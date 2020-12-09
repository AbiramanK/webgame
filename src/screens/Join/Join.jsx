import React from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Input, Button, Form, Modal } from 'antd'

import styles from './Join.module.css'
import { Colors } from '../../Colors'
import { Header } from '../../components'
import { playerIO, vars, chatIO, gameIO } from '../../SocketIO'

export class Login extends React.Component {
    constructor(props) {
        super(props);

        const name = sessionStorage.getItem('name')
        const email = sessionStorage.getItem('email')

        this.state = {
            joinClicked: false,
            name: name ? name : '',
            email: email ? email : '',
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
            
                chatIO.emit('join', { short_id: data.game.short_id })

                sessionStorage.setItem('name', data.player.name)
                sessionStorage.setItem('email', data.player.email)
                sessionStorage.setItem('short_id', data.game.short_id)
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
                short_id: vars.game.short_id,
                player_id: vars.player._id
            }) 
            else this.setState({ ...this.state, joinClicked: false })
        })

        gameIO.on('startRes', data => {
            console.log('Join_gameIO_startRes', data)

            if(!data.error) {
                if(vars.game.state === 'LOBBY') {
                    this.setState({ ...this.state, joinClicked: false })

                    this.props.history.push(`/game-rooms/${vars.game.short_id}/lobby`)
                } else {
                    gameIO.emit('info', { 
                        short_id: vars.game.short_id, 
                        player_id: vars.player._id
                    })
                }
            }
        })

        gameIO.on('infoRes', data => {
            console.log('Join_gameIO_infoRes', data)

            if(!data.error) {
                vars.player.isImposter = data.isImposter

                if(data.isImposter) vars.tempGuesses = data.round.imposter.tempGuesses
                else vars.location = data.round.location
                vars.round = data.round
                vars.interactions = data.round.interactions

                if(vars.round.state === 'LEADERBOARD') {
                    gameIO.emit('leaderboard', {
                        short_id: vars.game.short_id,
                        round_id: vars.round._id
                    })
                } else {
                    this.setState({ ...this.state, joinClicked: false })
                    this.props.history.replace(`/game-rooms/${vars.game.short_id}/game`)
                }
            } else this.setState({ ...this.state, joinClicked: false })
        })

        gameIO.on('leaderboardRes', data => {
            console.log('Join_gameIO_leaderboardRes', data)

            this.setState({ ...this.state, joinClicked: false })
            if(!data.error) {
                vars.game.players = data.players 
                vars.round.endedAt = data.endedAt
                vars.round.imposterWon = data.imposterWon
                this.props.history.push({
                    pathname: `/game-rooms/${vars.game.short_id}/leaderboard`,
                    state: { roundsLeft: data.roundsLeft }
                })
                document.body.style.overflow = 'auto'
            }
        })

        if(
            this.state.name 
            && this.state.email
            && sessionStorage.getItem('short_id') === this.props.match.params.short_id 
        ) this.join({ name: this.state.name, email: this.state.email })
    }

    componentWillUnmount = () => {
        playerIO.off("joinRes")
        chatIO.off('joinRes')
        gameIO.off('startRes')
        gameIO.off('infoRes')
        gameIO.on('leaderboardRes')
        this.setState = () => {}
    }

    parseLocations = tiles => {
        const parsedLocations = new Array(tiles.rows).fill(undefined).map(() => new Array(tiles.columns).fill(undefined))
        tiles.locations.forEach(location => {
            parsedLocations[location.position.i][location.position.j] = {
                name: location.name,
                image: location.image
            }
        })
        return parsedLocations
    }

    parseTempGuesses = (tiles, tempGuesses) => {
        const parsedGuesses = new Array(tiles.rows).fill(undefined).map(() => new Array(tiles.columns).fill(undefined))
        tempGuesses.forEach(guess => { parsedGuesses[guess.position.i][guess.position.j] = guess })
        return parsedGuesses
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
            playerIO.emit('join', { 
                ...values, 
                short_id: this.props.match.params.short_id 
            })
            this.setState({ ...this.state, joinClicked: true})
        }
    }

    handleModalCancel = () => this.setState({ showModal: false, modalMessage: '' })

    render() {
        return (
            <div className={ styles['container'] }>
                <Header/>
                <div className={ styles['card-wrapper'] }>
                    <Card
                        className={ styles['birthmap-card'] }
                        title="Birthmap"
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