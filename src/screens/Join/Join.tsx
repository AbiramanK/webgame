import React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Card, Input, Button, Form } from 'antd'

import styles from './Join.module.css'
import { Colors } from '../../Colors'
import { Header } from '../../components'
import { playerIO, vars } from '../../SocketIO'

export interface IRouteParams {
    short_id: string
}

export interface IHostProps extends RouteComponentProps<IRouteParams> {}

export interface IHostState {}

export class Login extends React.Component<IHostProps, IHostState> {
    constructor(props: IHostProps) {
        super(props);

        this.state = {} 
    }

    componentDidMount() {
        playerIO.on('joinRes', (data: any) => {
            console.log('Join_joinRes', data)

            if(!data.error) {
                vars.game = data.game
                vars.player = data.player
                
                this.props.history.push(`/game-rooms/${data.game.short_id}/game`)
            }
        })
    }

    join = (values: any) => playerIO.emit('join', { ...values, short_id: this.props.match.params.short_id })

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
                        <Form layout="vertical" onFinish={ this.join }>
                            <Form.Item label="Name" name="name"><Input/></Form.Item>
                            <Form.Item label="Email" name="email"><Input/></Form.Item>
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