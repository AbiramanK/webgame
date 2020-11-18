import * as React from 'react';
import './index.css';
import {
  PageHeader,
  Button,
  Descriptions
} from 'antd';
export interface IHeaderComponentProps {
}

export interface IHeaderComponentState {
}

export default class HeaderComponent extends React.Component<IHeaderComponentProps, IHeaderComponentState> {
  constructor(props: IHeaderComponentProps) {
    super(props);

    this.state = {
    }
  }

  public render() {
    return (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          ghost={true }
          // onBack={() => window.history.back()}
          title="afino"
          extra={[
            <Button className="page-header-heading-instruction-button" type="text">Instructions</Button>
          ]}
        >
        </PageHeader>
      </div>
    );
  }
}
