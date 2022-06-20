import {Component} from 'react';

class ChildrenFreeze extends Component<any> {
  shouldComponentUpdate(nProps: any) {
    const {children, ...p} = this.props;
    return Object.keys(p || {}).some(e => this.props[e] !== nProps[e]);
  }

  render() {
    const {children} = this.props;
    return children;
  }
}

export default ChildrenFreeze;
