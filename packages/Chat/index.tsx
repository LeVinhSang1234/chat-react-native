import {ChatDataProvider} from '@/ChatProvider/provider';
import Keyboard from '@/Keyboard';
import Text from '@/Text';
import {ChatProps} from '@/types';
import moment from 'moment-timezone';
import React, {Component} from 'react';

import {
  Appearance,
  ColorSchemeName,
  FlatList,
  Image,
  ImageBackground,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
moment.locale('vi');

class Chat extends Component<ChatProps> {
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
    } = this.props;
    return (
      <Message
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

// Message Component
class Message extends Component<any, any> {
  listenerColor: any;
  constructor(props: any) {
    super(props);
    const colorScheme = Appearance.getColorScheme();
    this.state = {colorScheme, showTime: false};
    this.listenerColor = Appearance.addChangeListener(this.ListenerColor);
  }

  shouldComponentUpdate(nProps: any, nState: any) {
    const {colorScheme, showTime} = this.state;
    return (
      Object.keys(nProps).some(e => this.props[e] !== nProps[e]) ||
      colorScheme !== nState.colorScheme ||
      showTime !== nState.showTime
    );
  }

  componentWillUnmount() {
    this.listenerColor?.remove?.();
    this.setState = () => {};
  }

  ListenerColor = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
    this.setState({colorScheme});
  };

  showTime = () => {
    const {showTime} = this.state;
    const {animationLayout} = this.props;
    this.setState({showTime: !showTime});
    animationLayout?.(Platform.select({ios: 250, default: 10}));
  };

  yourMessage = () => {
    const {
      mess,
      mainColor,
      messNext = {},
      messPre = {},
      styleMessage = {},
    } = this.props;
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
      <View style={[styles.yourMessageView, styleMessage.yourMessageView]}>
        <View style={styles.yourMessage}>
          <Pressable
            onPress={this.showTime}
            style={[styles.message, {backgroundColor: mainColor}, style]}>
            <Text style={[styles.messageText, styleMessage.messageText]}>
              {mess.message}
            </Text>
          </Pressable>
          {previewAvatar ? (
            <Image
              style={[styles.avatar, styleMessage.avatar]}
              source={{uri: sender.avatar}}
            />
          ) : null}
        </View>
      </View>
    );
  };

  otherMessage = () => {
    const {
      mess,
      messNext = {},
      messPre = {},
      styleMessage = {},
      ortherMessageBackground = {
        light: '#f1f1f1',
        dark: '#303030',
      },
      displaySenderName = true,
    } = this.props;
    const {colorScheme = 'light', showTime} = this.state;
    const {sender} = mess;
    const {sender: senderNext} = messNext;
    const {sender: senderPre} = messPre;
    let style: ViewStyle = {};
    let styleMargin: ViewStyle = {marginBottom: 10};
    let previewAvatar = true;
    let previewNameUser = true;
    if (senderPre?._id === sender._id) {
      style = {borderBottomLeftRadius: 1};
      previewAvatar = false;
      styleMargin = {};
    }
    if (senderNext?._id === sender._id) {
      style = {...style, borderTopLeftRadius: 1};
      previewNameUser = false;
    }
    if (showTime && mess.readAt) {
      styleMargin = {};
    }
    let backgroundColor =
      typeof ortherMessageBackground === 'string'
        ? ortherMessageBackground
        : ortherMessageBackground?.[colorScheme];
    return (
      <View
        style={[
          styles.otherMessageView,
          styleMessage.otherMessageView,
          styleMargin,
        ]}>
        <View>
          {previewNameUser && displaySenderName ? (
            <Text style={[styles.sendName, styleMessage.sendName]}>
              {sender.name}
            </Text>
          ) : null}
          <View style={styles.otherMessage}>
            <Image
              style={[styles.avatar, styleMessage.avatar]}
              source={{uri: previewAvatar ? sender.avatar : undefined}}
            />
            <Pressable
              onPress={this.showTime}
              style={[styles.message, {backgroundColor}, style]}>
              <Text
                style={[styles.ortherMessageText, styleMessage.messageText]}>
                {mess.message}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  render() {
    let {
      mess,
      messNext,
      user,
      timeFormat = 'HH:mm',
      dateTimeFormat = 'HH:mm, DD MMMM',
      dateFormat = 'DD MMMM',
      dateTimeYearFormat = 'HH:mm, DD MMMM YYYY',
      dateYearFormat = 'DD MMMM YYYY',
      timezone = moment.tz.guess(),
      seenText = 'Đã xem',
      styleMessage = {},
    } = this.props;
    if (!moment().diff(moment(mess.createdAt), 'month')) {
      dateTimeFormat = timeFormat;
    } else if (moment().diff(moment(mess.createdAt).startOf('y'), 'year')) {
      dateTimeFormat = dateTimeYearFormat;
    }
    const yourMessage = mess.sender?._id === user._id;
    const textAlign = yourMessage ? 'right' : 'left';
    const {showTime} = this.state;
    const heightSeen = showTime && mess.readAt ? 32 : 0;
    const isLineTime =
      !messNext ||
      Math.abs(moment(mess.createdAt).diff(messNext.createdAt, 'month')) >= 1;
    let lineFormat = dateFormat;
    if (
      !messNext ||
      Math.abs(
        moment(moment(mess.createdAt).startOf('y')).diff(
          moment(messNext.createdAt).endOf('y'),
          'year',
        ),
      ) >= 1
    ) {
      lineFormat = dateYearFormat;
    }
    return (
      <View>
        {isLineTime ? (
          <Text style={[styles.timeText, styleMessage.timeText]}>
            {moment(mess.createdAt).tz(timezone).format(lineFormat)}
          </Text>
        ) : null}
        {showTime ? (
          <Text style={[styles.timeText, styleMessage.timeText]}>
            {moment(mess.createdAt).tz(timezone).format(dateTimeFormat)}
          </Text>
        ) : null}
        {user._id === mess.sender?._id
          ? this.yourMessage()
          : this.otherMessage()}
        <View style={[styles.hidden, {height: heightSeen}]}>
          <Text style={[styles.readText, {textAlign}, styleMessage.seenText]}>
            {seenText}
          </Text>
        </View>
      </View>
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
  sendName: {
    fontSize: 11,
    color: '#a6a6a6',
    paddingLeft: 38,
    paddingBottom: 1,
  },
  timeText: {
    flexGrow: 1,
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 10,
    fontSize: 13,
    color: '#a1a1a1',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  readText: {
    flexGrow: 1,
    paddingBottom: 15,
    paddingTop: 3,
    fontSize: 12,
    color: '#a1a1a1',
    fontWeight: '500',
    paddingHorizontal: 43,
  },
  hidden: {
    overflow: 'hidden',
  },
});

export default Chat;
