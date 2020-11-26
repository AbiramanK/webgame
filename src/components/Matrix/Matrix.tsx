import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Row, Col } from 'antd'

import { vars, gameIO } from '../../SocketIO'
import Cell from '../Cell/Cell'

export interface IMatrixProps extends RouteComponentProps {
    isFinalGuessTime: boolean
}

export interface IMatrixState {}

export class Matrix extends React.Component<IMatrixProps, IMatrixState> {
    constructor(props: IMatrixProps) {
        super(props);

        this.state = {}
    }

    componentDidMount = () => {
        gameIO.on('updateGuessRes', (data: any) => {
            console.log('Matrix_updateGuessRes', data)
        })

        gameIO.on('finalGuessRes', (data: any) => {
            console.log('Matrix_finalGuessRes', data)

            if(!data.error) gameIO.emit('leaderboard', {
                short_id: vars.game.short_id,
                round_id: vars.round._id
            })
        })

        gameIO.on('finalGuessResAll', (data: any) => {
            console.log('Matrix_finalGuessResAll', data)

            if(!data.error) gameIO.emit('leaderboard', {
                short_id: vars.game.short_id,
                round_id: vars.round._id
            })
        })
    }

    componentWillUnmount = () => {
        gameIO.off('updateGuessRes')
        gameIO.off('finalGuessRes')
        gameIO.off('finalGuessResAll')
        gameIO.off('leaderboardRes')
        this.setState = () => {}
    }

    updateGuess = (i: number, j: number, mark: 'NOTHING' | 'Q-MARK' | 'X-MARK') => {
        gameIO.emit('updateGuess', { 
            short_id: vars.game.short_id, 
            round_id: vars.round._id, 
            guess_id: vars.tempGuesses[i][j]._id, 
            type: mark
        })
    }

    handleFinalGuess = (i: number, j: number) => {
        gameIO.emit('finalGuess', {
            short_id: vars.game.short_id, 
            round_id: vars.round._id, 
            player_id: vars.player._id,
            position: { i, j }
        })
    }

    public render() {
        const rows = vars.round.tiles.rows
        const columns = vars.round.tiles.columns
        const isImposter = vars.player.isImposter
        const tempGuesses = vars.tempGuesses
        const locations = vars.round.tiles.locations
        const location = vars.location

        const matrix = []
        const spanCol = columns ? 24 / columns : 1
        if(rows && columns && isImposter !== undefined) {
            for(let i = 0; i < rows; i += 1) {
                const row = []
                for(let j = 0; j < columns; j += 1) {
                    const cell = isImposter
                        ?   <Cell isImposter={ true }
                                tempGuess={ tempGuesses[i][j].type }
                                markChanged={ (mark: 'NOTHING' | 'Q-MARK' | 'X-MARK') => this.updateGuess(i, j, mark) }
                                isFinalGuessTime={ this.props.isFinalGuessTime }
                                finalGuessed={ () => this.handleFinalGuess(i, j) }
                            />
                        :   <Cell isImposter={ false }
                                name={ locations[i][j].name }
                                image={ locations[i][j].image }
                                isJackpot={ location.position.i === i && location.position.j === j }
                            />
                    row.push(<Col key={ `${i}-${j}` } span={ spanCol }>{ cell }</Col>)
                }
                matrix.push(<Row key={ `${i}` }>{ row }</Row>)
            }
        }

        return (<div>{ matrix }</div>)
    }
}

export default withRouter(Matrix)
