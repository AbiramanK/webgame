import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import styles from './Cell.module.css'
import { Colors } from '../../Colors'

export interface ICellProps extends RouteComponentProps {
    isImposter: boolean,
    isJackpot?: boolean,
    name?: string,
    image?: string,
    tempGuess?: 'NOTHING' | 'Q-MARK' | 'X-MARK',
    markChanged?: (mark: 'NOTHING' | 'Q-MARK' | 'X-MARK') => void
}

export interface ICellState {
    mark: 'NOTHING' | 'Q-MARK' | 'X-MARK',
    mouseOver: boolean,
}

export class Cell extends React.Component<ICellProps, ICellState> {
    constructor(props: ICellProps) {
        super(props);

        this.state = {
            mark: props.tempGuess ? props.tempGuess : 'NOTHING',
            mouseOver: false
        }
    }

    handleChange = (mark: 'NOTHING' | 'Q-MARK' | 'X-MARK') => {
        this.setState({ ...this.state, mark })
        if(this.props.markChanged) this.props.markChanged(mark)
    }
 
    public render() {
        return (
            <>
                {
                    this.props.isImposter 
                    ? this.ifImposter()
                    : this.ifNotImposter()
                }
            </>
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
                        this.state.mark === 'NOTHING'
                        ? this.state.mouseOver
                            ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                        : this.state.mouseOver
                            ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                            : { opacity: 0.0, backgroundColor: Colors.SECONDARY_LIGHT }
                    }
                    onClick={ () => this.handleChange('NOTHING') }
                ></div>
                <div className={ styles['q-mark'] } 
                    style={ 
                        this.state.mark === 'Q-MARK'
                        ? this.state.mouseOver
                            ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                        : this.state.mouseOver
                            ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                            : { opacity: 0.0, backgroundColor: Colors.SECONDARY_LIGHT }
                    }
                    onClick={ () => this.handleChange('Q-MARK') }
                >?</div>
                <div className={ styles['x-mark'] } 
                    style={ 
                        this.state.mark === 'X-MARK'
                        ? this.state.mouseOver
                            ? { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                            : { opacity: 1.0, backgroundColor: Colors.SECONDARY }
                        : this.state.mouseOver
                            ? { opacity: 1.0, backgroundColor: Colors.SECONDARY_LIGHT }
                            : { opacity: 0.0, backgroundColor: Colors.SECONDARY_LIGHT }
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
                    ? { boxShadow: `0 0 0 3px ${Colors.BACKGROUND}, 0 0 0 6px ${Colors.PRIMARY}` }
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
