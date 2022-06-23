import BlurView from '@/BlurView';
import {ChatDataProvider, KeyboardProvider} from '@/ChatProvider/provider';
import Text from '@/Text';
import React, {Component} from 'react';
import {
  Appearance,
  ColorSchemeName,
  FlatList,
  Platform,
  PressableProps,
  StyleSheet,
  View,
} from 'react-native';

interface ContentState {
  colorScheme: ColorSchemeName;
}

const bg = {
  light: '#fff',
  dark: Platform.select({android: '#000', default: '#1a1a1a'}),
};

class Content extends Component<PressableProps, ContentState> {
  eventChange: any;
  scrolling: boolean;
  constructor(props: PressableProps) {
    super(props);
    this.state = {colorScheme: Appearance.getColorScheme()};
    this.eventChange = Appearance.addChangeListener(this.changeColor);
    this.scrolling = false;
  }

  componentWillUnmount() {
    this.eventChange?.remove?.();
  }

  changeColor = ({colorScheme}: any) => {
    this.setState({colorScheme});
  };

  renderItem = ({item}: any) => {
    return (
      <View key={item._id} style={[{paddingVertical: 30}]}>
        <Text>{item.message}</Text>
      </View>
    );
  };

  onScrollBeginDrag = () => {
    this.scrolling = true;
  };

  onScrollEndDrag = () => {
    this.scrolling = false;
  };

  touchEnd = (callback: any) => {
    if (!this.scrolling) {
      callback?.();
    }
  };

  render() {
    const {colorScheme} = this.state;
    return (
      <KeyboardProvider.Consumer>
        {({dismiss}) => (
          <ChatDataProvider.Consumer>
            {({messages}) => (
              <FlatList
                onTouchEnd={() => this.touchEnd(dismiss)}
                onScrollBeginDrag={this.onScrollBeginDrag}
                onScrollEndDrag={this.onScrollEndDrag}
                style={[
                  styles.flatlist,
                  {backgroundColor: bg[colorScheme || 'light']},
                ]}
                inverted
                contentContainerStyle={[styles.flatlistContainer]}
                data={messages}
                renderItem={this.renderItem}
                keyExtractor={item => item._id}
              />
            )}
          </ChatDataProvider.Consumer>
        )}
      </KeyboardProvider.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  flatlist: {
    overflow: Platform.select({android: 'scroll', default: 'visible'}),
  },
  flatlistContainer: {
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
});

export default Content;
