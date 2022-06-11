import {ChatDataProvider} from '@/ChatProvider/provider';
import Keyboard from '@/Keyboard';
import Text from '@/Text';
import {ChatProps} from '@/types';
import React, {Component} from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

class Chat extends Component<ChatProps> {
  renderItem = ({item}: any) => {
    return (
      <View key={item._id} style={{paddingVertical: 30}}>
        <Text>{item.message}</Text>
      </View>
    );
  };

  animationLayout = (
    duration: number = 10,
    creationProp: 'scaleY' | 'opacity' | 'scaleX' = Platform.select({
      ios: 'opacity',
      default: 'scaleY',
    }),
  ) => {
    const animated = Platform.select({ios: 'keyboard', default: 'easeOut'});
    LayoutAnimation.configureNext(
      LayoutAnimation.create(duration, animated as any, creationProp as any),
    );
  };

  render() {
    const {
      messages,
      ComponentInput,
      navbarBottomHeight,
      SendButton,
      SendButtonDefault,
      allowSendButtonDefault = true,
      Extendsion,
    } = this.props;
    return (
      <ChatDataProvider.Provider
        value={{
          animationLayout: this.animationLayout,
          ComponentInput: ComponentInput,
          navbarBottomHeight,
          SendButton,
          SendButtonDefault,
          allowSendButtonDefault,
          Extendsion,
        }}>
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
        <Keyboard animationLayout={this.animationLayout} />
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
  },
  contentFlat: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default Chat;
