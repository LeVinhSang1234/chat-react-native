import React, {Component} from 'react';
import {ChatProvider} from './packages';
import Chat from '@/Chat';
import {data} from 'datas';
import Text from '@/Text';

class App extends Component {
  render() {
    return (
      <ChatProvider>
        <Chat messages={data} extension={<Text>Sang ggggggggggggg</Text>} />
      </ChatProvider>
    );
  }
}
export default App;
