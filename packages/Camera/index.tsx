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
  zoom: number;
}

class Camera extends Component<CameraProps, CameraState> {
  camera?: RNCamera | null;
  screen: {width: number; height: number};
  isFocusPoint: boolean;
  constructor(props: CameraProps) {
    super(props);
    this.state = {
      permission: 'READY',
      cameraReady: true,
      type: 'back',
      focusPoint: {x: 0.5, y: 0.5},
      exposure: -1,
      zoom: 0,
    };
    this.screen = Dimensions.get('window');
    this.isFocusPoint = false;
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
      this.isFocusPoint = false;
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
    this.isFocusPoint = true;
  };

  handleResetFocusPoint = () => {
    this.isFocusPoint = false;
  };

  onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;
    this.screen = layout;
  };

  getLayout = () => {
    return this.screen;
  };

  onMove = ({y}: {y: number}) => {
    if (!this.isFocusPoint) {
      return;
    }
    const {exposure, type} = this.state;
    const {height} = this.screen;
    if (type === 'front') {
      return;
    }
    let newEx = (exposure === -1 ? 0.5 : exposure) - y / 2 / height;
    if (newEx <= 0) {
      newEx = 0;
    } else if (newEx >= 1) {
      newEx = 1;
    }
    this.setState({exposure: newEx});
  };

  onZoom = (
    {x, y}: {x: number; y: number},
    {x: xNext, y: yNext}: {x: number; y: number},
  ) => {
    const {zoom} = this.state;
    let change = 0;
    if (xNext > yNext) {
      change = zoom + (xNext - x) / 20000;
    } else {
      change = zoom + (yNext - y) / 20000;
    }
    if (change < 0) {
      change = 0;
    } else if (change > 1) {
      change = 1;
    }
    this.setState({zoom: change});
  };

  render() {
    const {permission, focusPoint, cameraReady, zoom} = this.state;
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
    const autoPoint = type === 'front' || !cameraReady ? undefined : focusPoint;
    return (
      <MoveHandle
        onZoom={this.onZoom}
        onLayout={this.onLayout}
        style={styles.camera}
        onPressDouble={this.changeType}
        onTouchEnd={this.onFocusPoint}
        onMove={this.onMove}>
        <RNCamera
          zoom={zoom}
          exposure={exposure}
          type={type}
          style={styles.camera}
          captureAudio={false}
          onStatusChange={this.onStatusChange}
          onCameraReady={this.onCameraReady}
          ref={ref => (this.camera = ref)}
          autoFocusPointOfInterest={autoPoint}
        />
        <FocusPoint
          handleResetFocusPoint={this.handleResetFocusPoint}
          exposure={exposure}
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
