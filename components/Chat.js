import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');
import CustomActions from './customActions';
import MapView from 'react-native-maps';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from '@react-native-community/netinfo';

//import PropTypes from 'prop-types';





export default class Chat extends React.Component {
  

  constructor() {
    super();
    this.state = {
      uid: 0,
      messages: [],
      user: {
        _id: '',
        avatar: '',
        name: '',
        image: null,
      },
      isConnected: false
    };

  }
//Client Side Storage---
 async getMessages(){
  let messages = '';
  try {
    messages = await AsyncStorage.getItem('messages') || [];
    this.setState({
      messages: JSON.parse(messages)
    });
  } catch (error) {
    console.log(error.message);
  }
 }
 async saveMessages() {
  try {
    await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
  } catch (error) {
    console.log(error.message);
  }
}
async deleteMessages() {
  try {
    await AsyncStorage.removeItem('messages');
    this.setState({
      messages: []
    })
  } catch (error) {
    console.log(error.message);
  }
}

//-------------------
  componentDidMount() {
      //Check if device is on-line
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }
    });



    let name = this.props.route.params.name; // Users names passed from start screen
    let color = this.props.route.params.color;// users selected theme color
    //Configure firebase
    if (!firebase.apps.length) {
      
      const firebaseConfig = {
        apiKey: "AIzaSyCQ_4bXFYqp67UUC7uDtuqQsIpKSqlZ-ro",
        authDomain: "chatapp-9f928.firebaseapp.com",
        projectId: "chatapp-9f928",
        storageBucket: "chatapp-9f928.appspot.com",
        messagingSenderId: "817521532134",
        appId: "1:817521532134:web:541826224f44b3d7d1ef27"
      };
      firebase.initializeApp(firebaseConfig);
    }

    //Get Messages From Client-Side Storage
    this.getMessages()


    this.props.navigation.setOptions({ title: name }); //sets screen title to users name
    this.props.navigation.setOptions({ headerTintColor: color }); //sets screen title to users name
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onCollectionUpdate)
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      //sign in and assign uid to user object
      this.setState({
        uid: user.uid,
        messages: [],
        color,
        user: { name: name,
        _id: user.uid }
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }
  componentWillUnmount() {
    if (this.isConnected) {
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }

  addMessage = (messages) => {
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: messages[0]._id,
      text: messages[0].text || "",
      createdAt: messages[0].createdAt,
      user: this.state.user,
      image: messages[0].image || null,
      location: messages[0].location || null,
    });
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        createdAt: data.createdAt.toDate(),
        _id: data._id,
        text: data.text,
        user: data.user,
        image: data.image,
        location: data.location
      });
    });
    this.setState({
      messages,
    });
  };

  onSend(messages = []) {
    this.addMessage(messages);
    this.saveMessages();

  }

// COMPONENTS__COMPONENTS__COMPONENTS__COMPONENTS__COMPONENTS__
//function to edit the styling on chat bubbles
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor:"green"
          },
          right: {
            backgroundColor: this.state.color
          }
        }}
      />
    )
  }
//mutimedia selection
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //giftedchat toolbar
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
      <Text>Device is Offline</Text>
    } else {
        return <InputToolbar {...props} />;
    }
}

//map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
        return (
            <MapView
                style={{
                    width: 150,
                    height: 100,
                    borderRadius: 13,
                    margin: 3
                }}
                region={{
                    latitude: currentMessage.location.latitude,
                    longitude: currentMessage.location.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            />
        );
    }
    return null;
}
  render() {
    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={this.state.user}
          renderBubble={this.renderBubble.bind(this)}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
        />
        {this.state.image &&
  <Image source={{ uri: this.state.image.uri }} style={{ width: 200, height: 200 }} />}
        {/* Layout fix for android to ensure no conflict between keyboard and input*/}
        {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null
        }
     
      </View>
    )
  }
}
//styles
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});