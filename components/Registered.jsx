import React, {useState} from 'react';
import {TextInput, View, StyleSheet, Button} from 'react-native';

import MCReactModule from './../sfmc.d.ts';

const Registered = () => {
  const [email, setEmail] = useState('');

  handleConfirmEmailButton = () => {
    console.log(`'${email}'`);
    MCReactModule.confirmContact(email, (success, error) => {
      if (success) {
        console.log(`Contact '${email}' confirmed successfully`);
      } else {
        console.log('Error', error);
      }
    });
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          placeholderTextColor="white"
          onChangeText={email => setEmail(email)}
        />
        <Button
          title="Confirm Email"
          onPress={() => console.log(`'${email}' confirmed`)}
          handleConfirmEmailButton={handleConfirmEmailButton}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 100,
  },
});

export default Registered;
