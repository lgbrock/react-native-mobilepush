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
  const [contactKey, setContactKey] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');

  // GET contact key from SFMC SDK and set it to state variable contactKey
  const getContactKey = async () => {
    const contactKey = await MCReactModule.getContactKey();
    setContactKey(contactKey);
  };

  // POST data to SFMC SDK
  const postContactData = async () => {
    const data = {
      ContactKey: contactKey,
      Attributes: {
        FirstName: firstname,
        LastName: lastname,
        Email: email,
        Company: company,
      },
    };
    await MCReactModule.postContactData(data);
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

        <Button title="Get Contact Key" onPress={getContactKey} />
        <Button title="Post Contact Data" onPress={postContactData} />

        <Text style={styles.text}>Contact Key: {contactKey}</Text>
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
