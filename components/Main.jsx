import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';

import MCReactModule from 'react-native-marketingcloudsdk';

const SignUpForm = () => {
  const [contactKey, setContactKey] = useState();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [showContactKeyInput, setShowContactKeyInput] = useState('');

  // GET contact key from SFMC SDK and set it to state variable contactKey
  const getContactKey = async () => {
    const contactKey = await MCReactModule.getContactKey();
    console.log(contactKey);
    if (contactKey == undefined || contactKey.length == 0){
      setShowContactKeyInput(true);
    }else{
      await setContactKey(contactKey);
      applyContactKey();
    }
  };

  useEffect(() => {
    getContactKey();
}, []);

  const applyContactKey = async () => {
    console.log('Apply Contact Key');
    console.log(contactKey);
    await MCReactModule.setContactKey(contactKey);
    await MCReactModule.enablePush;
    setShowContactKeyInput(false);
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

  const getSFContactInfo = async () => {
      try {
        var body = {
          'email' : email
        }
        var formBody = [];
        for (var property in body) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(body[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        let response = await fetch('https://mchl2nbhxv6-wy1sw36p75pysf08.pub.sfmc-content.com/vh45v3ar14h', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: formBody,
        });
        let responseJson = await response.json();
        console.log(responseJson);
        if (!responseJson['success']){
          console.log(responseJson['id'] = null);
          console.log(responseJson['recordCount'] > 0);
          if (responseJson['id'] == null && responseJson['recordCount'] > 0){
            Alert.alert('SF Contact Retrieve', 'Multiple Contact Found\n(' + responseJson['recordCount'] + ') Rows Found' );
          }else{
            Alert.alert('SF Contact Retrieve', 'No Contacts Found For Email');
          }   
        }else{
          if (responseJson['id'] != undefined && responseJson['id'] != null &&  responseJson['id'].length > 0){
            Alert.alert('SF Contact Retrieve', 'Contact Found\n(' + responseJson['id'] + ') set as ContactKey');
            console.log(responseJson['id']);
            setContactKey(responseJson['id']);
            await MCReactModule.setContactKey(responseJson['id']);
            await MCReactModule.enablePush;
            setShowContactKeyInput(false);
          }else{
            Alert.alert('SF Contact Retrieve', 'No Id Returned For Email');
          }
        }
      } catch (error) {
        Alert.alert('SF Contact Retrieve', 'Error During API Call');
        console.error(error);
      }
  };

  const resetApp = async () => {
  };

  const EnterContactKey = () => (
      <View style={{ borderTopColor: '#bdbdbd', borderTopWidth: 2, borderBottomColor: '#bdbdbd', borderBottomWidth: 2, width: '90%', marginBottom: 20, paddingTop: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>Contact Key Retreival & Set</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact Key"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={contactKey => setContactKey(contactKey)}
          />
          <Button title="Set Device Contact Key" onPress={applyContactKey}/>
        </View>
  )

  const DisplayContactKey = () => (
    <View style={{ borderTopColor: '#bdbdbd', borderTopWidth: 2, borderBottomColor: '#bdbdbd', borderBottomWidth: 2, width: '90%', marginBottom: 20, paddingTop: 20, paddingBottom: 20}}>
      <Text style={styles.titleText}>Contact Key Set</Text>
      <Text>{contactKey}</Text>
    </View>
  )

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.titleText}>Mobile Push Demo App</Text>
        <View style={{marginBottom: 20 }}>
          <Button title="Reset Demo App" onPress={resetApp}/>
        </View>
        {showContactKeyInput ? <EnterContactKey /> : <DisplayContactKey /> }
        <View style={{ borderBottomColor: '#bdbdbd', borderBottomWidth: 2, width: '90%', marginBottom: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>Existing Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="SF Contact Email"
            autoCapitalize="none"
            placeholderTextColor="white"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={email => setEmail(email)}
          />
          <Button title="Get SF ID And Set Contact Key" onPress={getSFContactInfo}/>
        </View>
        {/* <View style={{width: '90%', marginBottom: 20, paddingBottom: 20}}>
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
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
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
        </View> */}
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
