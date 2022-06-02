import React, {Component} from 'react';
import {
  Platform,
  PlatformColor,
  Text as TextLibrary,
  TextProps,
} from 'react-native';

const TextHooks = React.forwardRef((props: TextProps, ref: any) => {
  const {children, style} = props;
  const styleDynamic = Platform.select({
    ios: {color: PlatformColor('label')},
    android: {color: PlatformColor('?android:attr/textColor')},
    default: {color: 'black'},
  });
  return (
    <TextLibrary ref={ref} style={[styleDynamic, style]}>
      {children}
    </TextLibrary>
  );
});

class Text extends Component<TextProps> {
  render() {
    return <TextHooks {...this.props} />;
  }
}

export default Text;
