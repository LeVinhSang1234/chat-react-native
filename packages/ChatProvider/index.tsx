// @refresh reset
import KeyboardListener from '@/KeyboardListener';
import {ChatProviderProps} from '@/types';
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
    if (
      width !== layout.width ||
      (height !== layout.height && !this.keyboardShow)
    ) {
      this.setState({width: layout.width, height: layout.height, opacity: 1});
    } else if (!opacity) {
      this.setState({opacity: 1});
    }
  };

  onWillShow = () => {
    this.keyboardShow = true;
  };

  onWillHide = () => {
    this.keyboardShow = false;
  };

  render() {
    const {children} = this.props;
    const {width, height, opacity, rotate} = this.state;
    return (
      <ChatProviderContext.Provider value={{width, height, rotate}}>
        <View onLayout={this.onLayout} style={[styles.view, {opacity}]}>
          {children}
        </View>
        <KeyboardListener
          onWillHide={this.onWillHide}
          onWillShow={this.onWillShow}
        />
      </ChatProviderContext.Provider>
    );
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
