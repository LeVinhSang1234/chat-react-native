// @refresh reset
import KeyboardListener from '@/KeyboardListener';
import {ChatProviderProps, CreateStaticProps} from '@/types';
import React, {Component} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  LogBox,
  StyleSheet,
  View,
} from 'react-native';
import {ChatProvider as ChatProviderContext} from './provider';

LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

interface ChatProviderState {
  width: number;
  height: number;
  rotate: 1 | -1;
  opacity: number;
}

class ChatProvider extends Component<ChatProviderProps, ChatProviderState> {
  static create: CreateStaticProps;
  keyboardShow?: boolean;

  constructor(props: ChatProviderProps) {
    super(props);
    const {width, height} = Dimensions.get('window');
    this.state = {
      width,
      height: height,
      rotate: height > width ? 1 : -1,
      opacity: 0,
    };
  }

  onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;
    const {width, height, opacity} = this.state;
    if (!this.keyboardShow) {
      if (width !== layout.width || height !== layout.height) {
        this.setState({width: layout.width, height: layout.height, opacity: 1});
      } else if (!opacity) {
        this.setState({opacity: 1});
      }
    }
  };

  onDidShow = () => {
    this.keyboardShow = true;
  };

  onDidHide = () => {
    this.keyboardShow = false;
  };

  render() {
    const {children} = this.props;
    const {width, height, opacity, rotate} = this.state;
    return (
      <ChatProviderContext.Provider value={{width, height, rotate}}>
        <View onLayout={this.onLayout} style={[styles.view, {opacity}]}>
          <Children>{children}</Children>
        </View>
        <KeyboardListener
          onDidHide={this.onDidHide}
          onDidShow={this.onDidShow}
        />
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

const styles = StyleSheet.create({
  view: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexGrow: 1,
  },
});

export default ChatProvider;
