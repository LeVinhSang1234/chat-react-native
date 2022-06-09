import React, {Component} from 'react';
import {ChatProvider as ChatProviderContext} from './provider';

export declare type ChatProviderProps = {};

class ChatProvider extends Component {
  render() {
    const {children} = this.props;
    return (
      <ChatProviderContext.Provider value={{}}>
        <Children>{children}</Children>
      </ChatProviderContext.Provider>
    );
  }
}

class Children extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {children} = this.props;
    return children;
  }
}

export default ChatProvider;
