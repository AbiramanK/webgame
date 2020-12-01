import React from 'react';
import { Card, Input, Typography } from 'antd';

import styles from './Chat.module.css'
import { Colors } from '../../Colors';
import { chatIO, vars } from '../../SocketIO'
import send from '../../assets/send.svg'

export class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chats: this.props.chats instanceof Array ? this.props.chats : [],
            input: ''
        }
        this.containerRef = React.createRef()
    }

    componentDidMount = () => {
        chatIO.on('messageRes', data => {
            console.log('Chat_messageRes', data)

            if(!data.error) {
                this.setState({ chats: [ ...this.state.chats, data ] })
                this.scrollToBottom()
            }
        })

        chatIO.on('messageResAll', data => {
            console.log('Chat_messageResAll', data)

            if(!data.error) {
                this.setState({ chats: [ ...this.state.chats, data ] })
                this.scrollToBottom()
            }
        })
        
        this.scrollToBottom()
    }

    componentWillUnmount = () => {
        chatIO.off('messageRes')
        chatIO.off('messageResAll')
        chatIO.off('joinRes')
        chatIO.off('join')
        this.setState = () => {}
    }

    scrollToBottom = () => {
        const ref = this.containerRef.current
        ref.scrollTop = ref.scrollHeight
    }

    sendMessage = e => {
        e.preventDefault()
        this.setState({ ...this.state, input: '' })
        const message = Object.fromEntries(new FormData(e.target)).message
        if(message) chatIO.emit('message', {
            short_id: vars.game.short_id,
            name: vars.player.name,
            email: vars.player.email,
            message
        })
    }

    render() {
        return (
            <div className={ styles['card-wrapper'] }>
                <Card
                    className={ styles['chat-card'] }
                    title="Chat"
                    bordered={true}
                    style={{ width: 350, height: 550, paddingTop: 0, paddingBottom: 0 }}
                    headStyle={{ ...jsxStyles.cardHeader, fontSize: 21, padding: 0 }}
                >
                    <div style={{ height: 400, overflow: 'auto' }} ref={ this.containerRef }>
                        {
                            this.state.chats.map((chat, index) => {
                                return (
                                    <div className={ styles['message-card-container'] } 
                                        style={{ alignItems: chat.email === vars.player.email ? 'flex-start' : 'flex-end' }}
                                        key={ index }
                                    >
                                        <Typography className={ styles['chat-player-name'] }>{ chat.name }</Typography>
                                        <Card 
                                            className={ styles['chat-message-card'] }
                                            bodyStyle={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16 }}
                                            style={{ 
                                                width: 250, 
                                                borderRadius: 10, 
                                                backgroundColor: chat.email === vars.player.email ? Colors.PRIMARY : Colors.GREY,
                                            }}
                                        >
                                            <Typography style={{ color: chat.email === vars.player.email ? Colors.WHITE : Colors.BLACK }}>
                                                { chat.message }
                                            </Typography>
                                        </Card>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {
                        this.props.showInput &&
                        <form onSubmit={ this.sendMessage }>
                            <Input
                                value={ this.state.input }
                                onChange={ e => this.setState({ ...this.state, input: e.target.value })}
                                className={ styles['input'] }
                                placeholder="Write a reply..."
                                name="message"
                                size="large"
                                suffix={ 
                                    <label>
                                        <img alt="" src={ send } style={{ cursor: 'pointer' }}/> 
                                        <button type="submit" style={{ display: 'none' }}/>
                                    </label>
                                }
                            />
                        </form>
                    }
                </Card>
            </div>
        );
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

export default Chat;
