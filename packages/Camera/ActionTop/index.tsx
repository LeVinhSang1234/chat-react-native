import {IconIon} from '@/Icon';
import React, {Component, Fragment} from 'react';
import {StyleSheet, Text, Pressable, View} from 'react-native';
import {FlashMode} from 'react-native-camera';
import DeviceInfo from 'react-native-device-info';

interface ActionTopProps {
  flashMode: keyof FlashMode;
  onClose?: () => any;
  onChangeType: () => any;
  onChangeFlash: () => any;
  screen: {width: number; height: number};
}

class ActionTop extends Component<ActionTopProps> {
  deviceTouch: boolean;
  constructor(props: ActionTopProps) {
    super(props);
    this.deviceTouch = DeviceInfo.hasNotch();
  }

  shouldComponentUpdate(nProps: ActionTopProps) {
    const {flashMode, screen} = this.props;
    return flashMode !== nProps.flashMode || screen !== nProps.screen;
  }

  renderNameFlash = () => {
    const {flashMode} = this.props;
    if (flashMode !== 'off') {
      return 'ios-flash';
    }
    return 'ios-flash-off';
  };
  render() {
    const {onClose, onChangeType, onChangeFlash, flashMode, screen} =
      this.props;
    const heightStatusBar = this.deviceTouch ? 40 : 20;

    return (
      <Fragment>
        <Pressable
          onPress={onClose}
          style={[styles.iconClose, {top: heightStatusBar}]}>
          <IconIon name="ios-close" size={30} color="#fff" />
        </Pressable>
        <View
          style={[
            styles.iconChangeCamera,
            {left: screen.width / 2 - 40, top: heightStatusBar},
          ]}>
          <View style={styles.flash}>
            <Pressable onPress={onChangeType}>
              <View style={styles.viewCameraReverse}>
                <IconIon name="ios-camera-reverse" size={30} color="#fff" />
              </View>
            </Pressable>
            <Pressable onPress={onChangeFlash}>
              <View style={styles.viewCameraReverse}>
                <View style={[styles.mt2]}>
                  <IconIon
                    name={this.renderNameFlash()}
                    size={24}
                    color="#fff"
                  />
                </View>
                {flashMode === 'auto' ? (
                  <Text style={styles.textAFlash}>A</Text>
                ) : null}
              </View>
            </Pressable>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  iconClose: {
    position: 'absolute',
    left: 15,
    zIndex: 1000,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2.5,
  },
  iconChangeCamera: {
    position: 'absolute',
    zIndex: 2,
    width: 100,
    height: 30,
    flexDirection: 'row',
  },
  flash: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
  },
  textAFlash: {
    position: 'absolute',
    bottom: 4,
    right: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewCameraReverse: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 40,
    height: 40,
  },
  mt2: {
    marginTop: 2,
  },
});

export default ActionTop;
