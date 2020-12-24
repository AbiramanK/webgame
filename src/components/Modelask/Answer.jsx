import React from "react";
import { Modal, Button, Input } from "antd";
import "./Answer.css";
import { Colors } from "../../Colors";

import { vars } from '../../SocketIO'

class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      answer: '',
      show: true
    };
  }

  componentDidMount = () => {
    this.playAudio()
    window.addEventListener('keypress', this.handleEnterPress)
  }

  componentWillUnmount = () => {
    this.setState = () => {}
    window.removeEventListener('keypress', this.handleEnterPress)
    setTimeout(() => document.body.style.overflow = 'auto', 0)
  }

  playAudio = () => {
    const audio = document.getElementById('popup-audio')
    audio.currentTime = 0
    audio.play()
  }

  handleEnterPress = e => {
    if(e.code === 'Enter') this.handleOk()
  }

  handleOk = () => {
    this.setState({ ...this.state, show: false })
    this.props.handleAnswer(this.state)
  }

  handleCancel = () => {
    this.setState({ ...this.state, show: false })
    this.props.handleCancel()
  }

  render() {
    return (
      <Modal
        className="Model-Ans"
        title={ this.returnTitle() }
        visible={ this.state.show }
        onOk={ this.handleOk }
        onCancel={ this.handleCancel }
        style={{ borderRadius: "10px" }}
        closable={ false }
        footer={ null }
        width={700}
        maskClosable={ false }
      >
        { !vars.player.isImposter && this.returnHeader() }
        <h3 style={{ color: "#000000" }}>
          { this.props.from.question }
        </h3>
        <h3>How do You Respond?</h3>
        <Input 
          placeholder="Type your answer here..." 
          onChange={ e => this.setState({ ...this.state, answer: e.target.value }) }
        />
        { this.returnButton() }
      </Modal>
    )
  }

  returnTitle = () => {
    const titleStyle = { 
      position: 'relative', 
      textAlign: 'center' 
    }
    return (
      <div style={ titleStyle }>
        { `${this.props.from.name} asked you a question` }
      </div>
    )
  }

  returnHeader = () => (
    <h3 style={{ color: Colors.PRIMARY }}>
      <span style={{ fontWeight: 400, color: 'black' }}>
        The location is:
      </span> { this.props.location.name }
    </h3>
  )

  returnButton = () => {
    const containerStyle = {
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      color: Colors.WHITE,
    }
    const buttonStyle = {
      backgroundColor: Colors.PRIMARY,
      color: Colors.WHITE,
      marginTop: "30px",
      padding: "0 30px",
    }
    return (
      <div style={ containerStyle }>
        <Button
          size="large"
          style={ buttonStyle }
          onClick={ this.handleOk }
        >
          Answer
        </Button>
      </div>
    )
  }
}

export default Answer;
