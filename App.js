import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Main from './components/Main';

export default class App extends React.Component {
  render() {
    return (
      <ScrollView contentContainerStyle={{paddingTop: 65}}>
      <View style={styles.container}>
        <Main />
      </View>
      </ScrollView>
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
