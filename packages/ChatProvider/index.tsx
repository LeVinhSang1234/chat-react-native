import {ChatProviderProps} from '@/types';
import React, {Component} from 'react';
import {LogBox, Platform, UIManager} from 'react-native';
import {ChatProvider as ChatProviderContext} from './provider';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
LogBox.ignoreLogs([
  'Overriding previous layout animation',
  'ViewPropTypes will be removed from React Native',
]);

class ChatProvider extends Component<ChatProviderProps> {
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
