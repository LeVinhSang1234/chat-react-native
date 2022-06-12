import {ChatDataProvider} from '@/ChatProvider/provider';
import Input from '@/Input';
import KeyboardListener from '@/KeyboardListener';
import {ChatDataProviderProps, InputChatProps} from '@/types';
import {BlurView} from '@react-native-community/blur';
import React, {PureComponent, Component} from 'react';
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

const duration = Platform.select({ios: 250, default: 10});

class InputChat extends PureComponent<InputChatProps, IInputChatState> {
  listenerColor: any;
  animatedButtonDefault: Animated.Value;
  timeoutContext?: NodeJS.Timeout;
  timeoutHideExtendsion?: NodeJS.Timeout;
  constructor(props: InputChatProps) {
    super(props);
    const colorScheme = Appearance.getColorScheme();
    this.state = {
      colorScheme,
      message: '',
      hideExtendsion: false,
      contextMenuHidden: true,
    };
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
    this.setState = () => {};
  }

  onChangeText = (v: string) => {
    const {message = ''} = this.state;
    this.onShowKeyboard({duration} as any);
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

  renderExtendsion = () => {};

  onShowKeyboard = ({duration: d}: KeyboardEvent) => {
    const {animationLayout, Extendsion}: ChatDataProviderProps = this.context;
    if (Extendsion) {
      const {hideExtendsion} = this.state;
      if (!hideExtendsion) {
        this.setState({hideExtendsion: true});
      }
      if (this.timeoutContext) {
        clearInterval(this.timeoutContext);
        this.timeoutContext = undefined;
      }
      if (this.timeoutHideExtendsion) {
        clearInterval(this.timeoutHideExtendsion);
        this.timeoutHideExtendsion = undefined;
      }
      this.timeoutContext = setTimeout(() => {
        const {contextMenuHidden} = this.state;
        if (contextMenuHidden) {
          this.setState({contextMenuHidden: false});
        }
      }, 400);
      this.timeoutHideExtendsion = setTimeout(() => {
        this.onHideKeyboard({duration: d} as any);
      }, 8000);
      animationLayout?.(d);
    }
  };

  onHideKeyboard = ({duration: d}: KeyboardEvent) => {
    const {Extendsion}: ChatDataProviderProps = this.context;
    if (Extendsion) {
      if (this.timeoutContext) {
        clearInterval(this.timeoutContext);
        this.timeoutContext = undefined;
      }
      if (this.timeoutHideExtendsion) {
        clearInterval(this.timeoutHideExtendsion);
        this.timeoutHideExtendsion = undefined;
      }
      const {animationLayout}: ChatDataProviderProps = this.context;
      this.setState({hideExtendsion: false, contextMenuHidden: true});
      animationLayout?.(d);
    }
  };

  onSend = () => {
    const {onSend}: ChatDataProviderProps = this.context;
    const {message} = this.state;
    onSend(message);
    this.setState({message: ''});
  };

  render() {
    const {style, styleViewInput, isKeyboardShow, ...p} = this.props;
    const {colorScheme, message, contextMenuHidden, hideExtendsion} =
      this.state;
    const {styleBottomBar} = this.context;
    const scale = this.animatedButtonDefault.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    const rotate = this.animatedButtonDefault.interpolate({
      inputRange: [0, 1],
      outputRange: ['80deg', '0deg'],
    });
    const heightInput = isKeyboardShow ? 'auto' : 35;
    return (
      <BlurView
        blurType={styleBottomBar ? undefined : colorScheme || 'light'}
        style={[styleBottomBar, style]}>
        <View style={styles.view}>
          <ExtendsionComponent
            hideExtendsion={hideExtendsion}
            onHideKeyboard={this.onHideKeyboard}
          />
          <Input
            placeholder="Aa"
            {...p}
            contextMenuHidden={contextMenuHidden}
            onPressOut={() => this.onShowKeyboard({duration} as any)}
            value={message}
            style={[
              {backgroundColor: theme[colorScheme || 'light']},
              styleViewInput,
              {height: heightInput},
            ]}
            onChangeText={this.onChangeText}
          />
          <ButtonSend
            onSend={this.onSend}
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
    const {SendButtonDefault, mainColor} = this.context;
    return (
      SendButtonDefault || (
        <LikeSvg
          style={styles.likesvg}
          height={35}
          fill={mainColor}
          width={35}
        />
      )
    );
  };

  renderButtonSend = () => {
    const {SendButton, allowSendButtonDefault, mainColor} = this.context;
    const {active} = this.props;
    const color = active ? mainColor : '#e3e3e3';
    if (SendButton) {
      return SendButton?.({color, disabled: active});
    }
    return (
      <SendSvg
        fill={allowSendButtonDefault ? mainColor : color}
        width={23}
        height={23}
      />
    );
  };

  render() {
    const {allowSendButtonDefault}: ChatDataProviderProps = this.context;
    const {styleSendDefault, styleSend, onSend} = this.props;
    return (
      <Pressable style={styles.buttonSend} onPress={onSend}>
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

class ExtendsionComponent extends Component<any> {
  widthExtendsion: number;
  constructor(props: any) {
    super(props);
    this.widthExtendsion = 0;
  }

  shouldComponentUpdate(nProps: any) {
    const {hideExtendsion} = this.props;
    return hideExtendsion !== nProps.hideExtendsion;
  }

  onLayoutExtendsion = ({nativeEvent}: LayoutChangeEvent) => {
    const {hideExtendsion} = this.props;
    if (!hideExtendsion) {
      this.widthExtendsion = nativeEvent.layout.width;
    }
  };

  render() {
    const {Extendsion}: ChatDataProviderProps = this.context;
    if (!Extendsion) {
      return null;
    }
    const {hideExtendsion, onHideKeyboard} = this.props;
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
          onPress={() => onHideKeyboard({duration} as any)}
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
ExtendsionComponent.contextType = ChatDataProvider;

export default InputChat;
