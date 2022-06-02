import {CameraProps} from '@/Camera';
import ModalCamera from '@/Camera/ModalCamera';
import React, {Component} from 'react';
import {ChatProvider as ChatProviderContext} from './provider';

export declare type ChatProviderProps = {
  camera?: CameraProps;
};

class ChatProvider extends Component {
  modalCamera?: ModalCamera | null;

  openCamera = (): void => {
    this.modalCamera?.open();
  };

  render() {
    const {children} = this.props;
    return (
      <ChatProviderContext.Provider value={{openCamera: this.openCamera}}>
        {children}
        <ModalCamera ref={ref => (this.modalCamera = ref)} />
      </ChatProviderContext.Provider>
    );
  }
}

export default ChatProvider;
