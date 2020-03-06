import React from 'react'
import { Text, Icon } from 'native-base';
import { connect } from 'react-redux';
import _ from "lodash";
import { View, TouchableOpacity, ViewStyle, StyleSheet, TextStyle, SafeAreaView, Image } from 'react-native';
import OnBoardingItem from './OnBoardingItem';
import Swiper from 'react-native-swiper'

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
                <Swiper showsButtons={false} loop={false}>
                    <OnBoardingItem 
                        imageUri = {"image1"}
                        primaryMessage = "Welcome to TripBFF" 
                        secondaryMessage = "Visualize all your past trips in one place, instantly reachable and shareable" />
                    <OnBoardingItem 
                        imageUri = {"image2"}
                        primaryMessage = "Auto generate timeline" 
                        secondaryMessage = "Timeline of trip will be generated automatically based on your photos" /> 
                    <OnBoardingItem 
                        imageUri = {"image3"}
                        primaryMessage = "Easy to describe location" 
                        secondaryMessage = "We provide more and more common feelings, activities, likes and dislikes" /> 
                    <OnBoardingItem 
                        imageUri = {"image4"}
                        primaryMessage = "Export meaningful infographic" 
                        secondaryMessage = "Visualize your trip as infographic and share it to community" />                    
                </Swiper>  
            </View>                  
        )
    }
}

export default OnBoardingScreen;

interface Style {
    
  }
  
  const styles = StyleSheet.create<Style>({
    
  })