import {IconFontAwesome, IconIon, IconMaterial} from '@/Icon';
import React, {Component} from 'react';
import {Image, StyleSheet, Text, Pressable, View, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

interface IProps {
  image: any;
  saveText?: string;
  sendText?: string;
  screen: {width: number; height: number};
  onClose: () => any;
}

class ImageCapture extends Component<IProps> {
  deviceTouch: boolean;
  constructor(props: IProps) {
    super(props);
    this.deviceTouch = DeviceInfo.hasNotch();
  }
  rotateImage = (exifOrientation: number) => {
    let degRotation;
    switch (exifOrientation) {
      case 3:
        degRotation = '360deg';
        break;
      case 4:
        degRotation = '360deg';
        break;
      case 5:
        degRotation = '90deg';
        break;
      case 6:
        degRotation = '90deg';
        break;
      case 7:
        degRotation = '270deg';
        break;
      case 8:
        degRotation = '270deg';
        break;
      default:
        degRotation = '0deg';
    }
    return degRotation;
  };

  convertUri = (uri: string) => {
    if (Platform.OS === 'android') {
      return uri;
    }
    return decodeURIComponent(uri.replace('file://', ''));
  };

  render() {
    const {
      image,
      saveText = 'Save',
      sendText = 'Send',
      screen,
      onClose,
    } = this.props;
    const heightStatusBar = this.deviceTouch ? 40 : 20;
    const {width, height} = screen;
    return (
      <View style={[styles.view, {width, height}]}>
        <Pressable
          onPress={onClose}
          style={[styles.iconClose, {top: heightStatusBar}]}>
          <IconIon name="ios-close" size={30} color="#fff" />
        </Pressable>
        <Image
          style={[
            styles.view,
            {
              width,
              height,
              transform: [{rotate: this.rotateImage(image.deviceOrientation)}],
            },
          ]}
          source={{uri: this.convertUri(image.uri)}}
          resizeMode="contain"
        />
        <Pressable>
          <View style={styles.buttonSave}>
            <View style={styles.flexCenter}>
              <IconFontAwesome size={16} name="long-arrow-down" color="#fff" />
            </View>
            <View style={styles.flexCenter}>
              <View style={styles.viewLineDown} />
            </View>
            <Text style={styles.textSave}>{saveText}</Text>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.buttonSend}>
            <Text style={styles.textSend}>{sendText}</Text>
            <IconMaterial color="#fff" size={16} name="send" />
          </View>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  iconClose: {
    position: 'absolute',
    left: 15,
    zIndex: 2,
    width: 30,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2.5,
  },
  buttonSave: {
    position: 'absolute',
    bottom: 44,
    left: 30,
  },
  buttonSend: {
    position: 'absolute',
    bottom: 44,
    right: 20,
    backgroundColor: '#4a87ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  textSend: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  flexCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textSave: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  viewLineDown: {
    backgroundColor: '#fff',
    height: 2,
    width: 17,
    marginTop: 3,
    marginBottom: 10,
    marginRight: 1,
  },
});

export default ImageCapture;
