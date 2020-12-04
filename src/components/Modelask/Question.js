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
      question: ''
    }
  }

  componentDidMount = () => {
    window.addEventListener('keypress', this.handleEnterPress)
  }

  componentWillUnmount = () => {
    window.removeEventListener('keypress', this.handleEnterPress)
  }

  handleEnterPress = e => {
    if(e.code === 'Enter') this.props.handleAsk(this.state)
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { Option } = Select;
    const modelStyle = {
      buttonStyle: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        padding: "10px",
        color: Colors.WHITE,
      },
    };

    return (
      <>
      {
        this.showModal && (
          <Modal
            className="Model-Que"
            title="Your turn to ask a question!"
            visible={this.props.show}
            onOk={() => { 
              document.body.style.overflow = 'auto'
              this.props.handleAsk(this.state)
            }}
            onCancel={() => {
              document.body.style.overflow = 'auto'
              this.props.handleCancel()
            }}
            closable={ null }
            footer={[
              <Button
                style={{
                  backgroundColor: Colors.PRIMARY,
                  color: Colors.WHITE,
                  borderRadius: "5px",
                }}
                onClick={() => { 
                  document.body.style.overflow = 'auto'
                  this.props.handleCancel()
                }}
                key="button"
              >
                Skip
              </Button>,
            ]}
            width={700}
          >
            <audio style={{ display: 'none' }} preload="auto" autoPlay src={ popup }/> 
            {
              !vars.player.isImposter &&
              <h3 style={{ color: Colors.PRIMARY }}>
                <span 
                  style={{
                    fontWeight: 400, 
                    color: 'black' 
                  }}
                >
                  The location is:
                </span> { vars.location.name }
              </h3>
            }
            <h3>Who would you like to ask?</h3>
            <div
              className="name-inputs"
              style={{ display: "flex", padding: "10px 0px" }}
            >
              <Input.Group compact>
                <Select defaultValue={ this.state.player_id } 
                  style={{ width: "90%" }}
                  onChange={ e => this.setState({ ...this.state, player_id: e }) }
                  suffixIcon={ 
                    <div style={{ transform: 'rotate(180deg)', fontSize: '20px', lineHeight: '7px' }}> ^ </div>
                   }
                >
                  {
                    vars.game.players.map(player => {
                      return player._id !== vars.player._id 
                      && <Option value={ player._id } key={ player._id }>{ player.name }</Option>
                    })
                  }
                </Select>
              </Input.Group>
            </div>
            <h3>What would you like to ask?</h3>
            <Input placeholder="Type your Question here..." 
              onChange={ e => this.setState({ ...this.state, question: e.target.value }) }
            />
            <div style={modelStyle.buttonStyle}>
              <Button
                size="large"
                style={{
                  backgroundColor: Colors.PRIMARY,
                  color: Colors.WHITE,
                  marginTop: "30px",
                  padding: "0 30px",
                  borderRadius: "5px",
                }}
                onClick={() => { 
                  document.body.style.overflow = 'auto'
                  this.props.handleAsk(this.state)
                }}
              >
                Ask
              </Button>
            </div>
            <Tooltip
              title={
                <ul style={{ padding: 0, margin: 0, color: Colors.WHITE }}>
                  <li style={{ fontSize: '16px', margin: 0, textAlign: 'center' }}>
                    Is this place safe for kids ?
                  </li>
                  <div style={{ height: '0.5px', background: Colors.WHITE, margin: '10px 0' }}/>
                  <li style={{ fontSize: '16px', margin: 0, textAlign: 'center' }}>
                    Would you go on a vacation here ?
                  </li>
                </ul>
              }
              placement="right"
              color={ Colors.SECONDARY }
              trigger="click"
            >
              <h3 style={{
                  display: "inline",
                  color: Colors.PRIMARY,
                  cursor: "pointer",
                }}
              >
                Click here for suggestion!
              </h3>
            </Tooltip>
          </Modal>
        )
        }
      </>
    )
  }
}

export default Question;
