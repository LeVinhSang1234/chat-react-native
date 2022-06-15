export declare type ChatProviderProps = {};

export declare type CreateStaticProps = (
  func: CreateFunctionProps,
) => (Component: React.ComponentType<any>) => JSX.Element;

export declare type CreateFunctionProps = (data: ChatDataProviderProps) => {
  [key: string]: any;
};

export declare type ChatDataProviderProps = {};

export declare type ChatProps = {
  messages: any[];
} & KeyboardAdjustProps;

export declare type KeyboardAdjustProps = {
  distanceFromField?: number;
  children?: JSX.Element;
};