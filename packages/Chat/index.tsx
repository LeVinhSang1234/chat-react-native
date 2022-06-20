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
import {Platform, ScrollView, StyleSheet, View} from 'react-native';
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
    } = this.props;
    return (
      <ChatDataProvider.Provider value={{messages}}>
        <ChatProvider.Consumer>
          {({width, height}) => (
            <View style={{width, height}}>
              <KeyboardProvider.Provider
                value={{distanceFromField, extension, dismiss: this.dismiss}}>
                <ChildrenFreeze>
                  <ScrollView
                    style={styles.inverted}
                    showsVerticalScrollIndicator={Platform.OS !== 'android'}>
                    <Content />
                  </ScrollView>
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

const styles = StyleSheet.create({
  inverted: {
    transform: [{scale: -1}],
    overflow: 'visible',
    width: '100%',
  },
});

export default Chat;
