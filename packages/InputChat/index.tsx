import {ChatDataProvider} from '@/ChatProvider/provider';
import Input from '@/Input';
import KeyboardListener from '@/KeyboardListener';
import {ChatDataProviderProps, InputChatProps} from '@/types';
import {BlurView} from '@react-native-community/blur';
import React, {Component} from 'react';
import {
  Animated,
  Appearance,
  ColorSchemeName,
  Easing,
  KeyboardEvent,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import LikeSvg from './like.svg';
import SendSvg from './send.svg';
import RightSvg from './right.svg';

const PressableAnimated = Animated.createAnimatedComponent(Pressable);

const theme: any = {
  light: 'rgba(240, 242, 245, 0.8)',
  dark: 'rgba(48, 48, 47, 0.8)',
};

interface IInputChatState {
  colorScheme: ColorSchemeName;
  message: string;
  hideExtendsion: boolean;
  contextMenuHidden: boolean;
}

class InputChat extends Component<InputChatProps, IInputChatState> {
  listenerColor: any;
  animatedButtonDefault: Animated.Value;
  widthExtendsion: number;
  timeoutContext?: NodeJS.Timeout;
  constructor(props: InputChatProps) {
    super(props);
    const colorScheme = Appearance.getColorScheme();
    this.state = {
      colorScheme,
      message: '',
      hideExtendsion: false,
      contextMenuHidden: true,
    };
    this.widthExtendsion = 0;
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

  renderExtendsion = () => {
    const {Extendsion}: ChatDataProviderProps = this.context;
    if (!Extendsion) {
      return null;
    }
    const {hideExtendsion} = this.state;
    const marginLeft = hideExtendsion ? -this.widthExtendsion : 0;
    const widthPress = !hideExtendsion ? 0 : 40;
    const maxWidth = 180;
    return (
      <Animated.View
        style={[styles.extendsion, {marginLeft}]}
        onLayout={this.onLayoutExtendsion}>
        <View style={{maxWidth}}>
          <Extendsion />
        </View>
        <PressableAnimated
          onPress={() =>
            this.onHideKeyboard({
              duration: Platform.select({ios: 250, default: 10}),
            } as any)
          }
          style={[
            styles.pressExtendsion,
            {
              width: widthPress,
              height: widthPress,
              opacity: Number(hideExtendsion),
            },
          ]}>
          <RightSvg width={30} height={30} />
        </PressableAnimated>
      </Animated.View>
    );
  };

  onShowKeyboard = ({duration}: KeyboardEvent) => {
    const {animationLayout, Extendsion}: ChatDataProviderProps = this.context;
    if (Extendsion) {
      if (this.widthExtendsion > 54) {
        this.setState({hideExtendsion: true});
        if (this.timeoutContext) {
          clearInterval(this.timeoutContext);
          this.timeoutContext = undefined;
        }
        this.timeoutContext = setTimeout(() => {
          this.setState({contextMenuHidden: false});
        }, 400);
        animationLayout?.(duration);
      }
    }
  };

  onHideKeyboard = ({duration}: KeyboardEvent) => {
    const {Extendsion}: ChatDataProviderProps = this.context;
    if (Extendsion) {
      if (this.timeoutContext) {
        clearInterval(this.timeoutContext);
        this.timeoutContext = undefined;
      }
      const {animationLayout}: ChatDataProviderProps = this.context;
      this.setState({hideExtendsion: false, contextMenuHidden: true});
      animationLayout?.(duration);
    }
  };

  onLayoutExtendsion = ({nativeEvent}: LayoutChangeEvent) => {
    const {hideExtendsion} = this.state;
    if (!hideExtendsion) {
      this.widthExtendsion = nativeEvent.layout.width;
    }
  };

  render() {
    const {style, styleViewInput, ...p} = this.props;
    const {colorScheme, message, contextMenuHidden} = this.state;
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
          {this.renderExtendsion()}
          <Input
            placeholder="Aa"
            {...p}
            contextMenuHidden={contextMenuHidden}
            onPressOut={() =>
              this.onShowKeyboard({
                duration: Platform.select({ios: 250, default: 10}),
              } as any)
            }
            value={message}
            style={[
              {backgroundColor: theme[colorScheme || 'light']},
              styleViewInput,
            ]}
            onChangeText={this.onChangeText}
          />
          <ButtonSend
            active={!!message}
            styleSend={{transform: [{scale}], opacity: scale}}
            styleSendDefault={{
              transform: [{scale: this.animatedButtonDefault}, {rotate}],
              opacity: this.animatedButtonDefault,
            }}
          />
        </View>
        <KeyboardListener
          onWillShow={this.onShowKeyboard}
          onWillHide={this.onHideKeyboard}
        />
      </BlurView>
    );
  }
}

class ButtonSend extends Component<any> {
  shouldComponentUpdate(nProps: any) {
    const {active} = this.props;
    return active !== nProps.active;
  }

  renderButtonSendDefault = () => {
    const {SendButtonDefault} = this.context;
    return (
      SendButtonDefault || (
        <LikeSvg style={styles.likesvg} height={35} fill="#445fff" width={35} />
      )
    );
  };

  renderButtonSend = () => {
    const {SendButton, allowSendButtonDefault} = this.context;
    const {active} = this.props;
    const color = active ? '#445fff' : '#e3e3e3';
    if (SendButton) {
      return SendButton?.({color, disabled: active});
    }
    return (
      <SendSvg
        fill={allowSendButtonDefault ? '#445fff' : color}
        width={23}
        height={23}
      />
    );
  };

  render() {
    const {allowSendButtonDefault}: ChatDataProviderProps = this.context;
    const {styleSendDefault, styleSend} = this.props;
    return (
      <Pressable style={styles.buttonSend}>
        {allowSendButtonDefault ? (
          <Animated.View style={[styles.viewSend, styleSendDefault]}>
            {this.renderButtonSendDefault()}
          </Animated.View>
        ) : null}
        <Animated.View style={[styles.viewSend, styleSend]}>
          {this.renderButtonSend()}
        </Animated.View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  likesvg: {
    marginRight: -4,
  },
  view: {
    paddingVertical: 11,
    paddingLeft: 11,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  buttonSend: {
    width: 50,
    height: 35,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  viewSend: {
    position: 'absolute',
    width: 50,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    paddingRight: 10,
  },
  iconSendDefault: {
    fontSize: 28,
  },
  extendsion: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    overflow: 'hidden',
    paddingRight: 11,
  },
  pressExtendsion: {
    width: 40,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
});

InputChat.contextType = ChatDataProvider;
ButtonSend.contextType = ChatDataProvider;

export default InputChat;
