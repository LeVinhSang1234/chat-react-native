import React, {Component} from 'react';
import {
  GestureResponderEvent,
  PanResponder,
  View,
  ViewProps,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export declare type MoveHandleProps = {
  onPressDouble?: (e: GestureResponderEvent) => any;
  durationPressDouble?: number;
  onMove?: (value: {x: number; y: number}) => any;
  onZoom?: (
    previous: {x: number; y: number},
    next: {x: number; y: number},
  ) => any;
} & ViewProps;

class MoveHandle extends Component<MoveHandleProps> {
  timoutPress?: NodeJS.Timeout;
  pressPoint?: {x: number; y: number};
  movePoint?: {x: number; y: number};
  panResponder: any;
  identifierPoint: {[key: string | number]: any};
  deviceTouch: boolean;

  constructor(props: MoveHandleProps) {
    super(props);
    this.pressPoint = undefined;
    this.movePoint = undefined;
    this.identifierPoint = {};
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e: GestureResponderEvent) => {
        this.pressPoint = {x: e.nativeEvent.pageX, y: e.nativeEvent.pageY};
        return true;
      },
      onPanResponderMove: this.onResponderMove,
    });
    this.deviceTouch = DeviceInfo.hasNotch();
  }

  onTouchStart = ({nativeEvent}: GestureResponderEvent) => {
    this.identifierPoint[nativeEvent.identifier] = nativeEvent;
    this.pressPoint = {x: nativeEvent.pageX, y: nativeEvent.pageY};
  };

  onStartShouldSetResponder = ({nativeEvent}: GestureResponderEvent) => {
    const {pageX, pageY} = nativeEvent;
    if (!this.pressPoint) {
      return false;
    }
    const {x, y} = this.pressPoint;
    return Math.abs(pageX - x) > 20 || Math.abs(pageY - y) > 20;
  };

  onResponderMove = ({nativeEvent}: GestureResponderEvent) => {
    const {onMove} = this.props;
    if (!this.pressPoint) {
      return;
    }
    const {x, y} = this.pressPoint;
    if (y < (this.deviceTouch ? 44 : 20)) {
      return;
    }
    if (
      Math.abs(nativeEvent.pageX - x) > 40 ||
      Math.abs(nativeEvent.pageY - y) > 40
    ) {
      if (this.movePoint) {
        onMove?.({
          x: nativeEvent.pageX - this.movePoint.x,
          y: nativeEvent.pageY - this.movePoint.y,
        });
      }
      this.movePoint = {x: nativeEvent.pageX, y: nativeEvent.pageY};
    }
  };

  onTouchEnd = (e: GestureResponderEvent) => {
    if (this.movePoint) {
      this.pressPoint = undefined;
      this.movePoint = undefined;
      return;
    }
    e.persist();
    const {onPressDouble, durationPressDouble = 300, onTouchEnd} = this.props;
    if (this.timoutPress) {
      clearTimeout(this.timoutPress);
      this.timoutPress = undefined;
      if (Object.keys(this.identifierPoint).length < 2) {
        onPressDouble?.(e);
      }
      this.identifierPoint = {};
    } else {
      this.timoutPress = setTimeout(() => {
        this.identifierPoint = {};
        this.timoutPress = undefined;
        onTouchEnd?.(e);
      }, durationPressDouble);
    }
  };

  onTouchMove = ({nativeEvent}: GestureResponderEvent) => {
    if (Object.keys(this.identifierPoint).length < 2) {
      return;
    }
    const {onZoom} = this.props;
    const iPre =
      Number(nativeEvent.identifier) -
      (Number(nativeEvent.identifier) < 2 ? -1 : 1);
    const {pageX: pageXPre, pageY: pageYPre} = this.identifierPoint[iPre];
    const {pageX, pageY} = this.identifierPoint[nativeEvent.identifier];
    const {pageX: pageXNow, pageY: pageYNow} = nativeEvent;
    onZoom?.(
      {x: Math.abs(pageX - pageXPre), y: Math.abs(pageY - pageYPre)},
      {x: Math.abs(pageXPre - pageXNow), y: Math.abs(pageYPre - pageYNow)},
    );
    this.identifierPoint[nativeEvent.identifier] = nativeEvent;
  };

  render() {
    const {children, ...props} = this.props;
    return (
      <View
        {...props}
        onTouchStart={this.onTouchStart}
        {...this.panResponder.panHandlers}
        onTouchEnd={this.onTouchEnd}
        onTouchMove={this.onTouchMove}>
        {children}
      </View>
    );
  }
}

export default MoveHandle;
