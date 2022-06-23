import {
  ChatDataProvider,
  ChatProvider,
  KeyboardProvider,
} from '@/ChatProvider/provider';
import ChildrenFreeze from '@/ChildrenFreeze';
import InputChat from '@/InputChat';
import KeyboardAdjust from '@/KeyboardAdjust';
import {ChatProps} from '@/types';
import React, {Component} from 'react';
import {View} from 'react-native';
import Content from './Content';

class Chat extends Component<ChatProps> {
  keyboardAdjust?: KeyboardAdjust | null;

  dismiss = () => {
    this.keyboardAdjust?.dimiss?.();
  };

  render() {
    const {
      messages,
      distanceFromField = 0,
      extension,
      ComponentInput,
      sliceMessageBlur = 0,
      onSend,
    } = this.props;
    return (
      <ChatDataProvider.Provider value={{messages, sliceMessageBlur}}>
        <ChatProvider.Consumer>
          {({width, height}) => (
            <View style={{width, height}}>
              <KeyboardProvider.Provider
                value={{
                  distanceFromField,
                  extension,
                  dismiss: this.dismiss,
                  onSend,
                }}>
                <ChildrenFreeze messages={messages}>
                  <Content />
                </ChildrenFreeze>
                <ChildrenFreeze distanceFromField={distanceFromField}>
                  <KeyboardAdjust
                    ComponentInput={ComponentInput || InputChat}
                    ref={ref => (this.keyboardAdjust = ref)}
                    distanceFromField={distanceFromField}
                  />
                </ChildrenFreeze>
              </KeyboardProvider.Provider>
            </View>
          )}
        </ChatProvider.Consumer>
      </ChatDataProvider.Provider>
    );
  }
}

export default Chat;
