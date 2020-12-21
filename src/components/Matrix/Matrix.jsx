import React from 'react'
import { withRouter } from 'react-router-dom'

import styles from './Matrix.module.css'
import { vars, gameIO } from '../../SocketIO'
import Cell from '../Cell/Cell'

export class Matrix extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: 2,
            columns: 7
        }
    }

    componentDidMount = () => {        
        gameIO.on('updateGuessRes', data => {
            console.log('Matrix_updateGuessRes', data)
        })

        gameIO.on('finalGuessRes', data => {
            console.log('Matrix_finalGuessRes', data)

            if(!data.error) gameIO.emit('leaderboard', {
                shortId: vars.game.shortId,
            })
        })

        gameIO.on('finalGuessResAll', data => {
            console.log('Matrix_finalGuessResAll', data)

            if(!data.error) gameIO.emit('leaderboard', {
                shortId: vars.game.shortId,
            })
        })
    }

    componentWillUnmount = () => {
        gameIO.off('updateGuessRes')
        gameIO.off('finalGuessRes')
        gameIO.off('finalGuessResAll')
        this.setState = () => {}
    }

    updateGuess = (k, mark) => {
        gameIO.emit('updateGuess', { 
            shortId: vars.game.shortId, 
            tempGuessIndex: k, 
            type: mark
        })
    }

    handleFinalGuess = (k) => {
        console.log('handleFinalGuess')
        gameIO.emit('finalGuess', {
            shortId: vars.game.shortId, 
            playerId: vars.player._id,
            name: vars.round.tiles.locations[k].name
        })
    }

    render() { 
        const tempGuesses = vars.tempGuesses
        const locations = vars.round.tiles.locations

        const matrix = []
        locations.forEach((location, index) => {
            const cell = vars.player.isImposter
                ?   <Cell isImposter={ true }
                        name={ location.name }
                        image={ location.image }
                        tempGuess={ tempGuesses[index] }
                        markChanged={ mark => this.updateGuess(index, mark) }
                        isFinalGuessTime={ this.props.isFinalGuessTime }
                        finalGuessed={ () => this.handleFinalGuess(index) }
                        key={ index }
                    />
                :   <Cell isImposter={ false }
                        name={ location.name }
                        image={ location.image }
                        isJackpot={ location._id === vars.location }
                        key={ index }
                    />
            matrix.push(cell)
        })

        return (<div className={ styles['container'] }>{ matrix }</div>)
    }
}

export default withRouter(Matrix)
