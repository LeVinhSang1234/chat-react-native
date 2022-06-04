import {IconIon} from '@/Icon';
import React, {Component} from 'react';
import {Animated, Easing, StyleSheet, View} from 'react-native';

interface FocusPointProps {
  focusPoint: {x: number; y: number};
  getLayout: () => {width: number; height: number};
  type: 'front' | 'back';
  exposure: number;
  handleResetFocusPoint: () => any;
}

const heightLine = 120;

class FocusPoint extends Component<FocusPointProps> {
  animated: Animated.Value;
  animatedLine: Animated.Value;
  constructor(props: FocusPointProps) {
    super(props);
    this.animated = new Animated.Value(0);
    this.animatedLine = new Animated.Value(0);
  }

  shouldComponentUpdate(nProps: FocusPointProps) {
    const {focusPoint, exposure} = this.props;
    const {type} = nProps;
    if (type === 'front') {
      this.animated.stopAnimation();
      this.animatedLine.stopAnimation();
      this.animated.setValue(0);
      this.animated.extractOffset();
    }
    return (
      (type !== 'front' && focusPoint !== nProps.focusPoint) ||
      exposure !== nProps.exposure
    );
  }

  UNSAFE_componentWillReceiveProps(nProps: FocusPointProps) {
    const {focusPoint, type, exposure} = this.props;
    const {focusPoint: pointProps} = nProps;
    if (
      focusPoint.x !== pointProps.x &&
      focusPoint.y !== pointProps.y &&
      type === nProps.type &&
      nProps.type === 'back'
    ) {
      this.animatedPoint();
    } else if (type === 'back' && exposure !== nProps.exposure) {
      this.handleAnimatedLine();
    }
  }

  handleAnimatedLine = () => {
    const {handleResetFocusPoint} = this.props;
    this.animated.stopAnimation();
    this.animatedLine.stopAnimation();
    Animated.parallel([
      Animated.timing(this.animated, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(this.animatedLine, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished) {
        Animated.parallel([
          Animated.timing(this.animated, {
            toValue: 0.4,
            duration: 300,
            delay: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(this.animatedLine, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            delay: 4000,
          }),
        ]).start(({finished: f}) => {
          if (f) {
            Animated.timing(this.animated, {
              toValue: 0,
              duration: 300,
              delay: 4000,
              useNativeDriver: true,
            }).start(({finished: fi}) => {
              if (fi) {
                handleResetFocusPoint?.();
              }
            });
          }
        });
      }
    });
  };

  animatedPoint = () => {
    this.animated.stopAnimation();
    this.animatedLine.stopAnimation();
    this.animated.setValue(2);
    const {handleResetFocusPoint} = this.props;
    Animated.timing(this.animated, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
      easing: Easing.elastic(1.1),
    }).start(({finished}) => {
      if (finished) {
        Animated.timing(this.animated, {
          toValue: 0.4,
          duration: 300,
          delay: 4000,
          useNativeDriver: true,
        }).start(({finished: f}) => {
          if (f) {
            Animated.timing(this.animated, {
              toValue: 0,
              duration: 300,
              delay: 4000,
              useNativeDriver: true,
            }).start(({finished: fi}) => {
              if (fi) {
                handleResetFocusPoint?.();
              }
            });
          }
        });
      }
    });
  };

  getHeightLine1 = () => {
    const {exposure} = this.props;
    if (exposure === -1) {
      return heightLine / 2;
    }
    return heightLine * (1 - exposure);
  };

  getHeightLine2 = () => {
    const {exposure} = this.props;
    if (exposure === -1) {
      return heightLine / 2;
    }
    return heightLine * exposure;
  };

  render() {
    const {focusPoint, getLayout} = this.props;
    const {x, y} = focusPoint;
    const {width, height} = getLayout();
    const opacity = this.animated.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [0, 1, 1],
    });
    const scale = this.animated.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [1, 1, 1.5],
    });
    const styleLine = y < 0.2 ? {left: -30} : {right: -30};

    return (
      <Animated.View
        style={[
          styles.view,
          {
            left: (1 - y) * width - 35,
            top: x * height - 35,
            transform: [{scale}],
            opacity,
          },
        ]}>
        <View style={styles.relative}>
          <Animated.View style={[styles.viewChild]}>
            <View style={styles.child1} />
            <View style={styles.child2} />
            <View style={styles.child3} />
            <View style={styles.child4} />
          </Animated.View>
          <View style={[styles.viewLight, styleLine]}>
            <Animated.View
              style={[
                styles.line1,
                {
                  height: this.getHeightLine1(),
                  opacity: this.animatedLine,
                },
              ]}
            />
            <View style={styles.viewIcon}>
              <IconIon color="yellow" name="sunny" size={20} />
            </View>
            <Animated.View
              style={[
                styles.line2,
                {
                  height: this.getHeightLine2(),
                  opacity: this.animatedLine,
                },
              ]}
            />
          </View>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    width: 70,
    height: 70,
    position: 'absolute',
  },
  relative: {
    position: 'relative',
  },
  viewChild: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderColor: 'yellow',
    borderWidth: 0.7,
  },
  child1: {
    position: 'absolute',
    width: 1,
    height: 5,
    backgroundColor: 'yellow',
    left: '50%',
    top: 0,
  },
  child2: {
    position: 'absolute',
    width: 1,
    height: 5,
    backgroundColor: 'yellow',
    left: '50%',
    bottom: 0,
  },
  child3: {
    position: 'absolute',
    width: 5,
    height: 1,
    backgroundColor: 'yellow',
    left: 0,
    bottom: '50%',
  },
  child4: {
    position: 'absolute',
    width: 5,
    height: 1,
    backgroundColor: 'yellow',
    right: 0,
    bottom: '50%',
  },
  viewLight: {
    position: 'absolute',
    height: 120,
    width: 21,
    top: -38.5,
  },
  lineLight: {
    position: 'absolute',
  },
  line1: {
    height: 15,
    width: 0.7,
    marginLeft: 9,
    backgroundColor: 'yellow',
  },
  line2: {
    height: 15,
    width: 0.7,
    marginLeft: 9,
    backgroundColor: 'yellow',
  },
  viewIcon: {
    width: 21,
    height: 26,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default FocusPoint;
