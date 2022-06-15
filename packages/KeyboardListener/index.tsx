import {Component} from 'react';
import {Keyboard, Platform, KeyboardEvent} from 'react-native';

interface IKeyboardListenerProps {
  onWillShow?: (e: KeyboardEvent) => any;
  onWillHide?: (e: KeyboardEvent) => any;
  onDidShow?: (e: KeyboardEvent) => any;
  onDidHide?: (e: KeyboardEvent) => any;
  onWillChangeFrame?: (e: KeyboardEvent) => any;
  onDidChangeFrame?: (e: KeyboardEvent) => any;
}

class KeyboardListener extends Component<IKeyboardListenerProps> {
  willShow: any;
  willHide: any;
  didShow: any;
  didHide: any;
  willFrame: any;
  didFrame: any;
  constructor(props: IKeyboardListenerProps) {
    super(props);
    const {
      onWillShow,
      onWillHide,
      onDidShow,
      onDidHide,
      onWillChangeFrame,
      onDidChangeFrame,
    } = props;
    const isAndroid = Platform.OS === 'android';
    if (onWillShow) {
      this.willShow = Keyboard.addListener(
        isAndroid && !onDidShow ? 'keyboardDidShow' : 'keyboardWillShow',
        e => {
          onWillShow?.(e);
        },
      );
    }

    if (onWillHide) {
      this.willHide = Keyboard.addListener(
        isAndroid && !onDidHide ? 'keyboardDidHide' : 'keyboardWillHide',
        e => {
          onWillHide?.(e);
        },
      );
    }
    if (onDidShow) {
      this.didShow = Keyboard.addListener('keyboardDidShow', e => {
        onDidShow?.(e);
      });
    }
    if (onDidHide) {
      this.didHide = Keyboard.addListener('keyboardDidHide', e => {
        onDidHide?.(e);
      });
    }
    if (onWillChangeFrame) {
      this.willFrame = Keyboard.addListener(
        isAndroid && !onDidChangeFrame
          ? 'keyboardDidChangeFrame'
          : 'keyboardWillChangeFrame',
        e => {
          onWillChangeFrame?.(e);
        },
      );
    }
    if (onDidChangeFrame) {
      this.didFrame = Keyboard.addListener('keyboardDidChangeFrame', e => {
        onDidChangeFrame?.(e);
      });
    }
  }

  componentWillUnmount() {
    this.willShow?.remove?.();
    this.willHide?.remove?.();
    this.didShow?.remove?.();
    this.didHide?.remove?.();
    this.willFrame?.remove?.();
    this.didFrame?.remove?.();
  }

  render() {
    return null;
  }
}

export default KeyboardListener;
