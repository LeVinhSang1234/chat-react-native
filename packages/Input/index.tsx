import {InputProps} from '@/types';
import React, {Component} from 'react';
import {Platform, Pressable, StyleSheet, TextInput} from 'react-native';

interface InputAndroidState {
  height: number;
}

class InputAndroid extends Component<InputProps, InputAndroidState> {
  textInputRef?: TextInput | null;
  constructor(props: InputProps) {
    super(props);
    this.state = {height: 0};
  }

  onPress = () => {
    this.textInputRef?.focus?.();
  };

  onContentSizeChange = ({nativeEvent}: any) => {
    this.setState({height: nativeEvent.contentSize.height});
  };

  render() {
    const {height} = this.state;
    const {style, styleInput, value, ...p} = this.props;
    return (
      <Pressable style={[styles.inputView, style]} onPress={this.onPress}>
        <TextInput
          ref={(ref: any) => (this.textInputRef = ref)}
          {...p}
          style={[styles.inputAndroid, styleInput, {height}]}
          onContentSizeChange={this.onContentSizeChange}>
          {value}
        </TextInput>
      </Pressable>
    );
  }
}

class InputIOS extends Component<InputProps> {
  textInputRef?: TextInput | null;

  onPress = () => {
    this.textInputRef?.focus?.();
  };

  render() {
    const {style, styleInput, value, ...p} = this.props;
    return (
      <Pressable style={[styles.inputView, style]} onPress={this.onPress}>
        <TextInput
          ref={(ref: any) => (this.textInputRef = ref)}
          {...p}
          style={styleInput}>
          {value}
        </TextInput>
      </Pressable>
    );
  }
}

class Input extends Component<InputProps> {
  render() {
    const Com = Platform.select({
      android: InputAndroid,
      default: InputIOS,
    });
    return <Com {...this.props} />;
  }
}

const styles = StyleSheet.create({
  inputView: {
    borderRadius: 20,
    paddingVertical: Platform.select({
      android: 0,
      default: 5,
    }),
    paddingBottom: Platform.select({
      android: 0,
      default: 8,
    }),
    paddingHorizontal: 14,
    textAlignVertical: 'center',
    fontSize: 14,
    flexGrow: 1,
    maxHeight: 180,
  },
  inputAndroid: {
    maxHeight: 180,
    minHeight: 38,
  },
});

export default Input;
