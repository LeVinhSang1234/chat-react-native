// @refresh reset
import {ChatDataProviderConsumer} from '@/ChatProvider/provider';
import InputChat from '@/InputChat';
import KeyboardListener from '@/KeyboardListener';
import {ChatDataProviderProps, KeyboardProps} from '@/types';
import React, {Component, Fragment, Suspense} from 'react';
import {StyleSheet, View, KeyboardEvent, Dimensions} from 'react-native';
import {ChatProviderConsumer} from '..';

interface IKeyboardState {
  height: number;
}

class Keyboard extends Component<KeyboardProps, IKeyboardState> {
  initHeight: number;
  constructor(props: KeyboardProps) {
    super(props);
    this.initHeight = 320;
    this.state = {height: 0};
  }

  renderChild = (props: ChatDataProviderProps) => {
    const {ComponentInput, ComponentInputLazy, navbarBottomHeight = 0} = props;
    const {height} = this.state;
    const paddingBottom = !height ? navbarBottomHeight : 0;
    if (ComponentInput) {
      return <ComponentInput style={{paddingBottom}} />;
    }
    if (ComponentInputLazy) {
      return (
        <Suspense fallback={null}>
          <ComponentInputLazy style={{paddingBottom}} />
        </Suspense>
      );
    }
    return <InputChat style={{paddingBottom}} />;
  };

  open = (duration: number = 10) => {
    const {animationLayout} = this.props;
    animationLayout?.(duration);
    this.setState({height: this.initHeight});
  };

  close = (duration: number = 10) => {
    const {animationLayout} = this.props;
    animationLayout?.(duration);
    this.setState({height: 0});
  };

  onHideKeyboard = ({duration}: KeyboardEvent) => {
    this.close(duration);
  };

  onShowKeyboard = ({endCoordinates, duration}: KeyboardEvent) => {
    this.initHeight = endCoordinates.height;
    this.open(duration);
  };

  render() {
    const {height} = this.state;
    return (
      <Fragment>
        <ChatDataProviderConsumer>
          {props => this.renderChild(props)}
        </ChatDataProviderConsumer>
        <View removeClippedSubviews style={[styles.view, {height}]} />
        <KeyboardListener
          onWillShow={this.onShowKeyboard}
          onWillHide={this.onHideKeyboard}
        />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    position: 'relative',
  },
});

export default Keyboard;
