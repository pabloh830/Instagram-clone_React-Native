/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, YellowBox } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RootStackNavigation from './src/navigations';
import { persistor, store } from './src/store';
YellowBox.ignoreWarnings([
  'Non-serializable values were found in the navigation state',
]);
const App = () => {
  const myUsername = store.getState().user.user?.userInfo?.username
  const ref = useRef<{ itv: NodeJS.Timeout }>({
    itv: setInterval(() => { }, 3000)
  })
  useEffect(() => {
    clearInterval(ref.current.itv)
    if (myUsername) {
      //limit functions quota
      // ref.current.itv = setInterval(() => {
      //   if (AppState.currentState === 'active') {
      //     database().ref(`/online/${convertToFirebaseDatabasePathName(myUsername)}`)
      //       .update({
      //         last_online: new Date().getTime(),
      //         status: 1
      //       })
      //   }
      // }, 15000)
    }
  }, [])
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootStackNavigation />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
});

export default App;
