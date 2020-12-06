import React from "react";
import { Modal, Button, Input, Select, Tooltip } from "antd";
import "./Question.css";
import { Colors } from "../../Colors";
import { vars } from '../../SocketIO'
import popup from '../../assets/popup.mp3'

class Question extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      player_id: vars.game.players.find(player => player._id !== vars.player._id)._id,
      question: '',
      count: undefined, //Math.trunc((props.askTimeout - Date.now().valueOf()) / 1000),
      counter: undefined,
      show: true
    }
  }

  componentDidMount = () => {
    /*
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

    window.addEventListener('keypress', this.handleEnterPress)
  }

  componentWillUnmount = () => {
    //clearInterval(this.state.counter)
    this.setState = () => {}

    window.removeEventListener('keypress', this.handleEnterPress)

    document.body.style.overflow = 'auto'
  }

  handleEnterPress = e => {
    if(e.code === 'Enter') this.handleOk()
  }

  handleOk = () => {
    this.setState({ ...this.state, show: false })

    this.props.handleAsk(this.state)
  }

  handleCancel = () => {
    this.setState({ ...this.state, show: false })
    
    this.props.handleCancel()
  }

  render() {    
    return (
      <Modal
        className="Model-Que"
        visible={ this.state.show }
        onOk={ this.handleOk }
        onCancel={ this.handleCancel }
        closable={ null }
        title={ this.returnTitle() }
        footer={ this.returnFooter() }
        width={ 700 }
      >
        <audio style={{ display: 'none' }} preload="auto" autoPlay src={ popup }/> 
        { !vars.player.isImposter && this.returnHeader() }
        <h3>Who would you like to ask?</h3>
        { this.returnInputGroup() }
        <h3>What would you like to ask?</h3>
        <Input 
          placeholder="Type your Question here..." 
          onChange={ e => this.setState({ ...this.state, question: e.target.value }) }
        />
        { this.returnButton() }
        { this.returnTooltip() }
      </Modal>
    )
  }

  returnButton = () => {
    const conatinerStyle = {
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      padding: "10px",
      color: Colors.WHITE,
    }
    const buttonStyle = {
      backgroundColor: Colors.PRIMARY,
      color: Colors.WHITE,
      marginTop: "30px",
      padding: "0 30px",
      borderRadius: "5px",
    }
    return (
      <div style={ conatinerStyle }>
        <Button
          size="large"
          style={ buttonStyle }
          onClick={ this.handleOk }
        >
          Ask
        </Button>
      </div>
    )
  }

  returnHeader = () => {
    return (
      <h3 style={{ color: Colors.PRIMARY }}>
        <span style={{ fontWeight: 400, color: 'black' }}>
          The location is:
        </span> { vars.location.name }
      </h3>
    )
  }

  returnInputGroup = () => {
    const iconStyle = { 
      transform: 'rotate(180deg)',
      fontSize: '20px', 
      lineHeight: '7px' 
    }
    return (
      <div
        className="name-inputs"
        style={{ display: "flex", padding: "10px 0px" }}
      >
        <Input.Group compact>
          <Select 
            defaultValue={ this.state.player_id } 
            style={{ width: "90%" }}
            onChange={ e => this.setState({ ...this.state, player_id: e }) }
            suffixIcon={ <div style={ iconStyle }> ^ </div> }
          >
            {
              vars.game.players.map(player => {
                return (
                  player._id !== vars.player._id && 
                  <Select.Option 
                    value={ player._id } 
                    key={ player._id }
                  >
                    { player.name }
                  </Select.Option>
                )
              })
            }
          </Select>
        </Input.Group>
      </div>
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
        Your turn to ask a question!
        <div style={ counterStyle }>
          { /** `${this.state.count.toString().padStart(2, '0')}s` */ }
        </div>
      </div>
    )
  }

  returnFooter = () => {
    return (
      <Button
        style={{
          backgroundColor: Colors.PRIMARY,
          color: Colors.WHITE,
          borderRadius: "5px",
        }}
        onClick={ this.handleCancel }
      >
        Skip
      </Button>
    )
  }

  returnTooltipTitle = () => {
    const ulStyle = { 
      padding: 0, 
      margin: 0, 
      color: Colors.WHITE, 
      listStyle: 'none' 
    }
    const liStyle = {
      fontSize: '16px', 
      margin: 0, 
      textAlign: 'center' 
    }
    const divStyle = {
      height: '0.5px', 
      background: Colors.WHITE, 
      margin: '10px 0' 
    }
    return (
      <ul style={ ulStyle }>
        <li style={ liStyle }>
          Is this place safe for kids ?
        </li>
        <div style={ divStyle }/>
        <li style={ liStyle }>
          Would you go on a vacation here ?
        </li>
      </ul>
    )
  }

  returnTooltip = () => {
    const h3Style = {
      display: "inline",
      color: Colors.PRIMARY,
      cursor: "pointer",
    }
    return (
      <Tooltip
          title={ this.returnTooltipTitle() }
          placement="right"
          color={ Colors.SECONDARY }
          trigger="click"
        >
          <h3 style={ h3Style }>
            Click here for suggestion!
          </h3>
        </Tooltip>
    )
  }
} 

export default Question;
