import React from "react";
import { Modal} from "antd";
import "./voting.css";
import { Colors } from "../../../Colors";
import { gameIO, vars } from '../../../SocketIO'

class Voting extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: true,
      voted: false,
      data: vars.game.players.map(player => {
        const count = props.counts.find(c => {
          return c.player_id === player._id
        })
        return {
          player_id: player._id,
          name: player.name,
          isVoted: false,
          score: count ? count.votes : 0
        }
      })
    };
  }

  componentDidMount=()=>{
    this.state.data.forEach((e)=>{
      if(e.isVoted){
        this.setState({
          voted: true
        })
      }
    })
  }

  componentDidUpdate = (prevProps) => {
    if(prevProps.counts !== this.props.counts) {
      const data = this.state.data 
      const newData = data.map(elem => {
        const player = this.props.counts.find(k => {
          return k.player_id === elem.player_id
        })

        if(player) elem.score = player.votes 

        return elem
      })

      this.setState({ ...this.state, newData })
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  changeVote = (el) => {
    const data = this.state.data
    data[el].isVoted = true;
    this.setState({
      data: [...data ], voted: true
    })
    gameIO.emit('vote', {
      short_id: vars.game.short_id,
      round_id: vars.round._id,
      by: {
        player_id: vars.player._id
      },
      for: {
        player_id: data[el].player_id
      }
    })
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });
    document.body.style.overflow = 'auto'
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
    gameIO.emit('vote', {
      short_id: vars.game.short_id,
      round_id: vars.round._id,
      by: {
        player_id: vars.player._id
      },
      for: {
        player_id: -1
      }
    })
    this.props.handleCancel()
    document.body.style.overflow = 'auto'
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
        {
          this.showModal && (
            <Modal
              bodyStyle={{ padding: "0px", margin: "0px"}}
              className={"Vote-pannel-model-wraper"}
              title=""
              visible={this.state.visible}
              onOk={this.handleOk}
              closable={this.state.voted}
              footer={null}
              head={null}
              width={450}
            >
              <div style={header}>
                  { `${this.props.caller} has called a meeting` }
              </div>
              <ul style={{padding: "0px"}}>
                {this.state.data.map((e, el) => {
                  return (
                    <li key={el} style={playerLi}>
                      <span>{e.name}</span>
                      <div>
                        <span style={{ fontWeight: 400, marginRight: '20px'}}>
                          { e.score }
                        </span>
                        {
                          e.player_id === vars.player._id
                          ? <span style={{ userSelect: 'none', color: Colors.GREY }}>
                              Vote
                            </span>
                          : !this.state.voted 
                            ? 
                              <span
                                style={{ cursor: "pointer", color: Colors.RED }}
                                onClick={()=>this.changeVote(el)}
                              >
                                Vote
                              </span>
                            : 
                              <span
                                style={
                                  e.isVoted 
                                  ? { userSelect: 'none', color: Colors.LAWNGREEN } 
                                  : { userSelect: 'none', color: Colors.GREY }
                                }
                              >
                                Vote
                              </span>
                        }
                      </div>
                    </li>
                  );
                })}
                {
                  !this.state.voted &&
                  <div
                    style={skipButton}
                    onClick={this.handleCancel}
                  >
                    Vote to Skip
                  </div>
                } 
              </ul>
            </Modal>
        
        )}
      </>
    );
  }
}

export default Voting;
