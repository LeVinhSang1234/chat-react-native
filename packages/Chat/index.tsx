import {
  ChatDataProvider,
  ChatProviderConsumer,
  KeyboardProvider,
} from '@/ChatProvider/provider';
import InputChat from '@/InputChat';
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
  View,
} from 'react-native';

class Chat extends Component<ChatProps> {
  keyboardAdjust?: KeyboardAdjust | null;

  render() {
    const {messages, distanceFromField = 0} = this.props;
    return (
      <ChatDataProvider.Provider value={{messages}}>
        <ChatProviderConsumer>
          {({width, height}) => (
            <KeyboardAvoidingView style={{width, height}}>
              <KeyboardProvider.Provider value={{distanceFromField}}>
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
        <ChatDataProvider.Consumer>
          {({messages}) => (
            <ScrollView
              style={styles.inverted}
              showsVerticalScrollIndicator={Platform.OS !== 'android'}>
              <Pressable style={styles.inverted} onPress={this.dismissKeyboard}>
                {messages.map(e => this.renderItem(e))}
              </Pressable>
            </ScrollView>
          )}
        </ChatDataProvider.Consumer>
        <KeyboardProvider.Consumer>
          {({distanceFromField}) => (
            <KeyboardAdjust
              ComponentInput={InputChat}
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
