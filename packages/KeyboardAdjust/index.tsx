import BlurView from '@/BlurView';
import KeyboardListener from '@/KeyboardListener';
import {KeyboardAdjustProps} from '@/types';
import React, {Component, Fragment} from 'react';
import {
  Animated,
  Keyboard,
  KeyboardEvent,
  LayoutAnimation,
  Platform,
  StyleSheet,
  TextInput,
  ViewStyle,
} from 'react-native';

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
    const {distanceFromField = 0, children = null} = props;
    this.heightKeyboardAdjus = Platform.select({ios: 291, default: 294});
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
    return (
      <BlurView>
        <Children style={{height: this.heightAninamted}}>{child}</Children>
        <KeyboardListener
          onWillShow={this.onShowKeyboard}
          onWillHide={this.onHideKeyboard}
          onDidShow={this.onDidShowKeyboard}
        />
      </BlurView>
    );
  }
}

class Children extends Component<{
  style:
    | Animated.WithAnimatedObject<ViewStyle>
    | Animated.WithAnimatedArray<ViewStyle>;
}> {
  shouldComponentUpdate(nProps: any) {
    const {children} = this.props;
    return children !== nProps.children;
  }

  render() {
    const {children, style} = this.props;
    return (
      <Fragment>
        <TextInput style={styles.input} />
        <Animated.View style={style}>{children}</Animated.View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
  },
});

export default KeyboardAdjust;
