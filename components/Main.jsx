import React, {useState, useEffect} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Button,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';

import MCReactModule from 'react-native-marketingcloudsdk';

const SignUpForm = () => {
  const [contactKey, setContactKey] = useState();
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [enableContactKeySet, setEnableContactKeySet] = useState(false);

  // GET contact key from SFMC SDK and set it to state variable contactKey
  const getContactKey = async () => {
    const retreivedKey = await MCReactModule.getContactKey();
    console.log(retreivedKey);
    if (retreivedKey == undefined || retreivedKey.length == 0){
      setEnableContactKeySet(false);
    }else{
      await setContactKey(retreivedKey);
      await MCReactModule.setContactKey(retreivedKey);
      await MCReactModule.enablePush;
      setEnableContactKeySet(true);
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
    setEnableContactKeySet(true);
  };

  // POST data to SFMC SDK
  const setContactInfo = async () => {
    try {
      var body = {
        'firstName' : firstname,
        'lastName' : lastname,
        'email' : email,
        'company' : company
      }
      var formBody = [];
      for (var property in body) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(body[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      let response = await fetch('https://mchl2nbhxv6-wy1sw36p75pysf08.pub.sfmc-content.com/0rqi3ckl3xm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      });
      let responseJson = await response.json();
      if(response.status == 200){
        var retreivedKey = responseJson['createResponse'];
        Alert.alert('SF Lead Created', '(' + retreivedKey + ') set as ContactKey');
        await setContactKey(retreivedKey);
        await MCReactModule.setContactKey(retreivedKey);
        await MCReactModule.enablePush;
        setEnableContactKeySet(true);
      }else{
        Alert.alert('SF Create', 'Error During API Call');
      console.error(response);
      setEnableContactKeySet(false);
      }
      console.log(responseJson);
    } catch (error) {
      Alert.alert('SF Lead Create', 'Error During API Call');
      console.error(error);
      setEnableContactKeySet(false);
    }
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
            setEnableContactKeySet(false);
          }else{
            Alert.alert('SF Contact Retrieve', 'No Contacts Found For Email');
            setEnableContactKeySet(false);
          }   
        }else{
          if (responseJson['id'] != undefined && responseJson['id'] != null &&  responseJson['id'].length > 0){
            Alert.alert('SF Contact Retrieve', 'Contact Found\n(' + responseJson['id'] + ') set as ContactKey');
            console.log(responseJson['id']);
            setContactKey(responseJson['id']);
            await MCReactModule.setContactKey(responseJson['id']);
            await MCReactModule.enablePush;
            setEnableContactKeySet(true);
          }else{
            Alert.alert('SF Contact Retrieve', 'No Id Returned For Email');
            setEnableContactKeySet(false);
          }
        }
      } catch (error) {
        Alert.alert('SF Contact Retrieve', 'Error During API Call');
        console.error(error);
        setEnableContactKeySet(false);
      }
  };

  const resetApp = async () => {
  };

  return (
    <>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={{marginBottom: 20 }}>
        <Text style={styles.titleText}>Mobile Push Demo App</Text>
        </View>
        <View style={{ borderTopColor: '#bdbdbd', borderTopWidth: 2, borderBottomColor: '#bdbdbd', borderBottomWidth: 2, width: '90%', marginBottom: 20, paddingTop: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>Contact Key Set</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact Key"
            autoCapitalize="none"
            placeholderTextColor="white"
            onChangeText={contactKey => setContactKey(contactKey)}
            value={contactKey}
          />
          <Button title="Set Contact Key" onPress={applyContactKey} disabled={enableContactKeySet}/>
        </View>
        <View style={{ borderBottomColor: '#bdbdbd', borderBottomWidth: 2, width: '90%', marginBottom: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>Existing Contact Search & Set</Text>
          <TextInput
            style={styles.input}
            placeholder="Contact Email"
            autoCapitalize="none"
            placeholderTextColor="white"
            keyboardType="email-address"
            textContentType="emailAddress"
            value={email}
            onChangeText={email => setEmail(email)}
          />
          <Button title="Get SF Id & Set Contact Key" onPress={getSFContactInfo} disabled={enableContactKeySet}/>
        </View>
        <View style={{width: '90%', marginBottom: 20, paddingBottom: 20}}>
          <Text style={styles.titleText}>New Lead</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            autoCapitalize="none"
            placeholderTextColor="white"
            value={firstname}
            onChangeText={firstname => setFirstName(firstname)}
          />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            autoCapitalize="none"
            placeholderTextColor="white"
            value={lastname}
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
            value={company}
            onChangeText={company => setCompany(company)}
          />
          <Button title="Create Lead & Set Contact Key" onPress={setContactInfo} disabled={enableContactKeySet}/>
        </View>
      </KeyboardAvoidingView>
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
