import Text from '@/Text';
import React, {Component} from 'react';
import {Linking, Pressable, StyleSheet, View} from 'react-native';

export declare type NotAuthorizedProps = {
  cameraPermission?: string;
  cameraPermissionDescription?: string;
  openSettingAppText?: string;
  stylePermission?: {};
};

class NotAuthorized extends Component<NotAuthorizedProps> {
  render() {
    const {cameraPermission, cameraPermissionDescription, openSettingAppText} =
      this.props;
    return (
      <View style={[styles.view]}>
        <View>
          <Text style={styles.textPermission}>
            {cameraPermission ||
              'Bật quyền truy cập vào camera trong phần cài đặt thiết bị'}
          </Text>
          <Text style={styles.textPermissionDescription}>
            {cameraPermissionDescription ||
              'NativeChat dùng camera của thiết bị để bạn có thể làm những việc như chụp ảnh, quay và phát video.'}
          </Text>
          <Pressable
            style={styles.openSetting}
            onPress={() => Linking.openSettings()}>
            <Text style={styles.textOpenSeting}>
              {openSettingAppText || 'Đi tới cài đặt'}
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  textPermission: {
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 19,
  },
  textPermissionDescription: {
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 19,
    fontSize: 13,
    paddingHorizontal: 10,
    fontWeight: '400',
  },
  openSetting: {
    marginTop: 25,
  },
  textOpenSeting: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#3473d8',
  },
});

export default NotAuthorized;
