import {
  NativeSyntheticEvent,
  NativeTouchEvent,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

export declare type ChatProviderProps = {};

export declare type ChatDataProviderProps = {
  messages: MessagesProps[];
};

export declare type SenderProps = {
  _id: string;
  name: string;
  avatar: string;
};

export declare type FileProps = {
  _id: string;
  url: string;
  file_name: string;
  type: string;
};

export declare type MessagesProps = {
  _id: string;
  text?: string;
  sender: SenderProps;
  files: FileProps[];
};

export declare type ChatProps = {
  messages: MessagesProps[];
  ComponentInput?: React.ComponentType<any>;
  distanceFromField?: number;
  children?: JSX.Element;
  extension?: JSX.Element;
};

export declare type KeyboardAdjustProps = {
  distanceFromField?: number;
  children?: JSX.Element;
  ComponentInput: React.ComponentType<any>;
};

export declare type InputProps = {
  style?: ViewStyle;
  styleInput?: TextStyle;
} & TextInputProps;

export declare type KeyboardDataProvider = {
  distanceFromField: number;
  extension?: JSX.Element;
  dismiss: () => any;
};

export declare type InputChatProviderTypes = {
  onPressOut: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  contextMenuHidden: boolean;
};
