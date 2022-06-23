import {InputChatProvider} from '@/ChatProvider/provider';
import {InputChatProps} from '@/types/InputChat';
import React, {Component} from 'react';
import {
  Appearance,
  ColorSchemeName,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';

interface InputChatState {
  colorScheme: ColorSchemeName;
}

const bg = {light: 'rgba(240, 242, 245, 0.8)', dark: 'rgba(48, 48, 47, 0.8)'};
const colors = {light: '#000', dark: '#fff'};

class InputChat extends Component<InputChatProps, InputChatState> {
  eventChange: any;
  inputRef?: TextInput | null;
  constructor(props: InputChatProps) {
    super(props);
    this.state = {colorScheme: Appearance.getColorScheme()};
    this.eventChange = Appearance.addChangeListener(this.changeColor);
  }

  shouldComponentUpdate(_: InputChatProps, nState: InputChatState) {
    const {colorScheme} = this.state;
    return colorScheme !== nState.colorScheme;
  }

  componentWillUnmount() {
    this.eventChange?.remove?.();
  }

  changeColor = ({colorScheme}: any) => {
    this.setState({colorScheme});
  };

  onPressInput = () => {
    this.inputRef?.focus?.();
  };

  render() {
    const {colorScheme} = this.state;
    return (
      <InputChatProvider.Consumer>
        {({onPressOut, contextMenuHidden, message, onChangeMessage}) => (
          <Pressable
            onPress={() => {
              this.onPressInput();
              onPressOut();
            }}
            style={[
              styles.viewInput,
              {backgroundColor: bg[colorScheme || 'light']},
            ]}>
            <TextInput
              onChangeText={onChangeMessage}
              onPressOut={onPressOut}
              contextMenuHidden={contextMenuHidden}
              placeholder="Aa"
              ref={ref => (this.inputRef = ref)}
              style={[styles.input, {color: colors[colorScheme || 'light']}]}
              multiline
              placeholderTextColor="#6e6e6e"
              textAlignVertical="center">
              {message}
            </TextInput>
          </Pressable>
        )}
      </InputChatProvider.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  viewInput: {
    minHeight: 38,
    maxHeight: 180,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  input: {
    padding: 0,
    margin: Platform.select({android: -2, default: 0}),
  },
});

export default InputChat;
