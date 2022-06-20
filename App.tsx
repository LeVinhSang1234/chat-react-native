import React, {Component} from 'react';
import {ChatProvider} from './packages';
import Chat from '@/Chat';
import {data} from 'datas';

class App extends Component {
  render() {
    return (
      <ChatProvider>
        <Chat messages={data} />
      </ChatProvider>
    );
  }
}
export default App;
