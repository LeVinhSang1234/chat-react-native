import BlurView from '@/BlurView';
import React, {Component} from 'react';
import {LayoutChangeEvent, Pressable, StyleSheet, View} from 'react-native';
// import SendSvg from '@/assets/svgs/send.svg';
import LikeSvg from '@/assets/svgs/like.svg';
import {SvgXml} from 'react-native-svg';
import {ChatProvider, InputChatProvider} from '@/ChatProvider/provider';
import ChildrenFreeze from '@/ChildrenFreeze';

interface ViewChatProps {
  extension?: JSX.Element;
}

interface ViewChatState {
  widthExtension: number;
  opacity: number;
  contextMenuHidden: boolean;
}

class ViewChat extends Component<ViewChatProps, ViewChatState> {
  constructor(props: ViewChatProps) {
    super(props);
    const {extension} = props;
    this.state = {
      widthExtension: 0,
      opacity: Number(!extension),
      contextMenuHidden: false,
    };
  }

  onLayoutExtendsion = ({nativeEvent: {layout}}: LayoutChangeEvent) => {
    const {widthExtension} = this.state;
    if (!widthExtension && widthExtension !== layout.width) {
      return this.setState({widthExtension: layout.width, opacity: 1});
    }
    this.setState({opacity: 1});
  };

  onPressOut = () => {};

  render() {
    const {children, extension} = this.props;
    const {opacity, widthExtension, contextMenuHidden} = this.state;
    return (
      <InputChatProvider.Provider
        value={{onPressOut: this.onPressOut, contextMenuHidden}}>
        <BlurView style={[styles.view, {opacity}]}>
          <ChildrenFreeze extension={extension}>
            {extension ? (
              <View style={styles.extension} onLayout={this.onLayoutExtendsion}>
                {extension}
              </View>
            ) : null}
          </ChildrenFreeze>
          <ChatProvider.Consumer>
            {({width}) => (
              <ChildrenFreeze props={width + widthExtension}>
                <View
                  style={[
                    styles.inputView,
                    {width: width - widthExtension - 70},
                  ]}>
                  {children}
                </View>
              </ChildrenFreeze>
            )}
          </ChatProvider.Consumer>
          <ChildrenFreeze>
            <Pressable style={styles.extension}>
              <SvgXml width={40} height={40} xml={LikeSvg} />
            </Pressable>
          </ChildrenFreeze>
        </BlurView>
      </InputChatProvider.Provider>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  extension: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputView: {
    marginHorizontal: 7,
  },
});

export default ViewChat;
