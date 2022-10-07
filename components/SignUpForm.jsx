import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  FlatList,
  StyleSheet,
  Button,
} from 'react-native';

import MCReactModule from './../sfmc.d.ts';

const SignUpForm = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  handleSignUpButton = () => {
    console.log(`'${firstname}' '${lastname}' '${email}' '${company}'`);
    MCReactModule.registerContact(
      firstname,
      lastname,
      email,
      company,
      (success, error) => {
        if (success) {
          console.log(
            `Contact '${firstname}' '${lastname}' '${email}' '${company}' registered successfully`,
          );
        } else {
          console.log('Error', error);
        }
      },
    );
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={firstname => setFirstName(firstname)}
        />
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={lastname => setLastName(lastname)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={email => setEmail(email)}
        />
        <TextInput
          style={styles.input}
          placeholder="Company"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={company => setCompany(company)}
        />
        <Button
          title="Confirm Email"
          onPress={() =>
            console.log(`'${firstname}' '${lastname}' '${email}' '${company}'`)
          }
          handleSignUpButton={handleSignUpButton}
        />
      </View>
    </>
  );
};

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

export default SignUpForm;
