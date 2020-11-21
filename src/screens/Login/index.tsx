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
    Modal,
    Radio
} from 'antd';
import socketIOClient from "socket.io-client";
import {
    Colors
} from './../../Colors';

import {
    HeaderComponent
} from './../../components';

import {
    API_BASE
} from './../../Configs';

export interface ILoginProps extends RouteComponentProps {
}

export interface ILoginState {
    shortId: any;
    email: any;
    name: any;
    isModalVisible: boolean;
    [key: string]: any;
}

export class Login extends React.Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);

        this.state = {
            shortId: '',
            email: '',
            name: '',
            isModalVisible: false
        }

        this.login = this.login.bind(this);
        this.join = this.join.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {

    }

    handleChange(evt: any) {
        const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
        this.setState({
            [evt.target.name]: value
        });
    }

    login = () => {

        const socket = socketIOClient(`${API_BASE}player`, {
            path: '/webgame/socket.io/'
        });

        socket.emit("host", {
            name: "Abiraman K",
            email: "abiramancit@gmail.com"
        });

        socket.on("hostRes", (data: any) => {
            console.log("data", data)
            // socket.emit("join", {
            //     short_id: data.short_id,
            //     email: data.email,
            //     name: data.name
            // })
            setTimeout(() => {
                this.props.history.push('lobby', {
                    shortId: data.short_id,
                    email: data.email,
                    name: data.name
                });
            }, 2000);
        });

        socket.on("joinRes", (data: any) => {
            console.log("join response", data)
        })
    }

    join = () => {
        socketIOClient(`${API_BASE}player`, {
            path: '/webgame/socket.io/'
        });
        console.log("join shortId", this.state.shortId)
        // socket.emit("join", {
        //     short_id: this.state.shortId,
        //     name: this.state.name,
        //     email: this.state.email
        // });
        this.props.history.push('lobby', {
            shortId: this.state.shortId,
            email: this.state.email,
            name: this.state.name
        });
    }

    showModal = () => {
        this.setState({
            isModalVisible: true
        })
    }

    hideModal = () => {
        this.setState({
            isModalVisible: false
        })
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
                        <Button
                            type="link"
                            onClick={this.showModal}
                        >Join</Button>
                    </Card>
                </div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.isModalVisible}
                    onOk={this.join}
                    okText={"join"}
                    onCancel={this.hideModal}
                >
                    <label htmlFor="">Game Id</label>
                    <Input 
                        name={"shortId"}
                        onChange={this.handleChange}
                    />
                    <label htmlFor="">Name</label>
                    <Input 
                        name={"name"}
                        onChange={this.handleChange}
                    />
                    <label htmlFor="">Email</label>
                    <Input 
                        name={"email"}
                        onChange={this.handleChange}
                    />
                </Modal>
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