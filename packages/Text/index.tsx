import React, {Component} from 'react';
import {
  Appearance,
  ColorSchemeName,
  Text as TextLibrary,
  TextProps,
} from 'react-native';

interface TextState {
  colorScheme: ColorSchemeName;
}
class Text extends Component<TextProps, TextState> {
  eventAppearance: any;
  constructor(props: TextProps) {
    super(props);
    const colorScheme = Appearance.getColorScheme();
    this.state = {colorScheme};
    this.eventAppearance = Appearance.addChangeListener(this.changeColor);
  }

  componentWillUnmount() {
    this.setState = () => {};
    this.eventAppearance?.remove?.();
  }

  changeColor = ({colorScheme}: {colorScheme: ColorSchemeName}) => {
    this.setState({colorScheme});
  };

  render() {
    const {colorScheme = 'light'} = this.state;
    const {style, ...p} = this.props;
    const color = colorScheme === 'light' ? '#000' : '#fff';
    return <TextLibrary style={[{color}, style]} {...p} />;
  }
}

export default Text;
