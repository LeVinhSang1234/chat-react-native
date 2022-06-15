import {ChatDataProvider} from '@/ChatProvider/provider';
import KeyboardAdjust from '@/KeyboardAdjust';
import Text from '@/Text';
import {ChatProps} from '@/types';
import React, {Component} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';

class Chat extends Component<ChatProps> {
  keyboardAdjust?: KeyboardAdjust | null;

  renderItem = ({item}: any) => {
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
    const {messages, distanceFromField} = this.props;
    return (
      <ChatDataProvider.Provider value={{}}>
        <Pressable style={styles.view} onPress={this.dismissKeyboard}>
          <FlatList
            removeClippedSubviews
            style={styles.visible}
            inverted
            data={messages}
            renderItem={this.renderItem}
            keyExtractor={item => item._id}
          />
          <Pressable
            onPress={() => {
              this.keyboardAdjust?.register?.(<Text>Sang</Text>);
            }}
            style={{backgroundColor: '#e3e3e3', height: 40, width: 40}}>
            <Text>Click</Text>
          </Pressable>
        </Pressable>
        <KeyboardAdjust
          ref={ref => (this.keyboardAdjust = ref)}
          distanceFromField={distanceFromField}
        />
      </ChatDataProvider.Provider>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  inverted: {
    transform: [{scale: -1}],
  },
  visible: {
    overflow: 'visible',
    flexGrow: 1,
  },
});

export default Chat;
