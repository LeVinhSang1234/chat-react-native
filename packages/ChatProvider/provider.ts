import {ChatDataProviderProps} from '@/types';
import {createContext, useContext} from 'react';

export const ChatProvider = createContext({});
export const useChatProvider = () => useContext(ChatProvider);
export const ChatProviderConsumer = ChatProvider.Consumer;

const defaultContext: ChatDataProviderProps = {};

export const ChatDataProvider = createContext(defaultContext);
export const useChatDataProvider = () => useContext(ChatDataProvider);
export const ChatDataProviderConsumer = ChatDataProvider.Consumer;
