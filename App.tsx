import React, {Component} from 'react';
import {ChatProvider, ChatProviderConsumer} from './packages';
import {Pressable, SafeAreaView} from 'react-native';
import Text from '@/Text';

class App extends Component {
  render() {
    return (
      <ChatProvider>
        <SafeAreaView style={{flex: 1}}>
          <ChatProviderConsumer>
            {({openCamera}) => (
              <Pressable onPress={openCamera}>
                <Text>Open</Text>
              </Pressable>
            )}
          </ChatProviderConsumer>
        </SafeAreaView>
      </ChatProvider>
    );
  }
}
export default App;
