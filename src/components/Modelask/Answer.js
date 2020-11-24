import React from "react";
import { Modal, Button, Input } from "antd";
import "./Answer.css";
import { Colors } from "../../Colors";

class Answer extends React.Component {
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
    const modelStyle = {
      buttonStyle: {
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        color: Colors.WHITE,
      },
    };

    return (
      <>
        {/* {<Button type="primary" onClick={this.showModal}>
          Open Modal
        </Button> */}
        {this.showModal && (
          <Modal
            className="Model-Ans"
            title="James Asked You a Question"
            visible={this.state.visible}
            style={{ borderRadius: "10px" }}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={[
              <Button
                size="middle"
                style={{ backgroundColor: Colors.PRIMARY, color: Colors.WHITE }}
                onClick={this.handleCancel}
              >
                Skip
              </Button>,
            ]}
            width={700}
          >
            <h3 style={{ color: "#000000" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et?
            </h3>
            <h3>How do You Respond?</h3>
            <Input placeholder="Type your answer here..." />
            <div style={modelStyle.buttonStyle}>
              <Button
                size="large"
                style={{
                  backgroundColor: Colors.PRIMARY,
                  color: Colors.WHITE,
                  marginTop: "30px",
                  padding: "0 30px",
                }}
              >
                Answer
              </Button>
            </div>
          </Modal>
        )}
      </>
    );
  }
}


export default Answer;
