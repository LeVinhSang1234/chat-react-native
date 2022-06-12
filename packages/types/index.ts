import {TextInputProps, TextStyle, ViewStyle} from 'react-native';

export declare type ChatProviderProps = {};

export declare type UserMessage = {
  _id: string;
  avatar?: string;
  name: string;
  [key: string]: any;
};

export declare type FileMessage = {
  url: string;
  headers?: {[key: string]: any};
  type: string;
};

export declare type IMessage = {
  message?: string;
  files?: FileMessage[];
  sender: UserMessage;
  _id: string;
  createdAt: Date;
  seenAt?: Date;
  readAt?: Date;
};

export declare type ChatDataProviderProps = {
  ComponentBottomBar?: React.ComponentType<any>;
  navbarBottomHeight?: number;
  animationLayout?: (
    duration?: number,
    creationProp?: 'scaleY' | 'opacity' | 'scaleX',
  ) => any;
  SendButton?: ({
    color,
    disabled,
  }: {
    color: string;
    disabled: boolean;
  }) => JSX.Element;
  SendButtonDefault?: JSX.Element;
  allowSendButtonDefault?: boolean;
  defaultMessage?: string;
  Extendsion?: React.ComponentType<any>;
  onSend: (message?: string) => any;
  user: UserMessage;
  mainColor: string;
  styleBottomBar?: ViewStyle;
};

export declare type ChatProps = {
  messages: IMessage[];
  user: UserMessage;
  ComponentBottomBar?: React.ComponentType<any>;
  navbarBottomHeight?: number;
  SendButton?: ({
    color,
    disabled,
  }: {
    color: string;
    disabled: boolean;
  }) => JSX.Element;
  SendButtonDefault?: JSX.Element;
  allowSendButtonDefault?: boolean;
  defaultMessage?: string;
  Extendsion?: React.ComponentType<any>;
  onSend: (message?: string) => any;
  mainColor?: string;
  imageBackground?: string;
  styleBottomBar?: ViewStyle;
};

export declare type KeyboardProps = {
  animationLayout?: (duration?: number) => any;
};

export declare type InputChatProps = {
  style?: ViewStyle;
  styleViewInput?: ViewStyle;
  styleInput?: TextStyle;
  isKeyboardShow?: boolean;
} & TextInputProps;

export declare type InputProps = {
  style?: ViewStyle;
  styleInput?: TextStyle;
  animationLayout?: (duration?: number) => any;
} & TextInputProps;
