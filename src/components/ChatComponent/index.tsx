import * as React from 'react';
import {
    Card,
    Input,
    Typography
} from 'antd';
import {
    ArrowRightOutlined
} from '@ant-design/icons';
import {
    Colors
} from './../../Colors';

export interface IChatComponentProps {
}

export interface IChatComponentState {
    chats: Array<object>
}

export class ChatComponent extends React.Component<IChatComponentProps, IChatComponentState> {
    constructor(props: IChatComponentProps) {
        super(props);

        this.state = {
            chats: [
                {
                    name: "Alex",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "RECEIVE"
                },
                {
                    name: "Alex",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "RECEIVE"
                },
                {
                    name: "James",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "SENT"
                },
                {
                    name: "Alex",
                    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut.",
                    type: "RECEIVE"
                }
            ]
        }
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
                        {this.state.chats.map((chat: any, index: number) => {
                            return (
                                <div className="lobby-chat-message-card-container" style={{ alignItems: chat.type == "RECEIVE" ? "flex-start" : "flex-end" }}>
                                    <Typography className="lobby-player-name-text">{chat.name}</Typography>
                                    <Card id="lobby-chat-message-card" className="lobby-chat-message-card" style={{ width: 250, borderRadius: 10, backgroundColor: chat.type == "RECEIVE" ? "#D3D3D3" : Colors.PRIMARY }}>
                                        <Typography
                                            style={{ color: chat.type == "RECEIVE" ? Colors.BLACK : Colors.WHITE }}
                                        >{chat.message}</Typography>
                                    </Card>
                                </div>
                            )
                        })}
                    </div>
                    <Input
                        className="chact-text-input-box"
                        placeholder="Write a reply..."
                        size="large"
                        suffix={<ArrowRightOutlined
                            style={{
                                fontSize: 16,
                                color: '#1890ff',
                            }}
                        />}
                    />
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
