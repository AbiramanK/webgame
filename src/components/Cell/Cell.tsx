import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import styles from './Cell.module.css'
import { Colors } from '../../Colors'

export interface ICellProps extends RouteComponentProps {
    isImposter: boolean
    markChanged: (mark: 'NOTHING' | 'Q-MARK' | 'X-MARK') => void
}

export interface ICellState {
    mark: 'NOTHING' | 'Q-MARK' | 'X-MARK',
    mouseOver: boolean,
}

export class Cell extends React.Component<ICellProps, ICellState> {
    constructor(props: ICellProps) {
        super(props);

        this.state = {
            mark: 'NOTHING',
            mouseOver: false
        }
    }

    handleChange = (mark: 'NOTHING' | 'Q-MARK' | 'X-MARK') => {
        this.setState({ ...this.state, mark })
        this.props.markChanged(mark)
    }

    public render() {
        return (
            <div className={ styles['container'] } 
                onMouseOver={ () => this.setState({ ...this.state, mouseOver: true }) }
                onMouseLeave={ () => this.setState({ ...this.state, mouseOver: false }) }
            >
                {
                    this.props.isImposter 
                    ? this.ifImposter()
                    : this.ifNotImposter()
                }
            </div>
        )
    }

    ifImposter = () => {
        return (
            <>
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
            </>
        )
    }

    ifNotImposter = () => {
        return <div></div>
    }
}

export default withRouter(Cell)
