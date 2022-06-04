import React, {Component, Fragment, lazy, Suspense} from 'react';
import {FlashMode, RNCamera} from 'react-native-camera';
import {
  Appearance,
  ColorSchemeName,
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  LogBox,
  StyleSheet,
} from 'react-native';
import {NotAuthorizedProps} from './NotAuthorized';
import MoveHandle from './MoveHandle';
import ActionTop from './ActionTop';
import ActionBottom from './ActionBottom';
import ImageCapture from './ImageCapture';
import {debounce} from '@/utils';

const NotAuthorized = lazy(() => import('./NotAuthorized'));
const FocusPoint = lazy(() => import('./FocusPoint'));

LogBox.ignoreLogs(['ViewPropTypes will be']);

export declare type CameraProps = {
  onClose?: () => any;
  onCaptureError?: (e: any) => any;
} & NotAuthorizedProps;

interface CameraState {
  cameraReady: boolean;
  type: 'front' | 'back';
  focusPoint: {x: number; y: number};
  exposure: number;
  zoom: number;
  theme: ColorSchemeName;
  screen: {width: number; height: number};
  flashMode: keyof FlashMode;
  image?: {
    deviceOrientation: number;
    pictureOrientation: number;
    height: number;
    width: number;
    uri: string;
  };
}

class Camera extends Component<CameraProps, CameraState> {
  camera?: RNCamera | null;
  isFocusPoint: boolean;
  listenAppear: any;
  constructor(props: CameraProps) {
    super(props);
    this.state = {
      cameraReady: false,
      type: 'back',
      focusPoint: {x: 0.5, y: 0.5},
      exposure: -1,
      zoom: 0,
      theme: Appearance.getColorScheme(),
      screen: Dimensions.get('window'),
      flashMode: 'auto',
    };
    this.isFocusPoint = false;
    this.listenAppear = Appearance.addChangeListener(this.onAppThemeChanged);
    this.takePicture = debounce(this.takePicture, 300);
  }

  componentWillUnmount() {
    this.listenAppear?.remove();
    this.setState = () => {};
  }

  onAppThemeChanged = ({colorScheme}: any) => {
    this.setState({theme: colorScheme});
  };

  onCameraReady = () => {
    const {cameraReady} = this.state;
    if (!cameraReady) {
      this.setState({cameraReady: true});
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
    const {type, cameraReady, screen} = this.state;
    if (!nativeEvent || type === 'front' || !cameraReady) {
      return;
    }
    const {pageX, pageY} = nativeEvent;
    this.setState({
      exposure: -1,
      focusPoint: {
        x: pageY / screen.height,
        y: 1 - pageX / screen.width,
      },
    });
    this.isFocusPoint = true;
  };

  handleResetFocusPoint = () => {
    this.isFocusPoint = false;
  };

  onLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {layout} = nativeEvent;
    const {screen} = this.state;
    if (screen.width !== layout.width || screen.height !== layout.height) {
      this.setState({screen: layout});
      console.log('layout');
    }
  };

  getLayout = () => {
    const {screen} = this.state;
    return screen;
  };

  onMove = ({y}: {y: number}) => {
    if (!this.isFocusPoint) {
      return;
    }
    const {exposure, type, cameraReady, screen} = this.state;
    if (!cameraReady) {
      return;
    }
    const {height} = screen;
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
    const {zoom, cameraReady} = this.state;
    if (!cameraReady) {
      return;
    }
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

  onChangeFlash = () => {
    const {flashMode} = this.state;
    let flash: any;
    if (flashMode === 'off') {
      flash = 'auto';
    } else if (flashMode === 'on') {
      flash = 'off';
    } else {
      flash = 'on';
    }
    this.setState({flashMode: flash});
  };

  takePicture = async () => {
    if (this.camera) {
      try {
        const data = await this.camera.takePictureAsync({
          quality: 0,
          imageType: 'jpeg',
        });
        this.setState({image: data});
      } catch (e) {
        const {onCaptureError} = this.props;
        onCaptureError?.(e);
      }
    }
  };

  onResetImage = () => {
    this.setState({image: undefined});
  };

  render() {
    const {focusPoint, cameraReady, zoom, flashMode} = this.state;
    const {
      cameraPermission,
      cameraPermissionDescription,
      openSettingAppText,
      stylePermission,
      onClose,
    } = this.props;
    const {type, exposure, theme, screen, image} = this.state;
    const autoPoint = type === 'front' || !cameraReady ? undefined : focusPoint;
    const backgroundColor = theme === 'light' ? '#fff' : '#000';
    if (image) {
      return (
        <Suspense fallback={null}>
          <ImageCapture
            onClose={this.onResetImage}
            image={image}
            screen={screen}
          />
        </Suspense>
      );
    }
    return (
      <Fragment>
        <MoveHandle
          onZoom={this.onZoom}
          onLayout={this.onLayout}
          style={[styles.camera, {backgroundColor}]}
          onPressDouble={this.changeType}
          onTouchEnd={this.onFocusPoint}
          onMove={this.onMove}>
          <RNCamera
            notAuthorizedView={
              <Suspense fallback={null}>
                <NotAuthorized
                  cameraPermission={cameraPermission}
                  cameraPermissionDescription={cameraPermissionDescription}
                  openSettingAppText={openSettingAppText}
                  stylePermission={stylePermission}
                />
              </Suspense>
            }
            pendingAuthorizationView={
              <Suspense fallback={null}>
                <NotAuthorized
                  cameraPermission={cameraPermission}
                  cameraPermissionDescription={cameraPermissionDescription}
                  openSettingAppText={openSettingAppText}
                  stylePermission={stylePermission}
                />
              </Suspense>
            }
            zoom={zoom}
            onMountError={e => {
              console.log(e);
            }}
            exposure={exposure}
            type={type}
            style={styles.camera}
            captureAudio={false}
            onCameraReady={this.onCameraReady}
            ref={ref => (this.camera = ref)}
            autoFocusPointOfInterest={autoPoint}
            flashMode={flashMode}>
            {cameraReady ? (
              <Suspense fallback={null}>
                <FocusPoint
                  handleResetFocusPoint={this.handleResetFocusPoint}
                  exposure={exposure}
                  type={type}
                  getLayout={this.getLayout}
                  focusPoint={focusPoint}
                />
              </Suspense>
            ) : null}
          </RNCamera>
        </MoveHandle>
        <ActionTop
          screen={screen}
          flashMode={flashMode}
          onClose={onClose}
          onChangeType={this.changeType}
          onChangeFlash={this.onChangeFlash}
        />
        <ActionBottom screen={screen} takePicture={this.takePicture} />
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
});

export default Camera;
