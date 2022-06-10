import {ChatDataProvider} from '@/ChatProvider/provider';
import InputChat from '@/InputChat';
import Keyboard from '@/Keyboard';
import Text from '@/Text';
import {ChatProps} from '@/types';
import {debounce} from '@/utils';
import React, {Component, Fragment} from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
} from 'react-native';

class Chat extends Component<ChatProps> {
  animatedBegin: boolean;

  constructor(props: ChatProps) {
    super(props);
    this.animatedBegin = false;
    this.removeBeginLayout = debounce(this.removeBeginLayout, 20);
  }

  renderItem = ({item}: any) => {
    return (
      <View key={item._id} style={{paddingVertical: 30}}>
        <Text>{item.message}</Text>
      </View>
    );
  };

  removeBeginLayout = () => {
    this.animatedBegin = false;
  };

  animationLayout = (duration: number = 10) => {
    if (!this.animatedBegin) {
      this.animatedBegin = true;
      const animated = Platform.select({ios: 'keyboard', default: 'easeOut'});
      const creationProp = Platform.select({ios: 'opacity', default: 'scaleY'});
      LayoutAnimation.configureNext(
        LayoutAnimation.create(duration, animated as any, creationProp as any),
        this.removeBeginLayout,
        this.removeBeginLayout,
      );
    }
  };

  render() {
    const {
      messages,
      ComponentInput,
      ComponentInputLazy,
      navbarBottomHeight,
      SendButton,
      SendButtonDefault,
      allowSendButtonDefault = true,
    } = this.props;
    return (
      <ChatDataProvider.Provider
        value={{
          animationLayout: this.animationLayout,
          ComponentInput: ComponentInput,
          ComponentInputLazy,
          navbarBottomHeight,
          SendButton,
          SendButtonDefault,
          allowSendButtonDefault,
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
