import React from "react";
import { Modal} from "antd";
import "./voting.css";
import { Colors } from "../../../Colors";
import { gameIO, vars } from '../../../SocketIO'

class Voting extends React.Component {
  constructor(props) {
    super(props)

    let votedTo 
    if(vars.round.meeting) {
      const vote = vars.round.meeting.votes.find(v => v.from === vars.player._id)
      if(vote) {
        votedTo = vote.to
      }
    }
      
    this.state = { 
      voted: votedTo ? true : false,
      data: vars.game.players.map(p => ({
          playerId: p._id,
          name: p.name,
          isVoted: p._id === votedTo ? true : false,
          score: 0
      })),
      timer: undefined,
    }
  }
 
  componentDidMount = () => {

    gameIO.on('voteRes', data => {
      console.log('Voting_gameIO_voteRes', data)

      if(!this.state.voted) this.props.handleCancel()

      if(!data.error) {
        if(data.meetingCompleted) {
          if(data.meetingSkipped) {
            vars.round.meeting = undefined
            this.props.handleCancel()
          } else {
            vars.round.meeting.votes = data.votes

            const dataObj = this.state.data 
            dataObj.forEach((d, i) => {
              const count = data.counts.find(dd => dd.playerId === d.playerId)
              dataObj[i].score = count.votes
            })

            this.setState({ ...this.state, data: dataObj, timer: 1 })
            setInterval(() => {
              this.setState({ ...this.state, timer: this.state.timer + 1 })
            }, 1000)

            setTimeout(() => {
              gameIO.emit('leaderboard', {
                  shortId: vars.game.shortId,
              })
            }, 5000)
          }
        } 
      }
    })

    gameIO.on('voteResAll', data => {
      console.log('Voting_gameIO_voteResAll', data)

      if(!data.error) {
        if(data.meetingCompleted) {
          if(data.meetingSkipped) {
            vars.round.meeting = undefined
            this.props.handleCancel()
          } else {
            vars.round.meeting.votes = data.votes

            const dataObj = this.state.data 
            dataObj.forEach((d, i) => {
              const count = data.counts.find(dd => dd.playerId === d.playerId)
              dataObj[i].score = count.votes
            })

            console.log('dataObj', dataObj)

            this.setState({ ...this.state, data: dataObj, timer: 1 })
            setInterval(() => {
              this.setState({ ...this.state, timer: this.state.timer + 1 })
            }, 1000)

            setTimeout(() => {
              gameIO.emit('leaderboard', {
                  shortId: vars.game.shortId,
              })
            }, 5000)
          }
        } 
      }
    })

    this.playAudio()
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.show && this.props.show !== prevProps.show) {
      let votedTo 
      if(vars.round.meeting) {
        const vote = vars.round.meeting.votes.find(v => v.from === vars.player._id)
        if(vote) {
          votedTo = vote.to
        }
      }
        
      this.setState({ 
        voted: votedTo ? true : false,
        data: vars.game.players.map(p => ({
            playerId: p._id,
            name: p.name,
            isVoted: p._id === votedTo ? true : false,
            score: 0
        })),
        timer: undefined,
      })
    }
  }

  componentWillUnmount = () => {
    gameIO.off('voteRes')
    gameIO.off('voteResAll')
    this.setState = () => {}
    setTimeout(() => document.body.style.overflow = 'auto', 0)
  }

  playAudio = () => {
    const audio = document.getElementById('popup-audio')
    audio.currentTime = 0
    audio.play()
  }

  changeVote = (el) => {
    const data = this.state.data
    data[el].isVoted = true
    this.setState({ 
      ...this.state,
      data, 
      voted: true,
    })
    gameIO.emit('vote', {
      shortId: vars.game.shortId,
      from: vars.player._id,
      to: data[el].playerId
    })
  }

  handleOk = () => {
    document.body.style.overflow = 'auto'
  }

  handleCancel = () => {
    this.setState({ 
      ...this.state,
      voted: true,
    })
    gameIO.emit('vote', {
      shortId: vars.game.shortId,
      from: vars.player._id,
    })
  }

  render() {
    const header = {
      "color": "aliceblue",
      "backgroundColor": "#440088",
      "textAlign": "center",
      "padding": "15px 30px",
      "fontWeight": "600",
      "fontSize": "1.2rem",
      "position": "relative",
    }
    const timer = {
      "position": "absolute",
      "top": "50%",
      "transform": "translateY(-50%)",
      "left": "20px"
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
      <Modal
        bodyStyle={{ padding: "0px", margin: "0px"}}
        className={ "Vote-pannel-model-wraper" }
        title=""
        visible={ this.props.show }
        onOk={ this.handleOk }
        onCancel={ this.props.handleCancel }
        closable={ this.state.voted && !this.state.timer }
        footer={ null }
        head={ null }
        width={ 450 }
        maskClosable={ false }
      >
        <div style={header}>
            { `${this.props.caller} has called a meeting` }
            {
              this.state.timer &&
              <span style={timer}>
                { `${this.state.timer}s` }
              </span>
            }
        </div>
        <ul style={{padding: "0px"}}>
          {this.state.data.map((e, el) => {
            return (
              <li key={el} style={playerLi}>
                <span>{e.name}</span>
                <div>
                  <span style={{ fontWeight: 400, marginRight: '20px'}}>
                    { this.state.timer && e.score }
                  </span>
                  {
                    e.playerId === vars.player._id
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
    )
  }
}

export default Voting;
