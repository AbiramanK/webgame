import React from 'react';

import styles from './Game.module.css';
import { Chat, Header } from '../../components';

// export interface IGameProps extends RouteComponentProps {};

export interface IGameProps {}

/*  Component with State/Props
    React.Component<IChatProps, IChatState>
 */
export class Game extends React.Component {
    public render() {
        const testArr = Array.from(Array(28).keys());
        return (
            <div>
                <Header />
                <div className={styles['container']}>
                    <div className={styles['HUD']}>
                        <div className={styles['userInfo']}>
                            <h1>You are the Imposter!</h1>
                            <p>
                                Try your best to blend in with the others and
                                guess the location.
                            </p>
                        </div>
                        <div>
                            <button className={styles['userActionBtn']}>
                                Call a meeting!
                            </button>
                            <button className={styles['userActionBtn']}>
                                Guess the location!
                            </button>
                        </div>
                    </div>
                    <div className={styles['timer']}>
                        <div className={styles['timeDisplay']}>
                            <h1>05</h1>
                            <p>Minutes</p>
                        </div>
                        <div className={styles['timeDisplay']}>
                            <h1>23</h1>
                            <p>Seconds</p>
                        </div>
                    </div>
                    <div className={styles['gameMatrix']}>
                        {testArr.map((cell) => (
                            <div className={styles['cell']}></div>
                        ))}
                    </div>
                    <div className={styles['chat']}>
                        {/* Need a prop to pass isMessagingAllowed?: boolean */}
                        <Chat join={true} />
                    </div>
                </div>
            </div>
        );
    }
}

export default Game;
