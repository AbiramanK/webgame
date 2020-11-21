import * as React from 'react';
import { Card, Input, Typography } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Colors } from './../../Colors';
import { chatIO } from '../../SocketIO'

export interface IChatComponentProps {
    data: any
}

export interface IChatComponentState {
    chats: Array<object>
}

export class ChatComponent extends React.Component<IChatComponentProps, IChatComponentState> {
    constructor(props: IChatComponentProps) {
        super(props);

        this.state = {
            chats: [
            ]
        }
    }

    componentDidMount = () => {
        chatIO.on('joinRes', (data: any) => {
            this.setState({ 
                chats: data.chats.map((chat: any) => { 
                    chat = { ...chat, type: this.props.data.player.email === chat.email ? 'SEND' : 'RECEIVE' }
                    return chat
                })
            })
        })

        chatIO.on('messageRes', (data: any) => {
            if(data.email !== this.props.data.player.email) data.type = 'RECEIVE'
            this.setState({ chats: [ ...this.state.chats, data ] })
        })

        chatIO.on('messageResAll', (data: any) => {
            if(data.email !== this.props.data.player.email) data.type = 'RECEIVE'
            this.setState({ chats: [ ...this.state.chats, data ] })
        })

        chatIO.emit('join', { short_id: this.props.data.game.short_id })
    }

    handleSubmit = (e: any) => {
        e.preventDefault()
        const game = this.props.data.game 
        const player = this.props.data.player
        chatIO.emit('message', {
            short_id: game.short_id,
            name: player.name,
            email: player.email,
            message: Object.fromEntries(new FormData(e.target)).message
        })
    }

    public render() {
        return (
            <div className="lobby-site-card-border-less-wrapper">
                <Card
                    className="chat-card"
                    title="Chat"
                    bordered={true}
                    style={{ width: 350, height: 550, paddingTop: 0, paddingBottom: 0 }}
                    headStyle={{ ...styles.cardHeader, fontSize: 21, padding: 0 }}
                >
                    <div style={{ height: 400, overflow: 'auto' }}>
                        {
                            this.state.chats.map((chat: any, index: number) => {
                                return (
                                    <div className="lobby-chat-message-card-container" 
                                        style={{ alignItems: chat.type === "RECEIVE" ? "flex-start" : "flex-end" }}
                                        key={ index }
                                    >
                                        <Typography className="lobby-player-name-text">{chat.name}</Typography>
                                        <Card id="lobby-chat-message-card" 
                                            className="lobby-chat-message-card" 
                                            style={{ width: 250, borderRadius: 10, backgroundColor: chat.type === "RECEIVE" ? "#D3D3D3" : Colors.PRIMARY }}
                                        >
                                            <Typography style={{ color: chat.type === "RECEIVE" ? Colors.BLACK : Colors.WHITE }}>{chat.message}</Typography>
                                        </Card>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <form onSubmit={ this.handleSubmit }>
                        <Input
                            className="chact-text-input-box"
                            placeholder="Write a reply..."
                            name="message"
                            size="large"
                            suffix={ <ArrowRightOutlined style={{ fontSize: 16, color: '#1890ff' }}/> }
                        />
                    </form>
                </Card>
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

export default ChatComponent;
