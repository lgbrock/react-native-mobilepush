import React from 'react';
import {View, StyleSheet} from 'react-native';
// import Main from './components/Main';
// import Registered from './components/Registered';
import SignUpForm from './components/SignUpForm';

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <SignUpForm />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 55,
    backgroundColor: '#42A5F5',
    margin: 10,
    padding: 8,
    color: 'white',
    borderRadius: 14,
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
