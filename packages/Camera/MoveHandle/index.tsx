import React, {Component} from 'react';
import {GestureResponderEvent, Pressable, PressableProps} from 'react-native';

export declare type MoveHandleProps = {
  onPressDouble?: (e: GestureResponderEvent) => any;
  durationPressDouble?: number;
} & PressableProps;

class MoveHandle extends Component<MoveHandleProps> {
  timoutPress?: NodeJS.Timeout;

  onTouchMove = ({nativeEvent}: GestureResponderEvent) => {
    console.log(nativeEvent);
  };

  onPress = (e: GestureResponderEvent) => {
    e.persist();
    const {onPress, onPressDouble, durationPressDouble = 300} = this.props;
    if (this.timoutPress) {
      clearTimeout(this.timoutPress);
      this.timoutPress = undefined;
      onPressDouble?.(e);
    } else {
      this.timoutPress = setTimeout(() => {
        this.timoutPress = undefined;
        onPress?.(e);
      }, durationPressDouble);
    }
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <Pressable
        {...props}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderMove={this.onTouchMove}
        onPress={this.onPress}>
        {children}
      </Pressable>
    );
  }
}

export default MoveHandle;
