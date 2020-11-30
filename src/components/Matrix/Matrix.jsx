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
                short_id: vars.game.short_id,
                round_id: vars.round._id
            })
        })

        gameIO.on('finalGuessResAll', data => {
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

    handleResize = e => {

    }

    updateGuess = (k, mark) => {
        gameIO.emit('updateGuess', { 
            short_id: vars.game.short_id, 
            guess_id: vars.tempGuesses[k]._id, 
            type: mark
        })
    }

    handleFinalGuess = (k) => {
        gameIO.emit('finalGuess', {
            short_id: vars.game.short_id, 
            player_id: vars.player._id,
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
                    tempGuess={ tempGuesses[index].type }
                    markChanged={ mark => this.updateGuess(index, mark) }
                    isFinalGuessTime={ this.props.isFinalGuessTime }
                    finalGuessed={ () => this.handleFinalGuess(index) }
                    key={ index }
                />
            :   <Cell isImposter={ false }
                    name={ location.name }
                    image={ location.image }
                    isJackpot={ location.name === vars.location.name }
                    key={ index }
                />
            matrix.push(cell)
        })

        return (<div className={ styles['container'] }>{ matrix }</div>)
    }
}

export default withRouter(Matrix)
