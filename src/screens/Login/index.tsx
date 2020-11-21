import * as React from 'react';
import './index.css'
import {
    withRouter,
    RouteComponentProps
} from 'react-router-dom';
import {
    Card,
    Input,
    Button,
    Radio
} from 'antd';
import {
    Colors
} from './../../Colors';

import {
    HeaderComponent
} from './../../components';

export interface ILoginProps extends RouteComponentProps {
}

export interface ILoginState {
    isHost: Boolean
}

export class Login extends React.Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);

        this.state = {
            isHost: true
        }
    }

    login = () => {
        this.props.history.push('lobby');
    }

    handleRoleUpdate = (e: any) => {
        this.setState({ isHost: e.target.value })
    }

    handleSubmit = (e: any) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
        console.log(formData)
    }

    public render() {
        return (
            <div className="login-container">
                <HeaderComponent />

                <div className="site-card-border-less-wrapper">
                    <Card
                        className="birthmap-card"
                        title="Birthmap"
                        bordered={true}
                        style={{ width: 350, paddingTop: 0, paddingBottom: 0 }}
                        headStyle={{ ...styles.cardHeader }}
                    >
                        <form onSubmit={ this.handleSubmit }>
                            <div 
                                className="form-control-input-container"
                                style={{ marginBottom: 10 }}
                            >
                                <label 
                                    className="form-control-input-label" 
                                    style={{ marginRight: 20 }}
                                >Role</label>
                                <Radio.Group 
                                    value={ this.state.isHost } 
                                    onChange={ this.handleRoleUpdate }
                                >
                                    <Radio value={ true }>Host</Radio>
                                    <Radio value={ false }>Invited</Radio>
                                </Radio.Group>
                            </div>
                            {   
                                this.state.isHost 
                                ? <></> 
                                : <div className="form-control-input-container">
                                    <label className="form-control-input-label">Game ID</label>
                                    <Input name="game_short_id"/>
                                </div>
                            }
                            <div className="form-control-input-container">
                                <label className="form-control-input-label">Name</label>
                                <Input name="name"/>
                            </div>
                            <div className="form-control-input-container">
                                <label className="form-control-input-label">Email</label>
                                <Input name="email"/>
                            </div>
                            <div className="login-submit-button-container">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="form-control-submit-buttom"
                                >Submit</Button>
                            </div>
                        </form>
                    </Card>
                </div>
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

export default withRouter(Login);