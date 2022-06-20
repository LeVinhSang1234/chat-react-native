// @refresh reset
import KeyboardListener from '@/KeyboardListener';
import {ChatProviderProps} from '@/types';
import React, {PureComponent} from 'react';
import {LayoutChangeEvent, LogBox, StyleSheet, View} from 'react-native';
import {ChatProvider as ChatProviderContext} from './provider';

LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native']);

interface ChatProviderState {
  width: number;
  height: number;
  opacity: number;
}

class ChatProvider extends PureComponent<ChatProviderProps, ChatProviderState> {
  keyboardShow?: boolean;

  constructor(props: ChatProviderProps) {
    super(props);
    this.state = {width: 0, height: 0, opacity: 0};
  }

  onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;
    const {width, height, opacity} = this.state;
    const {width: w, height: h} = layout;
    if (width !== w || (height !== h && !this.keyboardShow)) {
      return this.setState({width: w, height: h, opacity: 1});
    }
    if (!opacity) {
      this.setState({opacity: 1});
    }
  };

  onWillShow = () => (this.keyboardShow = true);
  onWillHide = () => (this.keyboardShow = false);

  render() {
    const {children} = this.props;
    const {width, height, opacity} = this.state;
    return (
      <ChatProviderContext.Provider value={{width, height}}>
        <View onLayout={this.onLayout} style={[styles.view, {opacity}]}>
          {opacity ? children : null}
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
  view: {flex: 1},
});

export default ChatProvider;
