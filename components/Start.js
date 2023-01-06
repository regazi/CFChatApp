import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, ImageBackground, TouchableOpacity, ScrollView, KeyboardAvoidingView} from 'react-native';
import img from "../assets/img.png"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Start extends React.Component {

  constructor(props){
    super(props);
    this.state={
      name: "",
      color: ""
    }
  }
  
//add username to client storage
  //1
  saveUsername(username){
    this.storeUsername(username)
    this.advanceScreen(username) 
  }
  //2
  async storeUsername(username){
    try {
      await AsyncStorage.setItem('username', JSON.stringify(username));
    } catch (error) {
      console.log(error.message);
    }  
    try {
      await AsyncStorage.setItem('color', JSON.stringify(this.state.color));
    } catch (error) {
      console.log(error.message);
    } 
  }
  //fetch username from client storage
  async getUserName(){
    try {
      username = await AsyncStorage.getItem('username') || "";
      this.setState({
        name: JSON.parse(username)
      });
    } catch (error) {
      console.log(error.message);
    }
    try {
      color = await AsyncStorage.getItem('color') || "";
      this.setState({
        color: JSON.parse(color)
      });
    } catch (error) {
      console.log(error.message);
    }
    this.isNameSaved(username)
  }
  isNameSaved(username){
    if(username.length> 0){
      this.advanceScreen(username);
    }else{
      console.log(username)
      return;
    }
  }
  //3
  advanceScreen(username){
  this.props.navigation.navigate("Chat", {name: username, color: this.state.color})
  this.props.navigation.setOptions({headerTintColor: this.state.color });
  }
   
  async componentDidMount(){ 
    this.getUserName()
  }
  render() {
    return (
      <KeyboardAvoidingView behavior="height" style={styles.container}>
      <View style={styles.container}>
        <ImageBackground source={img} resizeMode="cover" style={styles.img}>
          <Text style={styles.title}>Messenger</Text>
          <View style={styles.componentContainer}>

            <TextInput style={styles.input} onChangeText={(username) => this.setState({name: username})} value={this.state.name} placeholder="Enter Name..."/>
            <Text style={{paddingTop: 10}}>Choose Theme</Text>

             {/* Color Icons carousel for selecting theme color */}
                <ScrollView horizontal={true} style={styles.colorContainer}>
                <TouchableOpacity
                  style={[
                    styles.color, {backgroundColor:'#34ebd2'}
                  ]}
                  onPress={() =>
                    this.setState({ color: '#34ebd2' })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color, {backgroundColor:'#12b1c9'}
                  ]}
                  onPress={() =>
                    this.setState({ color: '#12b1c9' })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color, {backgroundColor:'grey'}
                  ]}
                  onPress={() =>
                    this.setState({ color: 'grey' })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color, {backgroundColor:'#a8bdad'}
                  ]}
                  onPress={() =>
                    this.setState({ color: '#a8bdad' })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color, {backgroundColor:'#c3cdd6'}
                  ]}
                  onPress={() =>
                    this.setState({ color: '#c3cdd6' })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color, {backgroundColor:'#445f78'}
                  ]}
                  onPress={() =>
                    this.setState({ color: '#445f78' })
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color, {backgroundColor:'#c47c94'}
                  ]}
                  onPress={() =>
                    this.setState({ color: '#c47c94' })
                    
                  }
                />
           </ScrollView>
    
              <Button
              title="Go to Chat"
              onPress={() => this.saveUsername(this.state.name)}
              />
          </View>
        </ImageBackground>
      
      </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  input: {
    padding: 4,
    width: 250,
    backgroundColor: "#eaeaea",
    height: 40,
  },
  title: {
    fontSize: 50,
    paddingTop: 20
  },
  img: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'cover',

  },
  componentContainer: {
    backgroundColor: 'white',
    height: '44%',
    width: '88%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '6%',
  },
  colorContainer: {
    padding: 4
  },
  color: {
    borderRadius: 20,
    width: 40,
    height: 40,
    marginTop: 10,
    marginRight: 10,
  },
})