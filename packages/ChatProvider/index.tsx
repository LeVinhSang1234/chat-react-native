// @refresh reset
import {
  ChatDataProviderProps,
  ChatProviderProps,
  CreateFunctionProps,
  CreateStaticProps,
} from '@/types';
import React, {Component} from 'react';
import {LogBox} from 'react-native';
import {ChatProvider as ChatProviderContext} from './provider';

LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);
let provider: ChatDataProviderProps = {};

class ChatProvider extends Component<ChatProviderProps> {
  static create: CreateStaticProps;

  constructor(props: ChatProviderProps) {
    super(props);
    provider = {};
  }

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

ChatProvider.create = (f?: CreateFunctionProps) => {
  let dataProps = provider;
  if (typeof f === 'function') {
    dataProps = f(provider);
  }
  return (Com: React.ComponentType<any>) => <Com {...dataProps} />;
};

export default ChatProvider;
