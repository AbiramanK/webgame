import React from "react";
import { Modal, Button, Input } from "antd";
import "./Answer.css";
import { Colors } from "../../Colors";
import popup from '../../assets/popup.mp3'

class Answer extends React.Component {
  constructor(props) {
    super(props);

    this.state = { 
      answer: '',
      count: undefined, //Math.trunc((props.answerTimeout - Date.now().valueOf()) / 1000),
      counter: undefined,
      show: true
    };
  }

  componentDidMount = () => {
    /**
    const counter = setInterval(() => {
      if(this.state.count > 0) {
        const count = this.state.count - 1
        this.setState({ ...this.state, count })        
      } else {
        clearInterval(this.state.counter)
        this.setState({ ...this.state, show: false })
      }
    }, 1000)
    this.setState({ ...this.state, counter })
    */
    this.playAudio()

    document.getElementById('popup-audio').play()
  }

  componentWillUnmount = () => {
    //clearInterval(this.state.counter)
    this.setState = () => {}

    setTimeout(() => document.body.style.overflow = 'auto', 0)
  }

  playAudio = () => {
    const audio = document.getElementById('popup-audio')
    audio.currentTime = 0
    audio.play()
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
        <audio style={{ display: 'none' }} preload="auto" autoPlay src={ popup }/> 
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
    const counterStyle = { 
      position: 'absolute', 
      right: 0, 
      top: 0 
    }
    return (
      <div style={ titleStyle }>
        { `${this.props.from.name} asked you a question` }
        <div style={ counterStyle }>
          { /** `${this.state.count.toString().padStart(2, '0')}s` */ }
        </div>
      </div>
    )
  }

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
