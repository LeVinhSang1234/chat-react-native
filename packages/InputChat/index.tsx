import {ChatDataProvider} from '@/ChatProvider/provider';
import Input from '@/Input';
import {ChatDataProviderProps, InputChatProps} from '@/types';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {
  Animated,
  Appearance,
  ColorSchemeName,
  Easing,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import LikeSvg from './like.svg';
import SendSvg from './send.svg';

const theme: any = {
  light: 'rgba(240, 242, 245, 0.8)',
  dark: 'rgba(48, 48, 47, 0.8)',
};

interface IInputChatState {
  colorScheme: ColorSchemeName;
  message: string;
}

class InputChat extends Component<InputChatProps, IInputChatState> {
  listenerColor: any;
  animatedButtonDefault: Animated.Value;
  constructor(props: InputChatProps) {
    super(props);
    const colorScheme = Appearance.getColorScheme();
    this.state = {colorScheme, message: ''};
    this.animatedButtonDefault = new Animated.Value(1);
    this.listenerColor = Appearance.addChangeListener(this.ListenerColor);
  }

  UNSAFE_componentWillMount() {
    const {defaultMessage} = this.context;
    const {message} = this.state;
    if (message !== defaultMessage) {
      this.setState({message: defaultMessage});
    }
  }

  ListenerColor = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
    this.setState({colorScheme});
  };

  componentWillUnmount() {
    this.listenerColor?.remove?.();
  }

  renderButtonSendDefault = () => {
    const {SendButtonDefault}: ChatDataProviderProps = this.context;
    return SendButtonDefault || <LikeSvg fill="#445fff" width={35} />;
  };

  renderButtonSend = () => {
    const {SendButton, allowSendButtonDefault}: ChatDataProviderProps =
      this.context;
    const {message} = this.state;
    const color = message ? '#445fff' : '#e3e3e3';
    if (SendButton) {
      return SendButton?.({color, disabled: !!message});
    }
    return (
      <SendSvg
        fill={allowSendButtonDefault ? '#445fff' : color}
        width={28}
        height={28}
      />
    );
  };

  onChangeText = (v: string) => {
    const {message = ''} = this.state;
    if (!message.trim() && v.trim()) {
      Animated.timing(this.animatedButtonDefault, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.elastic(1.3),
      }).start();
    } else if (message.trim() && !v.trim()) {
      Animated.timing(this.animatedButtonDefault, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.elastic(1.3),
      }).start();
    }
    this.setState({message: v});
  };

  render() {
    const {style, styleViewInput, ...p} = this.props;
    const {allowSendButtonDefault}: ChatDataProviderProps = this.context;
    const {colorScheme, message} = this.state;

    const scale = this.animatedButtonDefault.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });

    const rotate = this.animatedButtonDefault.interpolate({
      inputRange: [0, 1],
      outputRange: ['80deg', '0deg'],
    });

    return (
      <BlurView blurType={colorScheme || 'light'} style={style}>
        <View style={styles.view}>
          <Input
            placeholder="Aa"
            {...p}
            value={message}
            style={[
              {backgroundColor: theme[colorScheme || 'light']},
              styleViewInput,
            ]}
            onChangeText={this.onChangeText}
          />
          <Pressable style={styles.buttonSend}>
            {allowSendButtonDefault ? (
              <Animated.View
                style={[
                  styles.viewSend,
                  {
                    transform: [{scale: this.animatedButtonDefault}, {rotate}],
                    opacity: this.animatedButtonDefault,
                  },
                ]}>
                {this.renderButtonSendDefault()}
              </Animated.View>
            ) : null}
            <Animated.View
              style={[styles.viewSend, {transform: [{scale}], opacity: scale}]}>
              {this.renderButtonSend()}
            </Animated.View>
          </Pressable>
        </View>
      </BlurView>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    paddingVertical: 11,
    paddingLeft: 11,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonSend: {
    width: 50,
    height: 40,
    position: 'relative',
  },
  viewSend: {
    position: 'absolute',
    width: 50,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconSendDefault: {
    fontSize: 28,
  },
});

InputChat.contextType = ChatDataProvider;

export default InputChat;
