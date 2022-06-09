import {createContext, useContext} from 'react';

export const ChatProvider = createContext({});

export const useChatProvider = () => useContext(ChatProvider);
export const ChatProviderConsumer = ChatProvider.Consumer;
