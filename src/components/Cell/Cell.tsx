import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import styles from './Cell.module.css'
import { vars } from '../../SocketIO'

export interface ICellProps extends RouteComponentProps {}

export interface ICellState {}

export class Cell extends React.Component<ICellProps, ICellState> {
    constructor(props: ICellProps) {
        super(props);

        this.state = {}
    }

    public render() {
        return (
            <div className={ styles['container'] }>
                {
                    vars.player.isImposter 
                    ? this.ifImposter()
                    : this.ifNotImposter()
                }
            </div>
        )
    }

    ifImposter = () => {
        return (
            <div></div>
        )
    }

    ifNotImposter = () => {
        return <div></div>
    }
}

export default withRouter(Cell)
