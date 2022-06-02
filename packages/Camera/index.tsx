import React, {Component, lazy, Suspense} from 'react';
import {RNCamera} from 'react-native-camera';
import {LogBox, Modal} from 'react-native';
import {NotAuthorizedProps} from './NotAuthorized';

const NotAuthorized = lazy(() => import('./NotAuthorized'));

LogBox.ignoreLogs(['ViewPropTypes will be']);

export declare type CameraProps = {} & NotAuthorizedProps;

interface CameraState {
  permission: 'READY' | 'PENDING_AUTHORIZATION' | 'NOT_AUTHORIZED';
  cameraReady: boolean;
}

class Camera extends Component<CameraProps, CameraState> {
  camera?: RNCamera | null;
  constructor(props: CameraProps) {
    super(props);
    this.state = {permission: 'READY', cameraReady: false};
  }

  onCameraReady = () => {
    this.setState({cameraReady: true});
  };

  onStatusChange = ({cameraStatus}: any) => {
    this.setState({permission: cameraStatus});
  };

  render() {
    const {permission} = this.state;
    const {
      cameraPermission,
      cameraPermissionDescription,
      openSettingAppText,
      stylePermission,
    } = this.props;
    if (permission === 'NOT_AUTHORIZED') {
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
      <RNCamera
        captureAudio={false}
        onStatusChange={this.onStatusChange}
        onCameraReady={this.onCameraReady}
        ref={ref => {
          this.camera = ref;
        }}
      />
    );
  }
}

export default Camera;
