import Keyboard from '@/Keyboard';
import Text from '@/Text';
import {ChatProps} from '@/types';
import React, {Component, Fragment} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';

class Chat extends Component<ChatProps> {
  renderItem = ({item}: any) => {
    return (
      <View key={item._id}>
        <Text>{item.message}</Text>
      </View>
    );
  };

  render() {
    const {messages} = this.props;
    return (
      <Fragment>
        <View style={[styles.view]} removeClippedSubviews>
          <FlatList
            removeClippedSubviews
            style={styles.visible}
            contentContainerStyle={[styles.inverted, styles.contentFlat]}
            inverted
            data={messages}
            renderItem={this.renderItem}
            keyExtractor={item => item._id}
          />
        </View>
        <Keyboard />
      </Fragment>
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
  },
  contentFlat: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default Chat;
