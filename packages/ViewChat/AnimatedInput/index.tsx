import React, {Component} from 'react';
import {Animated, Platform, StyleSheet} from 'react-native';

class AnimatedInput extends Component<{width: number}> {
  animated: Animated.Value;
  constructor(props: {width: number}) {
    super(props);
    this.animated = new Animated.Value(props.width);
  }

  shouldComponentUpdate() {
    return false;
  }

  UNSAFE_componentWillReceiveProps(nProps: {width: number}) {
    const {width} = this.props;
    if (width !== nProps.width) {
      if (Platform.OS === 'ios') {
        Animated.spring(this.animated, {
          toValue: nProps.width,
          bounciness: 1,
          overshootClamping: true,
          useNativeDriver: false,
        }).start();
      } else {
        Animated.timing(this.animated, {
          toValue: nProps.width,
          duration: 10,
          useNativeDriver: false,
        }).start();
      }
    }
  }

  render() {
    const {children} = this.props;
    return (
      <Animated.View style={[styles.inputView, {width: this.animated}]}>
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  inputView: {
    marginHorizontal: 7,
  },
});

export default AnimatedInput;
