import BlurView from '@/BlurView';
import React, { PureComponent} from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import RightSvg from '@/assets/svgs/right.svg';
import {SvgXml} from 'react-native-svg';
import {ChatProvider, InputChatProvider} from '@/ChatProvider/provider';
import ChildrenFreeze from '@/ChildrenFreeze';
import KeyboardListener from '@/KeyboardListener';
import AnimatedInput from './AnimatedInput';
import AnimatedPress from './AnimatedPress';

interface ViewChatProps {
  extension?: JSX.Element;
}

interface ViewChatState {
  widthExtension: number;
  opacity: number;
  contextMenuHidden: boolean;
  openKeyboard: number;
  message: string;
}

class ViewChat extends PureComponent<ViewChatProps, ViewChatState> {
  timeout?: NodeJS.Timeout;
  constructor(props: ViewChatProps) {
    super(props);
    const {extension} = props;
    this.state = {
      widthExtension: 0,
      opacity: Number(!extension),
      contextMenuHidden: true,
      openKeyboard: 0,
      message: '',
    };
  }

  onLayoutExtendsion = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    const {widthExtension} = this.state;
    if (!widthExtension && widthExtension !== layout.width) {
      return this.setState({widthExtension: layout.width, opacity: 1});
    }
    this.setState({opacity: 1});
  };

  onPressOut = () => {
    const {openKeyboard} = this.state;
    if (openKeyboard) {
      return;
    }
    this.setState({openKeyboard: 26});
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.timeout = setTimeout(() => {
      this.setState({contextMenuHidden: false});
    }, 400);
  };

  keyboardHide = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.setState({openKeyboard: 0, contextMenuHidden: true});
  };

  onChangeMessage = (message: string) => {
    this.setState({message});
  };

  render() {
    const {children, extension} = this.props;
    const {opacity, widthExtension, contextMenuHidden, openKeyboard, message} =
      this.state;
    return (
      <InputChatProvider.Provider
        value={{
          onPressOut: this.onPressOut,
          contextMenuHidden,
          message,
          onChangeMessage: this.onChangeMessage,
        }}>
        <BlurView style={[styles.view, {opacity}]}>
          <ChildrenFreeze extension={extension} openKeyboard={openKeyboard}>
            {extension ? (
              <View style={styles.extension} onLayout={this.onLayoutExtendsion}>
                {extension}
                {openKeyboard ? (
                  <Pressable
                    onPress={this.keyboardHide}
                    style={styles.pressHideExtension}>
                    <SvgXml width={30} height={30} xml={RightSvg} />
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </ChildrenFreeze>
          {opacity ? (
            <ChildrenFreeze width={openKeyboard + widthExtension}>
              <ChatProvider.Consumer>
                {({width}) => (
                  <AnimatedInput
                    width={width - (openKeyboard || widthExtension) - 70}>
                    {children}
                  </AnimatedInput>
                )}
              </ChatProvider.Consumer>
            </ChildrenFreeze>
          ) : null}
          <ChildrenFreeze message={message}>
            <AnimatedPress message={message} />
          </ChildrenFreeze>
        </BlurView>
        {extension ? (
          <KeyboardListener
            onWillShow={this.onPressOut}
            onWillHide={this.keyboardHide}
          />
        ) : null}
      </InputChatProvider.Provider>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  extension: {
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pressHideExtension: {
    width: 38,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 7,
  },
});

export default ViewChat;
