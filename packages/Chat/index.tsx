import {ChatDataProvider} from '@/ChatProvider/provider';
import Keyboard from '@/Keyboard';
import Text from '@/Text';
import {ChatProps} from '@/types';
import React, {Component} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  LayoutAnimation,
  Platform,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

class Chat extends Component<ChatProps> {
  renderItem = ({item, index}: any) => {
    const {user, mainColor = '#445fff', messages} = this.props;
    return (
      <Message
        messNext={messages[index + 1]}
        messPre={messages[index - 1]}
        mainColor={mainColor}
        user={user}
        key={item._id}
        mess={item}
      />
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
          style={styles.imageBackground}>
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
        </ImageBackground>
      </ChatDataProvider.Provider>
    );
  }
}

class Message extends Component<any> {
  shouldComponentUpdate(nProps: any) {
    const {mess, user, mainColor, messNext, messPre} = this.props;
    return (
      mess !== nProps.mess ||
      user !== nProps.user ||
      messNext !== nProps.messNext ||
      messPre !== nProps.messPre ||
      mainColor !== nProps.mainColor
    );
  }

  yourMessage = () => {
    const {mess, mainColor, messNext = {}, messPre = {}} = this.props;
    const {sender} = mess;
    const {sender: senderNext} = messNext;
    const {sender: senderPre} = messPre;
    let style: ViewStyle = {};
    let previewAvatar = true;
    if (senderPre?._id === sender._id) {
      style = {borderBottomRightRadius: 1};
      previewAvatar = false;
    }
    if (senderNext?._id === sender._id) {
      style = {...style, borderTopRightRadius: 1};
    }
    return (
      <View style={styles.yourMessageView}>
        <View style={styles.yourMessage}>
          <View style={[styles.message, {backgroundColor: mainColor}, style]}>
            <Text style={styles.messageText}>{mess.message}</Text>
          </View>
          {previewAvatar ? (
            <Image style={styles.avatar} source={{uri: sender.avatar}} />
          ) : null}
        </View>
      </View>
    );
  };

  otherMessage = () => {
    const {mess, messNext = {}, messPre = {}} = this.props;
    const {sender} = mess;
    const {sender: senderNext} = messNext;
    const {sender: senderPre} = messPre;
    let style: ViewStyle = {};
    let styleMargin: ViewStyle = {marginTop: 15};
    let previewAvatar = true;
    let previewNameUser = true;
    if (senderPre?._id === sender._id) {
      style = {borderBottomLeftRadius: 1};
      previewAvatar = false;
    }
    if (senderNext?._id === sender._id) {
      style = {...style, borderTopLeftRadius: 1};
      previewNameUser = false;
      styleMargin = {};
    }
    return (
      <View style={[styles.otherMessageView, styleMargin]}>
        <View>
          {previewNameUser ? (
            <Text style={styles.userName}>{sender.name}</Text>
          ) : null}
          <View style={styles.otherMessage}>
            {previewAvatar ? (
              <Image style={styles.avatar} source={{uri: sender.avatar}} />
            ) : (
              <View style={styles.avatar} />
            )}
            <View style={[styles.message, {backgroundColor: '#f1f1f1'}, style]}>
              <Text style={styles.ortherMessageText}>{mess.message}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const {mess, user} = this.props;
    return (
      <View>
        {user._id === mess.sender?._id
          ? this.yourMessage()
          : this.otherMessage()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingBottom: 10,
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
  avatar: {
    height: 20,
    width: 20,
    borderRadius: 20,
  },
  yourMessageView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
  },
  otherMessageView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
  },
  yourMessage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  otherMessage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  message: {
    marginHorizontal: 8,
    paddingVertical: 6.5,
    paddingHorizontal: 10,
    borderRadius: 17,
    marginVertical: 0.5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
  },
  ortherMessageText: {
    fontSize: 14,
  },
  userName: {
    fontSize: 11,
    color: '#a6a6a6',
    paddingLeft: 38,
    paddingBottom: 1,
  },
});

export default Chat;
