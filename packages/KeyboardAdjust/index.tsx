import BlurView from '@/BlurView';
import {ChatProvider} from '@/ChatProvider/provider';
import KeyboardListener from '@/KeyboardListener';
import {KeyboardAdjustProps} from '@/types';
import React, {Component} from 'react';
import {Animated, Keyboard, KeyboardEvent, Platform} from 'react-native';

interface KeyboardAdjustState {
  child?: JSX.Element | null;
}

class KeyboardAdjust extends Component<
  KeyboardAdjustProps,
  KeyboardAdjustState
> {
  heightAninamted: Animated.Value;
  heightKeyboardAdjus: number;
  constructor(props: KeyboardAdjustProps) {
    super(props);
    const {distanceFromField = 0} = props;
    this.heightKeyboardAdjus = Platform.select({ios: 291, default: 249});
    this.heightAninamted = new Animated.Value(distanceFromField);
    this.state = {child: null};
  }

  // handle Animated
  animatedOfKeyboard = (value: number) => {
    const animation = Platform.select({
      android: this.AnimatedAndroid,
      default: this.AnimatedIOS,
    });
    animation(value);
  };

  AnimatedIOS = (toValue: number) => {
    Animated.spring(this.heightAninamted, {
      toValue,
      bounciness: 1,
      overshootClamping: true,
      useNativeDriver: false,
    }).start();
  };

  AnimatedAndroid = (toValue: number) => {
    Animated.timing(this.heightAninamted, {
      toValue,
      duration: 0,
      useNativeDriver: false,
    }).start();
  };
  // handle Animated

  onShowKeyboard = ({endCoordinates, duration}: KeyboardEvent) => {
    this.heightKeyboardAdjus = endCoordinates.height;
    if (!duration) {
      return this.AnimatedAndroid(endCoordinates.height);
    }
    this.animatedOfKeyboard(endCoordinates.height);
  };

  onHideKeyboard = () => {
    const {distanceFromField = 0} = this.props;
    const {child} = this.state;
    if (!child) {
      this.animatedOfKeyboard(distanceFromField);
    }
  };

  onDidShowKeyboard = (e: KeyboardEvent) => {
    if (Platform.OS === 'android') {
      this.onShowKeyboard(e);
    }
    const {child} = this.state;
    if (child) {
      this.setState({child: null});
    }
  };

  register = (child: JSX.Element) => {
    const {distanceFromField = 0} = this.props;
    if ((this.heightAninamted as any)._value <= distanceFromField) {
      this.animatedOfKeyboard(this.heightKeyboardAdjus);
    }
    this.setState({child}, () => Keyboard.dismiss());
  };

  dimiss = () => {
    Keyboard.dismiss();
    const {distanceFromField = 0} = this.props;
    this.animatedOfKeyboard(distanceFromField);
    this.setState({child: null});
  };

  render() {
    const {child} = this.state;
    const {ComponentInput} = this.props;
    return (
      <BlurView>
        <ChatProvider.Consumer>
          {({width}) => <ComponentInput width={width} />}
        </ChatProvider.Consumer>
        <Animated.View style={{height: this.heightAninamted}}>
          {child}
        </Animated.View>
        <KeyboardListener
          onWillShow={this.onShowKeyboard}
          onWillHide={this.onHideKeyboard}
          onDidShow={this.onDidShowKeyboard}
        />
      </BlurView>
    );
  }
}

export default KeyboardAdjust;
