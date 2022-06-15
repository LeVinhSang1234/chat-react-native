import {
  ChatDataProvider,
  ChatProviderConsumer,
  KeyboardProvider,
} from '@/ChatProvider/provider';
import KeyboardAdjust from '@/KeyboardAdjust';
import Text from '@/Text';
import {ChatProps} from '@/types';
import React, {Component, Fragment} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

class Chat extends Component<ChatProps> {
  keyboardAdjust?: KeyboardAdjust | null;

  render() {
    const {messages, distanceFromField = 0, extension} = this.props;
    return (
      <ChatDataProvider.Provider value={{messages}}>
        <ChatProviderConsumer>
          {({width, height}) => (
            <KeyboardAvoidingView style={{width, height}}>
              <KeyboardProvider.Provider value={{distanceFromField, extension}}>
                <Children />
              </KeyboardProvider.Provider>
            </KeyboardAvoidingView>
          )}
        </ChatProviderConsumer>
      </ChatDataProvider.Provider>
    );
  }
}

class Children extends Component {
  keyboardAdjust?: KeyboardAdjust | null;
  isMove?: boolean;

  shouldComponentUpdate() {
    return false;
  }

  renderItem = (item: any) => {
    return (
      <View key={item._id} style={[{paddingVertical: 30}]}>
        <Text>{item.message}</Text>
      </View>
    );
  };

  dismissKeyboard = () => {
    this.keyboardAdjust?.dimiss?.();
  };

  render() {
    return (
      <Fragment>
        <ChatProviderConsumer>
          {({width}) => (
            <ChatDataProvider.Consumer>
              {({messages}) => (
                <ScrollView
                  style={[styles.inverted, {width}]}
                  showsVerticalScrollIndicator={Platform.OS !== 'android'}>
                  <Pressable
                    style={styles.inverted}
                    onPress={this.dismissKeyboard}>
                    {messages.map(e => this.renderItem(e))}
                  </Pressable>
                </ScrollView>
              )}
            </ChatDataProvider.Consumer>
          )}
        </ChatProviderConsumer>
        <KeyboardProvider.Consumer>
          {({distanceFromField}) => (
            <KeyboardAdjust
              ComponentInput={TextInput}
              ref={ref => (this.keyboardAdjust = ref)}
              distanceFromField={distanceFromField}
            />
          )}
        </KeyboardProvider.Consumer>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  inverted: {
    transform: [{scale: -1}],
    overflow: 'visible',
  },
});

export default Chat;
