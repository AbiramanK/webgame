import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Row, Col } from 'antd'

import { vars } from '../../SocketIO'
import Cell from '../Cell/Cell'

export interface IMatrixProps extends RouteComponentProps {}

export interface IMatrixState {}

export class Matrix extends React.Component<IMatrixProps, IMatrixState> {
    constructor(props: IMatrixProps) {
        super(props);

        this.state = {}
    }

    public render() {
        const rows = vars.round.tiles.rows
        const columns = vars.round.tiles.columns
        const isImposter = vars.player.isImposter
        const tempGuesses = vars.tempGuesses
        const locations = vars.round.tiles.locations
        const location = vars.location

        const matrix = []
        if(rows && columns && isImposter) {
            for(let i = 0; i < rows; i += 1) {
                const row = []
                for(let j = 0; j < columns; j += 1) {
                    const cell = isImposter
                        ?   <Cell isImposter={ true }
                                tempGuess={ tempGuesses[i][j].type }
                                markChanged={ (mark: 'NOTHING' | 'Q-MARK' | 'X-MARK') => console.log(mark) }
                            />
                        :   <Cell isImposter={ false }
                                name={ locations[i][j].name }
                                image={ locations[i][j].image }
                                isJackpot={ location.position.i === i && location.position.j === j }
                            />
                    row.push(<Col>{ cell }</Col>)
                }
                matrix.push(<Row>{ row }</Row>)
            }
        }

        return (<div>{ matrix }</div>)
    }
}

export default withRouter(Matrix)
