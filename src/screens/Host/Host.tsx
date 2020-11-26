import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Card, Input, Button, Form } from 'antd';

import styles from './Host.module.css'
import { Colors } from '../../Colors';
import { Header } from '../../components';
import { playerIO, vars, chatIO } from '../../SocketIO'

export interface IHostProps extends RouteComponentProps {}

export interface IHostState {}

export class Login extends React.Component<IHostProps, IHostState> {
    constructor(props: IHostProps) {
        super(props);

        this.state = {} 
    }

    componentDidMount() {
        playerIO.on("hostRes", (data: any) => {
            console.log("Host_hostRes", data)

            if(!data.error) playerIO.emit("join", data)
        });

        playerIO.on("joinRes", (data: any) => {
            console.log("Host_joinRes", data)

            if(!data.error) {
                vars.init = true
                vars.game = data.game
                vars.player = data.player
        
                this.props.history.push(`/game-rooms/${data.game.short_id}/lobby`)
            }
        })
    }

    componentWillUnmount = () => {
        playerIO.off("hostRes")
        playerIO.off("joinRes")
        chatIO.off('joinRes')
        chatIO.off('join')
        this.setState = () => {}
    }

    host = (values: any) => playerIO.emit("host", values)

    public render() {
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
                            <Form.Item label="Name" name="name" className={ styles['input-label'] }><Input/></Form.Item>
                            <Form.Item label="Email" name="email" className={ styles['input-label'] }><Input/></Form.Item>
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

export default withRouter(Login);