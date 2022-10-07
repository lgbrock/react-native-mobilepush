// SignUp.js
import React, {useState} from 'react';
import {View, Button, TextInput, StyleSheet} from 'react-native';
// import Main from './components/Main';
import Registered from './components/Registered';
import MCReactModule from './sfmc.d.ts';

export default class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: 'Logan',
      last_name: 'Brock',
      email: 'lbrock@eigenx.com',
      company: 'Eigen X',
    };
  }

  register() {
    const {first_name, last_name, email, company} = this.state;
    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      company: company,
    };
    // set data from state
    MCReactModule.setContactKeyValues(data);
    // register contact
    MCReactModule.registerContact();
    console.log(data);
  }

  onChangeText = (key, val) => {
    this.setState({[key]: val});
  };

  render() {
    return (
      <View style={styles.container}>
        <Registered />
        {/* <TextInput
          style={styles.input}
          placeholder="First Name"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={val => this.onChangeText('first_name', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={val => this.onChangeText('last_name', val)}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={val => this.onChangeText('email', val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Company"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={val => this.onChangeText('company', val)}
        />
        <Button title="Sign Up" onPress={this.handleRegisterButton()} />

        <Button
          style={styles.input}
          title="Register"
          onPress={() => this.register()}
        /> */}
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
