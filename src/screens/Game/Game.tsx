import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'

import styles from './Game.module.css';
import { Chat, Header, Matrix } from '../../components';
import { vars } from '../../SocketIO'
import { clearInterval } from 'timers';

export interface IGameProps extends RouteComponentProps {}

export interface IGameState {
    counter: number | undefined,
    countdown: NodeJS.Timeout | undefined
}

export class Game extends React.Component<IGameProps, IGameState> {
    constructor(props: IGameProps) {
        super(props)

        this.state = {
            counter: 0,
            countdown: undefined
        }
    }

    componentDidMount = () => {
        if(this.state.countdown) clearInterval(this.state.countdown)
        this.setState({ 
            counter: vars.ROUND_TIMEOUT, 
            countdown: setInterval(() => {
                if(this.state.counter !== undefined) {
                    if(this.state.counter >= 0) {
                        this.setState({
                            ...this.state,
                            counter: this.state.counter ? this.state.counter - 1000 : 0
                        })
                    } else {
                        if(this.state.countdown) clearInterval(this.state.countdown)
                        this.setState({
                            counter: 0,
                            countdown: undefined
                        })
                    }
                }
            }, 1000) 
        })
    }

    public render() {
        return (
            <div>
                <Header />
                <div className={styles['container']}>
                    <div className={ styles['HUD'] }>
                        <div className={ styles['userInfo'] }>
                            <h1>You are the Imposter!</h1>
                            <p>
                                Try your best to blend in with the others and
                                guess the location.
                            </p>
                        </div>
                        <div>
                            <button className={ styles['userActionBtn'] }>
                                Call a meeting!
                            </button>
                            <button className={ styles['userActionBtn'] }>
                                Guess the location!
                            </button>
                        </div>
                    </div>
                    <div className={ styles['timer'] }>
                        <div className={ styles['timeDisplay'] }>
                            <h1>
                                { 
                                    this.state.counter
                                    ? Math.trunc(this.state.counter / 60000).toString().padStart(2, '0')
                                    : '00'
                                }
                            </h1>
                            <p>Minutes</p>
                        </div>
                        <div className={ styles['timeDisplay'] }>
                            <h1>
                                { 
                                    this.state.counter
                                    ? Math.trunc(this.state.counter / 1000 % 60).toString().padStart(2, '0')
                                    : '00'
                                }
                            </h1>
                            <p>Seconds</p>
                        </div>
                    </div>
                    <div className={ styles['gameMatrix'] }>
                        <Matrix/>
                    </div>
                    <div className={ styles['chat'] }>
                        {/* Need a prop to pass isMessagingAllowed?: boolean */}
                        <Chat lobby={ false } showInput={ false }/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Game)
