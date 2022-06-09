// @refresh reset
import Text from '@/Text';
import {KeyboardProps} from '@/types';
import React, {Component} from 'react';
import {View} from 'react-native';

interface IKeyboardState {
  height: number;
}

class Keyboard extends Component<KeyboardProps, IKeyboardState> {
  initHeight: number;
  constructor(props: KeyboardProps) {
    super(props);
    this.initHeight = 320;
    this.state = {height: 70};
  }

  render() {
    const {height} = this.state;
    return (
      <View removeClippedSubviews style={{height}}>
        <Text>sang</Text>
      </View>
    );
  }
}

export default Keyboard;
