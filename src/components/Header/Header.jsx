import React from 'react';
import { withRouter } from 'react-router-dom'
import { PageHeader, Button, Modal } from 'antd';

import styles from './Header.module.css'
import logo from '../../assets/afino_name.svg'


export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false
    }
  }

  returnUIInstruction = () => (
    <ul className={ styles['list'] }>
      <li>
        To begin the game, enter your information and click Join.
      </li>
      <li>
        If you would like somebody new to join the game, copy the link in the top left and send it to them.
      </li>
      <li>
        Click Ready and wait for the host to begin the game once everybody is in.
      </li>
      <li>
        In the game:
        <ul className={ styles['list'] }>
          <li>
            There are 6 rounds. Each round, one secret imposter is randomly designated, and does not know the location. Everybody else in the game knows what the location is.
          </li>
          <li>
            Players are prompted to ask questions. When it is your turn to ask, choose a player you would like to ask. 
          </li>
          <li>
            Players try to expose the imposter by strategically asking questions that do not give away the exact location to the imposter but would challenge the imposter to answer.
          </li>
          <li>
            Players try to figure out who the imposter is, while the imposter looks to figure out what the location is by eliminating location cards on their screen.
          </li>
          <li>
            At any time, the imposter may guess the location, however the round ends regardless of whether they are correct or not.
          </li>
          <li>
            At any time, a player can call a meeting and players vote on who they think the imposter is. The round ends regardless of the outcome.
          </li>
        </ul>
      </li>
      <li>
        Scoring:
        <ul className={ styles['list'] }>
          <li>
            The imposter is awarded 400 points if they guess the location correctly, or the wrong person is voted out. If the round ends on its own without any voting, they are awarded 100 points.
          </li>
          <li>
            The rest of the participants are awarded 100 points if they successfully vote out the imposter. The person who called the meeting is awarded 200 points.
          </li>
        </ul>
      </li>
    </ul>
  )
  
  render() {
    return (
      <div className={ styles['header-wrapper'] }>
        <PageHeader
          ghost={ true }
          title={ <img alt="" src={ logo } className={ styles['title'] }/> }
          extra={
            <Button 
              className={ styles['instruction-button'] } 
              type="text" 
              key="instruction"
              onClick={ () => this.setState({ ...this.state, showModal: true }) }
            >
              Instructions
            </Button>
          }
        >
        </PageHeader>
        <Modal 
            title="Instructions" 
            visible={ this.state.showModal }
            onCancel={ () => this.setState({ ...this.state, showModal: false }) }
            footer={ null }
        >
          { this.returnUIInstruction() }
        </Modal>
      </div>
    );
  }
}

export default withRouter(Header)
