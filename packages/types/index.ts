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
};

export declare type ChatDataProviderProps = {
  ComponentInput?: React.ComponentType<any>;
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
};

export declare type ChatProps = {
  messages: IMessage[];
  user: UserMessage;
  ComponentInput?: React.ComponentType<any>;
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
};

export declare type KeyboardProps = {
  animationLayout?: (duration?: number) => any;
};

export declare type InputChatProps = {
  style?: ViewStyle;
  styleViewInput?: ViewStyle;
  styleInput?: TextStyle;
} & TextInputProps;

export declare type InputProps = {
  style?: ViewStyle;
  styleInput?: TextStyle;
  animationLayout?: (duration?: number) => any;
} & TextInputProps;
