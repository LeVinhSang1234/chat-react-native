import {InputProps} from '@/types';
import React, {Component} from 'react';
import {
  Platform,
  PlatformColor,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

interface IState {
  isFocus: boolean;
}

class Input extends Component<InputProps, IState> {
  textInputRef?: TextInput | null;
  heightInput?: number;

  onPress = () => {
    this.textInputRef?.focus?.();
  };

  onLayout = () => {
    const {animationLayout} = this.props;
    animationLayout?.();
  };

  onChangeText = () => {
    const {animationLayout} = this.props;
    animationLayout?.();
  };

  render() {
    const {style, styleInput, value, animationLayout, ...p} = this.props;
    const color = Platform.select({
      default: PlatformColor('label'),
      android: PlatformColor('?android:attr/textColor'),
    });
    return (
      <Pressable style={[styles.input, style]} onPress={this.onPress}>
        <TextInput
          onChangeText={this.onChangeText}
          ref={ref => (this.textInputRef = ref)}
          textAlignVertical="center"
          placeholderTextColor={Platform.select({
            default: PlatformColor('placeholderText'),
            android: PlatformColor('?android:attr/placeholderText'),
          })}
          multiline
          style={[{color}, styleInput]}
          {...p}>
          {value}
        </TextInput>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    minHeight: 38,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 11,
    textAlignVertical: 'center',
    fontSize: 14,
    paddingTop: 6,
    maxHeight: 180,
    flexGrow: 1,
  },
});

export default Input;
