import React from 'react'
import { Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import _ from "lodash";
import { View, TouchableOpacity, ViewStyle, StyleSheet, TextStyle, SafeAreaView, Image } from 'react-native';
import OnBoardingItem from './OnBoardingItem';

interface IMapDispatchToProps {
   
}

export interface Props {
    
}

interface State {
    
}

class OnBoardingScreen extends React.Component<Props & IMapDispatchToProps, State> {

    constructor(props) {
        super(props);        
    }

    render() {       

        return (
            <View style={{ flex: 1}}>                
                <OnBoardingItem 
                    imageUri = {"image1"}
                    primaryMessage = "Welcome to TripBFF" 
                    secondaryMessage = "Visualize all your past trips in one place, instantly reachable and shareable" />  
            </View>                  
        )
    }
}

export default OnBoardingScreen;

interface Style {
    
  }
  
  const styles = StyleSheet.create<Style>({
    
  })