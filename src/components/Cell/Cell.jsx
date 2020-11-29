import React from 'react';
import {  withRouter } from 'react-router-dom';

import styles from './Cell.module.css'
import { Colors } from '../../Colors'

export class Cell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mark: props.tempGuess ? props.tempGuess : 'NOTHING',
            mouseOver: false
        }
    }

    handleChange = mark => {
        this.setState({ ...this.state, mark })
        if(this.props.markChanged) this.props.markChanged(mark)
    }
 
    render() {
        return (
            <div className={ styles['container'] }>
                {
                    this.props.isFinalGuessTime
                    ? this.ifFinalGuessTime()
                    : this.props.isImposter 
                        ? this.ifImposter()
                        : this.ifNotImposter()
                }
            </div>
        )
    }

    ifFinalGuessTime = () => {
        return (
            <div 
                className={ styles['final-guess'] } 
                onClick={ 
                    () => {
                        if(this.props.finalGuessed) {
                            this.props.finalGuessed()
                        }
                    }
                }
            >
                <img alt="" src={ this.props.image } className={ styles['image'] }/>
                <div>{ this.props.name }</div>
            </div>
        )
    }

    ifImposter = () => {
        return (
            <div className={ styles['imposter'] } 
                onMouseOver={ () => this.setState({ ...this.state, mouseOver: true }) }
                onMouseLeave={ () => this.setState({ ...this.state, mouseOver: false }) }
            >
                <div className={ styles['nothing'] } 
                    style={ 
                        window.innerWidth > 425
                        ? this.state.mark === 'NOTHING'
                            ? this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                                : { opacity: 0.0, backgroundColor: Colors.SECONDARY_LIGHT }
                        : this.state.mark === 'NOTHING'
                            ? this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                    }
                    onClick={ () => this.handleChange('NOTHING') }
                >{ this.props.name }</div>
                <img alt="" src={ this.props.image } className={ styles['imposter-image'] }/>
                <div className={ styles['q-mark'] } 
                    style={ 
                        window.innerWidth > 425
                        ? this.state.mark === 'Q-MARK'
                            ? this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                                : { opacity: 0.0, backgroundColor: Colors.SECONDARY_LIGHT }
                        : this.state.mark === 'Q-MARK'
                            ? this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                    }
                    onClick={ () => this.handleChange('Q-MARK') }
                >?</div>
                <div className={ styles['x-mark'] } 
                    style={ 
                        window.innerWidth > 425
                        ? this.state.mark === 'X-MARK'
                            ? this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                                : { opacity: 0.0, backgroundColor: Colors.SECONDARY_LIGHT }
                        : this.state.mark === 'X-MARK'
                            ? this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : this.state.mouseOver
                                ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                                : { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                    }
                    onClick={ () => this.handleChange('X-MARK') }
                >X</div>
            </div>
        )
    }

    ifNotImposter = () => { 
        return (
            <div className={ styles['not-imposter'] }
                style={ 
                    this.props.isJackpot 
                    ? { 
                        boxShadow: `0 0 0 3px ${Colors.BACKGROUND}, 0 0 0 6px ${Colors.PRIMARY}`,
                        background: Colors.PRIMARY 
                    }
                    : {}
                }    
            >
                <img alt="" src={ this.props.image } className={ styles['image'] }/>
                <div>{ this.props.name }</div>
            </div>
        )
    }
}

export default withRouter(Cell)
