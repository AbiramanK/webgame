import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { PageHeader, Button } from 'antd';

import styles from './Header.module.css'
import logo from '../../assets/afino_name.svg'

export interface IHeaderProps extends RouteComponentProps {}

export interface IHeaderState {}

export class Header extends React.Component<IHeaderProps, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props);

    this.state = {}
  }

  public render() {
    return (
      <div className={ styles['header-wrapper'] }>
        <PageHeader
          ghost={ true }
          title={
            <img alt="" src={ logo } className={ styles['title'] }/>
          }
          extra={
            <Button 
              className={ styles['instruction-button'] } 
              type="text" 
              key="instruction"
            >
              Instructions
            </Button>
          }
        >
        </PageHeader>
      </div>
    );
  }
}

export default withRouter(Header)
