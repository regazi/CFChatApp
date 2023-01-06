import React, {Component} from 'react';

//internal components
import Start from './components/Start';
import Chat from './components/Chat';
//dependency componenets
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator ();

export default class App extends React.Component{

  constructor(){
    super();
    

  }

render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Start"

        >
          <Tab.Screen
            name="Start"
            component={Start}
            
          />
          <Tab.Screen
            name="Chat"
            component={Chat}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
  
}
