import {InputChatProps} from '@/types/InputChat';
import React, {Component} from 'react';
import {
  Appearance,
  ColorSchemeName,
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
      <Pressable
        onPress={this.onPressInput}
        style={[
          styles.viewInput,
          {backgroundColor: bg[colorScheme || 'light']},
        ]}>
        <TextInput
          ref={ref => (this.inputRef = ref)}
          style={[{color: colors[colorScheme || 'light']}]}
          multiline
          textAlignVertical="center"
          value="sdas"
        />
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  viewInput: {
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20
  },
});

export default InputChat;
