import React from 'react';
import { withRouter } from 'react-router-dom'
import { PageHeader, Button, Modal } from 'antd';

import styles from './Header.module.css'
import logo from '../../assets/afino_name.svg'


export class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}
  }

  instruction = () => {
    Modal.info({
      content: 'dkfvdfkvnkjfnvkjdfnvdfvkldfmvlkdfmvlkdfmvlkdfmvlkfdmvklfdv',
      title: 'Instruction',
      okButtonProps: {
        type: "primary", 
        className: styles['submit-button']
      }
    })
  }
  
  render() {
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
              onClick={ this.instruction }
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
