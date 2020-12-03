import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Input, Button, Form } from 'antd';

import styles from './Host.module.css'
import { Colors } from '../../Colors';
import { Header } from '../../components';
import { playerIO, vars, chatIO, gameIO } from '../../SocketIO'

export class Host extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            hostClicked: false,
            nameError: false,
            emailError: false
        } 
    }

    componentDidMount() {
        playerIO.on("hostRes", data => {
            console.log("Host_playerIO_hostRes", data)

            if(!data.error) playerIO.emit("join", data)
            else this.setState({ ...this.state, hostClicked: false })
        });

        playerIO.on("joinRes", data => {
            console.log("Host_playerIO_joinRes", data)

            if(!data.error) {
                vars.init = true
                vars.game = data.game
                vars.player = data.player
        
                chatIO.emit('join', { short_id: data.game.short_id })

                sessionStorage.setItem('name', data.player.name)
                sessionStorage.setItem('email', data.player.email)
                sessionStorage.getItem('short_id', data.game.short_id)
            } else this.setState({ ...this.state, hostClicked: false })
        })

        chatIO.on('joinRes', data => {
            console.log('Host_chatIO_joinRes', data)

            if(!data.error) gameIO.emit('start', {
                short_id: vars.game.short_id,
                player_id: vars.player._id
            }) 
            else this.setState({ ...this.state, hostClicked: false })
        })

        gameIO.on('startRes', data => {
            console.log('Host_gameIO_startRes', data)

            this.setState({ ...this.state, hostClicked: false })
            if(!data.error) {
                this.props.history.push(`/game-rooms/${vars.game.short_id}/lobby`)
            }
        })
    }

    componentWillUnmount = () => {
        playerIO.off("hostRes")
        playerIO.off("joinRes")
        chatIO.off('joinRes')
        gameIO.off('startRes')
        this.setState = () => {}
    }

    host = values => {
        this.setState({
            ...this.state,
            nameError: false,
            emailError: false
        })
        if(!values.name) this.setState({ ...this.state, nameError: true }) 
        if(!/.+@.+\..+/.test(values.email)) this.setState({ ...this.state, emailError: true })
        if(!this.state.hostClicked) {
            playerIO.emit("host", values)
            this.setState({ ...this.state, hostClicked: true})
        }
    }

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
                        <Form layout="vertical" onFinish={ this.host }>
                            <Form.Item 
                                label="Name" 
                                name="name" 
                                className={ styles['input-label'] }
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
                                Host
                            </Button>
                        </Form>
                    </Card>
                </div>
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

export default withRouter(Host);