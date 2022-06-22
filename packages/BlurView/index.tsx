import React, {Component} from 'react';
import {Appearance, ColorSchemeName, Platform, View} from 'react-native';
import {
  BlurView as Blur,
  BlurViewProperties,
} from '@react-native-community/blur';

interface BlurViewState {
  colorScheme: ColorSchemeName;
}

class BlurView extends Component<BlurViewProperties, BlurViewState> {
  eventAppearance: any;
  constructor(props: BlurViewProperties) {
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
    const {children, style, ...p} = this.props;
    const {colorScheme = 'light'} = this.state;
    const Com: any = Platform.select({android: View, default: Blur} as any);
    const styles = Platform.select({
      android: [
        {backgroundColor: colorScheme === 'light' ? '#fff' : '#141414'},
        style,
      ],
      ios: style,
    });
    return (
      <Com style={styles} blurType={colorScheme} {...p}>
        {children}
      </Com>
    );
  }
}

export default BlurView;
