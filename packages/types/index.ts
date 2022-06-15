import {TextInputProps, TextStyle, ViewStyle} from 'react-native';

export declare type ChatProviderProps = {};

export declare type CreateStaticProps = (
  func: CreateFunctionProps,
) => (Component: React.ComponentType<any>) => JSX.Element;

export declare type CreateFunctionProps = (data: ChatDataProviderProps) => {
  [key: string]: any;
};

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
} & KeyboardAdjustProps;

export declare type KeyboardAdjustProps = {
  distanceFromField?: number;
  children?: JSX.Element;
  ComponentInput: React.ComponentType<any>;
};

export declare type InputProps = {
  style?: ViewStyle;
  styleInput?: TextStyle;
} & TextInputProps;

export declare type InputChatProps = {};
