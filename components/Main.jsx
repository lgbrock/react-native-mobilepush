import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
} from 'react-native';

import MCReactModule from 'react-native-marketingcloudsdk';

const SignUpForm = () => {
  const [contactKey, setContactKey] = useState();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [disableGet, setDisableGet] = useState('');
  const [disableSet, setDisableSet] = useState('');

  // GET contact key from SFMC SDK and set it to state variable contactKey
  const getContactKey = async () => {
    const contactKey = await MCReactModule.getContactKey();
    if (contactKey == undefined || contactKey.length == 0){
      setDisableGet(true);
      setDisableSet(false);
    }else{
      setDisableGet(false);
      setDisableSet(true);
    }
    setContactKey(contactKey);
  };

  useEffect(() => {
    getContactKey();
}, []);

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

  const getSFContactInfo = async () => {
      try {
        let response = await fetch('https://mchl2nbhxv6-wy1sw36p75pysf08.pub.sfmc-content.com/vh45v3ar14h', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "email": email,
          }),
        });
        let responseJson = await response.json();
        console.log(responseJson);
      } catch (error) {
        console.error(error);
      }
  };

  const resetApp = async () => {
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleText}>Mobile Push Demo App</Text>
        <View style={{marginBottom: 20 }}>
          <Button title="Reset Demo App" onPress={resetApp}/>
        </View>
        <View style={{ borderTopColor: '#bdbdbd', borderTopWidth: 2, borderBottomColor: '#bdbdbd', borderBottomWidth: 2, width: '90%', marginBottom: 20, paddingTop: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>Contact Key Retreival & Set</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact Key"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={contactKey => setContactKey(contactKey)}
            value={contactKey}
            editable={disableGet}
          />
          <Button title="Set Device Contact Key" onPress={setContactKey} disabled={disableSet}/>
        </View>
        <View style={{ borderBottomColor: '#bdbdbd', borderBottomWidth: 2, width: '90%', marginBottom: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>Existing Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="SF Contact Email"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={email => setEmail(email)}
          />
          <Button title="Get SF ID And Set Contact Key" onPress={getSFContactInfo} disabled={disableSet}/>
        </View>
        <View style={{width: '90%', marginBottom: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>New Contact</Text>
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
          <Button title="Create Contact And Get Key" onPress={getSFContactInfo} />
        </View>
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
    border: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default SignUpForm;
