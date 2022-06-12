import React, {Component} from 'react';
import {ChatProvider} from './packages';
import Chat from '@/Chat';
import {data} from 'datas';
import Extendsion from 'Extendsion';

class App extends Component {
  onSend = (message?: string) => {
    console.log('message ==>', message);
  };

  render() {
    return (
      <ChatProvider>
        <Chat
          onSend={this.onSend}
          user={{
            _id: '7',
            avatar:
              'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg',
            name: 'Sang LV',
          }}
          messages={data}
          navbarBottomHeight={23}
          Extendsion={Extendsion}
        />
      </ChatProvider>
    );
  }
}
export default App;
