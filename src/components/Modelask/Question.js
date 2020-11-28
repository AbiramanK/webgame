import React from "react";
import { Modal, Button, Input, Select } from "antd";
import "./Question.css";
import { Colors } from "../../Colors";
import { vars } from '../../SocketIO'

class Question extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      player_id: vars.game.players.find(player => player._id !== vars.player._id)._id,
      question: ''
    }
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
            <h3>Who would you like to ask?</h3>
            <div
              className="name-inputs"
              style={{ display: "flex", padding: "10px 0px" }}
            >
              <Input.Group compact>
                <Select defaultValue={ this.state.player_id } 
                  style={{ width: "90%" }}
                  onChange={ e => this.setState({ ...this.state, player_id: e.target.value }) }
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
              <h3
                style={{
                  width: "300px",
                  color: Colors.PRIMARY,
                  cursor: "pointer",
                }}
              >
                Click here for suggestion!
              </h3>
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
          </Modal>
        )
        }
      </>
    )
  }
}

// .antModalHeader {
//   background-color: aqua;
//   padding: 10px 18px 10px 10px;
// }

export default Question;
