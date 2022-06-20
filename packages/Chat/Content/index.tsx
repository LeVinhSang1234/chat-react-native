import {ChatDataProvider, KeyboardProvider} from '@/ChatProvider/provider';
import ChildrenFreeze from '@/ChildrenFreeze';
import Text from '@/Text';
import React, {Component} from 'react';
import {
  Appearance,
  ColorSchemeName,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';

interface ContentState {
  colorScheme: ColorSchemeName;
}

const bg = {light: '#fff', dark: '#000'};

class Content extends Component<PressableProps, ContentState> {
  eventChange: any;
  constructor(props: PressableProps) {
    super(props);
    this.state = {colorScheme: Appearance.getColorScheme()};
    this.eventChange = Appearance.addChangeListener(this.changeColor);
  }

  componentWillUnmount() {
    this.eventChange?.remove?.();
  }

  changeColor = ({colorScheme}: any) => {
    this.setState({colorScheme});
  };

  renderItem = (item: any) => {
    return (
      <View key={item._id} style={[{paddingVertical: 30}]}>
        <Text>{item.message}</Text>
      </View>
    );
  };

  render() {
    const {colorScheme} = this.state;
    return (
      <KeyboardProvider.Consumer>
        {({dismiss}) => (
          <Pressable
            style={[
              styles.inverted,
              {backgroundColor: bg[colorScheme || 'light']},
            ]}
            onPress={dismiss}>
            <ChatDataProvider.Consumer>
              {({messages}) => (
                <ChildrenFreeze messages={messages}>
                  {messages.map(e => this.renderItem(e))}
                </ChildrenFreeze>
              )}
            </ChatDataProvider.Consumer>
          </Pressable>
        )}
      </KeyboardProvider.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  inverted: {
    transform: [{scale: -1}],
    overflow: 'visible',
  },
});

export default Content;
