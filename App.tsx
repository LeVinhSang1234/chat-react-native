import React, {Component} from 'react';
import {ChatProvider} from './packages';
import Chat from '@/Chat';
import {data} from 'datas';

class App extends Component {
  render() {
    return (
      <ChatProvider>
        <Chat
          user={{
            _id: '7',
            avatar:
              'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
            name: 'Sang LV',
          }}
          messages={data}
          navbarBottomHeight={23}
        />
      </ChatProvider>
    );
  }
}
export default App;
