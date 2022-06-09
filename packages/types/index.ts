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

export declare type ChatProps = {
  messages: IMessage[];
  user: UserMessage;
};

export declare type KeyboardProps = {};
