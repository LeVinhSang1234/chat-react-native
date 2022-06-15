import Input from '@/Input';
import Text from '@/Text';
import {InputChatProps} from '@/types';
import React, {Component} from 'react';
import {
  Appearance,
  ColorSchemeName,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

const theme: any = {
  light: 'rgba(240, 242, 245, 0.8)',
  dark: 'rgba(48, 48, 47, 0.8)',
};

const colorTheme: any = {
  light: '#000',
  dark: '#fff',
};

interface IInputChatState {
  colorScheme: ColorSchemeName;
  contextMenuHidden: boolean;
}

class InputChat extends Component<InputChatProps, IInputChatState> {
  listenerColor: any;
  constructor(props: InputChatProps) {
    super(props);
    const colorScheme = Appearance.getColorScheme();
    this.state = {
      colorScheme,
      contextMenuHidden: true,
    };
    this.listenerColor = Appearance.addChangeListener(this.ListenerColor);
  }

  ListenerColor = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
    this.setState({colorScheme});
  };

  componentWillUnmount() {
    this.listenerColor?.remove?.();
    this.setState = () => {};
  }

  render() {
    const {colorScheme = 'light'} = this.state;
    return (
      <View style={styles.viewInput}>
        <Input
          placeholder="Aa"
          multiline
          style={[{backgroundColor: theme[colorScheme as any]}]}
          styleInput={{color: colorTheme[colorScheme as any]}}
        />
        <AnimatedButton />
      </View>
    );
  }
}

class AnimatedButton extends Component {
  render() {
    return (
      <Pressable style={styles.viewSendButton}>
        <Text>Sang</Text>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  viewInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  viewSendButton: {
    width: 38,
    height: 38,
  },
});

export default InputChat;
