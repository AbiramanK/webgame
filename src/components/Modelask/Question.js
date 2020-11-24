import React from "react";
import { Modal, Button, Input, Select } from "antd";
import "./Question.css";
import { Colors } from "../../Colors";

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: this.props.show };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
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
        {this.showModal && (
          <Modal
            className="Model-Que"
            title="Your turn to ask a question!"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button
                style={{
                  backgroundColor: Colors.PRIMARY,
                  color: Colors.WHITE,
                  borderRadius: "5px",
                }}
                onClick={this.handleCancel}
              >
                Skip
              </Button>,
            ]}
            width={700}
          >
            <h3>Who whould you like to ask?</h3>
            <div
              className="name-inputs"
              style={{ display: "flex", padding: "10px 0px" }}
            >
              <Input.Group compact>
                <Select defaultValue="Option-1" style={{ width: "90%" }}>
                  <Option value="Option-1">James</Option>
                  <Option value="Option-2">Michal</Option>
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
            <h3>What whould you like to ask?</h3>
            <Input placeholder="Type your Question here..." />
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
              >
                Ask
              </Button>
            </div>
          </Modal>
        )}
      </>
    );
  }
}

// .antModalHeader {
//   background-color: aqua;
//   padding: 10px 18px 10px 10px;
// }

export default Question;
