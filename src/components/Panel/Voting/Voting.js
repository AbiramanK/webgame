import React from "react";
import { Modal} from "antd";
import "./voting.css";
import { Colors } from "../../../Colors";

class Voting extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: true,
      voted: false,
      data: [
        { name: "James", isVoted:false},
        { name: "Bobby", isVoted:false},
        { name: "Alax", isVoted:false},
        { name: "Sam", isVoted:false},
        { name: "Sarah", isVoted:false},
        { name: "Bill", isVoted:false},
        { name: "Kim", isVoted:false},
      ] 
    };
  }
  componentDidMount=()=>{
  this.state.data.forEach((e,el)=>{
    if(e.isVoted){
      this.setState({
        voted: true
      })
    }
  })
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  changeVote = (el) => {
    // console.log(this.state.data)
    const data = this.state.data
    data[el].isVoted = true;
    this.setState({
      data: [...data ], voted: true
    })
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

    const header ={
      "color": "aliceblue",
      "backgroundColor": "#440088",
      "textAlign": "center",
      "padding": "15px",
      "fontWeight": "600",
      "fontSize": "1.2rem",
    }
    const playerLi = {
     "fontWeight": "600",
      "fontSize": "1rem",
      "listStyle": "none",
      "display": "flex",
      "justifyContent": "space-between",
      "alignItems": "center",
      "padding": "10px 30px",
      "borderBottom": "1px solid #D3D3D3",
    }

    const skipButton ={
      "fontSize": "1.2rem",
      "fontWeight": "600",
      "padding": "10px 0px",
      "textAlign": "center",
      "borderRadius": "10px",
      "marginTop": "30px",
      "cursor": "pointer",
      "color": Colors.LAWNGREEN
      
    }
    return (
      <>
        {this.showModal && (
         
            <Modal
              bodyStyle={{ padding: "0px", margin: "0px"}}
              className={"Vote-pannel-model-wraper"}
              title=""
              visible={this.state.visible}
              onOk={this.handleOk}
              closable={false}
              footer={null}
              head={null}
              width={300}
            >
              <div style={header}>
                  Sarah Called a Meeting!
                </div>
              <ul style={{padding: "0px"}}>
                {this.state.data.map((e, el) => {
                  return (
                    <li key={el} style={playerLi}>
                      <span>{e.name}</span>
                      {!this.state.voted ? (
                        <span
                          style={{ cursor: "pointer", color: Colors.RED }}
                          onClick={()=>this.changeVote(el)}
                        >
                          Vote
                        </span>
                      ) : (
                        <span
                          style={e.isVoted ? { cursor: "pointer", color: Colors.LAWNGREEN } : {  color: Colors.GREY }}
                        >
                          Vote
                        </span>
                      )}
                    </li>
                  );
                })}
                <div
                  
                  style={skipButton}
                  onClick={this.handleCancel}
                >
                  Vote to Skip
                </div>
              </ul>
            </Modal>
        
        )}
      </>
    );
  }
}

export default Voting;
