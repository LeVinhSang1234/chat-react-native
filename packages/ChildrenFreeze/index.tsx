/* eslint-disable @typescript-eslint/no-unused-vars */
import {Component} from 'react';

class ChildrenFreeze extends Component<any> {
  shouldComponentUpdate(nProps: any) {
    const {children, ...p} = this.props;
    const arrayP = Object.keys(p);
    return (
      arrayP.length > 0 && Object.keys(p).some(e => this.props[e] !== nProps[e])
    );
  }

  render() {
    const {children} = this.props;
    return children;
  }
}

export default ChildrenFreeze;
