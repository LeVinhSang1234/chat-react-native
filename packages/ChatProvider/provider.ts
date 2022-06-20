import {ChatDataProviderProps, KeyboardDataProvider} from '@/types';
import {createContext, useContext} from 'react';
import {Dimensions} from 'react-native';

export const ChatProvider = createContext({
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
});
export const useChatProvider = () => useContext(ChatProvider);
export const ChatProviderConsumer = ChatProvider.Consumer;

const defaultContext: ChatDataProviderProps = {
  messages: [],
};

export const ChatDataProvider = createContext(defaultContext);
export const useChatDataProvider = () => useContext(ChatDataProvider);

const dataDefaultKeyboard: KeyboardDataProvider = {
  distanceFromField: 0,
  dismiss: () => null,
};

export const KeyboardProvider = createContext(dataDefaultKeyboard);
