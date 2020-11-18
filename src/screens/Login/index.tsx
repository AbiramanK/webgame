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
    Row,
    Col
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
}

export class Login extends React.Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);

        this.state = {
        }
    }

    login = () => {
        this.props.history.push('lobby');
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
                        <form action="">
                            <div className="form-control-input-container">
                                <label className="form-control-input-label">Name</label>
                                <Input />
                            </div>
                            <div
                                className="form-control-input-container"
                            >
                                <label className="form-control-input-label">Email</label>
                                <Input />
                            </div>
                            <div
                                className="login-submit-button-container"
                            >
                                <Button
                                    type="primary"
                                    className="form-control-submit-buttom"
                                    onClick={this.login}
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