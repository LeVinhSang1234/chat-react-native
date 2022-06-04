import React, {Component, Fragment} from 'react';
import {StyleSheet, Pressable, View} from 'react-native';

interface IProps {
  takePicture: () => any;
  screen: {width: number; height: number};
}

class ActionBottom extends Component<IProps> {
  shouldComponentUpdate(nProps: IProps) {
    const {screen} = this.props;
    return screen !== nProps.screen;
  }

  render() {
    const {takePicture, screen} = this.props;
    return (
      <Fragment>
        <View style={[styles.previewImage]} />
        <Pressable
          onPress={takePicture}
          style={[styles.capture, {left: screen.width / 2 - 33}]}>
          <View style={styles.captureWhite} />
        </Pressable>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  capture: {
    backgroundColor: 'rgba(174,174,174,0.8)',
    width: 70,
    height: 70,
    borderRadius: 50,
    zIndex: 1,
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 34,
  },
  captureWhite: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: '#ffffff',
  },
  previewImage: {
    width: 35,
    height: 35,
    borderRadius: 8,
    position: 'absolute',
    left: 30,
    backgroundColor: '#fff',
    bottom: 52,
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 8,
  },
});

export default ActionBottom;
