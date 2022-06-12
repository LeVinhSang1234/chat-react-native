import {ChatDataProvider} from '@/ChatProvider/provider';
import Keyboard from '@/Keyboard';
import Message from '@/Message';
import {ChatProps} from '@/types';
import React, {Component} from 'react';
import {Keyboard as KeyboardLibrary} from 'react-native';

import {
  FlatList,
  ImageBackground,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';

interface ChatState {
  showTime?: number;
}

class Chat extends Component<ChatProps, ChatState> {
  animation: boolean;
  constructor(props: ChatProps) {
    super(props);
    this.animation = false;
    this.state = {showTime: undefined};
  }

  renderItem = ({item, index}: any) => {
    const {
      user,
      mainColor = '#445fff',
      messages,
      styleMessage,
      ortherMessageBackground,
      displaySenderName,
      dateTimeFormat,
      dateTimeYearFormat,
      dateYearFormat,
      timeFormat,
      seenText,
      renderMessage,
    } = this.props;
    const {showTime} = this.state;
    if (renderMessage) {
      return renderMessage(item, index);
    }
    return (
      <Message
        showTime={showTime === index}
        nextShow={showTime === index + 1}
        preShow={showTime === index - 1}
        animationLayout={this.animationLayout}
        messNext={messages[index + 1]}
        messPre={messages[index - 1]}
        mainColor={mainColor}
        user={user}
        key={item._id}
        mess={item}
        styleMessage={styleMessage}
        ortherMessageBackground={ortherMessageBackground}
        displaySenderName={displaySenderName}
        dateTimeFormat={dateTimeFormat}
        dateTimeYearFormat={dateTimeYearFormat}
        dateYearFormat={dateYearFormat}
        timeFormat={timeFormat}
        seenText={seenText}
        setShowTime={() => this.setShowTime(index)}
      />
    );
  };

  setShowTime = (index?: number) => {
    const {showTime} = this.state;
    this.setState({showTime: showTime === index ? undefined : index});
  };

  animationLayout = (
    duration: number = 10,
    creationProp: 'scaleY' | 'opacity' | 'scaleX' = Platform.select({
      ios: 'opacity',
      default: 'scaleY',
    }),
  ) => {
    if (this.animation) {
      return;
    }
    this.animation = true;
    const animated = Platform.select({ios: 'keyboard', default: 'easeOut'});
    LayoutAnimation.configureNext(
      LayoutAnimation.create(duration, animated as any, creationProp as any),
      this.endAnimation,
      this.endAnimation,
    );
  };

  endAnimation = () => {
    this.animation = false;
  };

  pressList = () => {
    KeyboardLibrary.dismiss();
  };

  render() {
    const {
      messages,
      ComponentBottomBar,
      navbarBottomHeight,
      SendButton,
      SendButtonDefault,
      allowSendButtonDefault = true,
      Extendsion,
      onSend,
      user,
      mainColor = '#445fff',
      imageBackground,
      styleBottomBar,
      style,
    } = this.props;
    return (
      <ChatDataProvider.Provider
        value={{
          animationLayout: this.animationLayout,
          ComponentBottomBar,
          navbarBottomHeight,
          SendButton,
          SendButtonDefault,
          allowSendButtonDefault,
          Extendsion,
          onSend,
          user,
          mainColor,
          styleBottomBar,
        }}>
        <ImageBackground
          source={{uri: imageBackground}}
          style={[styles.imageBackground, style]}>
          <Pressable
            onPress={this.pressList}
            style={[styles.view]}
            removeClippedSubviews>
            <FlatList
              removeClippedSubviews
              style={styles.visible}
              contentContainerStyle={[styles.inverted, styles.contentFlat]}
              inverted
              data={messages}
              renderItem={this.renderItem}
              keyExtractor={item => item._id}
            />
          </Pressable>
          <Keyboard animationLayout={this.animationLayout} />
        </ImageBackground>
      </ChatDataProvider.Provider>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  imageBackground: {
    height: '100%',
    flexGrow: 1,
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
