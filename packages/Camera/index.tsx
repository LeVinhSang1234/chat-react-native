import React, {Component, lazy, Suspense} from 'react';
import {RNCamera} from 'react-native-camera';
import {
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  LogBox,
  StyleSheet,
} from 'react-native';
import {NotAuthorizedProps} from './NotAuthorized';
import MoveHandle from './MoveHandle';
import FocusPoint from './FocusPoint';

const NotAuthorized = lazy(() => import('./NotAuthorized'));

LogBox.ignoreLogs(['ViewPropTypes will be']);

export declare type CameraProps = {} & NotAuthorizedProps;

interface CameraState {
  permission: 'READY' | 'PENDING_AUTHORIZATION' | 'NOT_AUTHORIZED';
  cameraReady: boolean;
  type: 'front' | 'back';
  focusPoint: {x: number; y: number};
  exposure: number;
}

class Camera extends Component<CameraProps, CameraState> {
  camera?: RNCamera | null;
  screen: {width: number; height: number};
  constructor(props: CameraProps) {
    super(props);
    this.state = {
      permission: 'READY',
      cameraReady: true,
      type: 'back',
      focusPoint: {x: 0.5, y: 0.5},
      exposure: -1,
    };
    this.screen = Dimensions.get('window');
  }

  onCameraReady = () => {
    const {cameraReady} = this.state;
    if (!cameraReady) {
      this.setState({cameraReady: true});
    }
  };

  onStatusChange = ({cameraStatus}: any) => {
    const {permission} = this.state;
    if (cameraStatus !== permission) {
      this.setState({permission: cameraStatus});
    }
  };

  changeType = () => {
    const {type, cameraReady} = this.state;
    if (cameraReady) {
      this.setState({
        type: type === 'front' ? 'back' : 'front',
        cameraReady: false,
        focusPoint: {x: 0.5, y: 0.5},
      });
    }
  };

  onFocusPoint = ({nativeEvent}: GestureResponderEvent) => {
    const {type} = this.state;
    if (!nativeEvent || type === 'front') {
      return;
    }
    const {pageX, pageY} = nativeEvent;
    this.setState({
      exposure: -1,
      focusPoint: {
        x: pageY / this.screen.height,
        y: 1 - pageX / this.screen.width,
      },
    });
  };

  onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;
    this.screen = layout;
  };

  getLayout = () => {
    return this.screen;
  };

  render() {
    const {permission, focusPoint, cameraReady} = this.state;
    const {
      cameraPermission,
      cameraPermissionDescription,
      openSettingAppText,
      stylePermission,
    } = this.props;
    const {type, exposure} = this.state;
    if (permission !== 'READY') {
      return (
        <Suspense fallback={null}>
          <NotAuthorized
            cameraPermission={cameraPermission}
            cameraPermissionDescription={cameraPermissionDescription}
            openSettingAppText={openSettingAppText}
            stylePermission={stylePermission}
          />
        </Suspense>
      );
    }
    return (
      <MoveHandle
        onLayout={this.onLayout}
        style={styles.camera}
        onPressDouble={this.changeType}
        onPress={this.onFocusPoint}>
        <RNCamera
          exposure={exposure}
          type={type}
          style={styles.camera}
          captureAudio={false}
          onStatusChange={this.onStatusChange}
          onCameraReady={this.onCameraReady}
          ref={ref => {
            this.camera = ref;
          }}
          autoFocusPointOfInterest={
            type === 'front' || !cameraReady ? undefined : focusPoint
          }
        />
        <FocusPoint
          type={type}
          getLayout={this.getLayout}
          focusPoint={focusPoint}
        />
      </MoveHandle>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});

export default Camera;
