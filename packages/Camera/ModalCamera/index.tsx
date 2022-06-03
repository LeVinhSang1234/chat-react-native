import React, {Component, lazy, Suspense} from 'react';
import {Modal, StatusBar} from 'react-native';

const Camera = lazy(() => import('..'));

export declare type ModalCameraProps = {};

interface ModalCameraState {
  visible: boolean;
}

class ModalCamera extends Component<ModalCameraProps, ModalCameraState> {
  constructor(props: ModalCameraProps) {
    super(props);
    this.state = {visible: false};
  }

  open = () => {
    this.setState({visible: true});
    StatusBar.setHidden(true);
  };

  close = () => {
    this.setState({visible: false});
    StatusBar.setHidden(false);
  };

  render() {
    const {visible} = this.state;
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <Suspense fallback={null}>
          <Camera />
        </Suspense>
      </Modal>
    );
  }
}

export default ModalCamera;
