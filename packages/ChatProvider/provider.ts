import {ChatDataProviderProps, KeyboardDataProvider} from '@/types';
import {createContext, useContext} from 'react';
import {Dimensions} from 'react-native';

export const ChatProvider = createContext({
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
  rotate: 1,
});
export const useChatProvider = () => useContext(ChatProvider);
export const ChatProviderConsumer = ChatProvider.Consumer;

const defaultContext: ChatDataProviderProps = {
  messages: [],
};

export const ChatDataProvider = createContext(defaultContext);
export const useChatDataProvider = () => useContext(ChatDataProvider);
export const ChatDataProviderConsumer = ChatDataProvider.Consumer;

const dataDefaultKeyboard: KeyboardDataProvider = {
  distanceFromField: 0,
};

export const KeyboardProvider = createContext(dataDefaultKeyboard);
