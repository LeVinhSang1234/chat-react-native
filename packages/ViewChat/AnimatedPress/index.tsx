import React, {Component} from 'react';
import {Animated, Easing, Pressable, StyleSheet, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import LikeSvg from '@/assets/svgs/like.svg';
import SendSvg from '@/assets/svgs/send.svg';

class AnimatedPress extends Component<{message: string}> {
  animated: Animated.Value;
  constructor(props: {message: string}) {
    super(props);
    this.animated = new Animated.Value(1);
  }

  shouldComponentUpdate() {
    return false;
  }

  UNSAFE_componentWillReceiveProps(nProps: {message: string}) {
    const {message} = this.props;
    if (message !== nProps.message) {
      Animated.timing(this.animated, {
        toValue: Number(!!message),
        duration: 250,
        useNativeDriver: true,
        easing: Easing.elastic(1.3),
      }).start();
    }
  }

  render() {
    const animatedSend = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0],
    });
    const rotateLike = this.animated.interpolate({
      inputRange: [0, 1],
      outputRange: ['60deg', '0deg'],
    });
    return (
      <Pressable style={styles.inputView}>
        <Animated.View
          style={[
            styles.extension,
            styles.extensionLike,
            {
              transform: [{scale: this.animated}, {rotate: rotateLike}],
              opacity: this.animated,
            },
          ]}>
          <SvgXml width={38} height={38} xml={LikeSvg} />
        </Animated.View>
        <Animated.View
          style={[
            styles.extension,
            {transform: [{scale: animatedSend}], opacity: animatedSend},
          ]}>
          <SvgXml width={28} height={28} xml={SendSvg} />
        </Animated.View>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  inputView: {
    width: 38,
    height: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  extension: {
    height: 38,
    width: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  extensionLike: {
    paddingBottom: 4,
  },
});

export default AnimatedPress;
