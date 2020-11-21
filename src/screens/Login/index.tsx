import * as React from 'react';
import './index.css'
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Card, Input, Button, Modal } from 'antd';
import { Colors } from './../../Colors';
import { HeaderComponent } from './../../components';
import { playerIO } from '../../SocketIO'

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
        playerIO.on("hostRes", (data: any) => {
            console.log("Login_login_hostRes", data)

            if(!data.error) {
                playerIO.emit("join", {
                    short_id: data.short_id,
                    email: data.email,
                    name: data.name
                })
            } 
        });

        playerIO.on("joinRes", (data: any) => {
            console.log("Login_login_joinRes", data)

            if(!data.error) this.props.history.push('/lobby', { data })
        })
    }

    handleChange(evt: any) {
        const value = evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
        this.setState({
            [evt.target.name]: value
        });
    }

    login = (e: any) => {
        e.preventDefault()
        const formData = Object.fromEntries(new FormData(e.target))
        playerIO.emit("host", formData)
    }

    join = () => {
        playerIO.emit("join", {
            short_id: this.state.shortId,
            name: this.state.name,
            email: this.state.email
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
                        <form onSubmit={ this.login }>
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