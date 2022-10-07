import React, {useState} from 'react';
import {Text, View, FlatList, StyleSheet, Button} from 'react-native';

// import ReactDOM from 'react-dom';
// import {BrowserRouter, Route, Switch} from 'react-router-dom';

// import Registered from './Registered';
// import SignUpForm from './SignUpForm';

// How to navigate between pages - https://reactnative.dev/docs/navigation

const Main = props => {
  const [item, setItem] = useState([
    {id: 1, name: 'item 1'},
    {id: 2, name: 'item 2'},
    {id: 3, name: 'item 3'},
  ]);

  //   handleRegisterButton = () => {
  //     props.history.push('/signup');
  //   };

  return (
    <>
      <View style={styles.container}>
        <Button
          title="Registered"
          onPress={() => props.navigation.navigate('SignUpForm')}
        />
        <Button
          title="Sign Up"
          onPress={() => setItem([...item, {id: 4, name: 'item 4'}])}
        />
      </View>
    </>
  );
};

Main.defaultProps = {
  title: 'Hello World',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 100,
  },
});

export default Main;
