import React from 'react'
import { Text, Icon } from 'native-base';
import _ from "lodash";
import { View, TouchableOpacity, ViewStyle, StyleSheet, TextStyle, SafeAreaView, Image, Alert } from 'react-native';
import OnBoardingItem from './OnBoardingItem';
import Swiper from 'react-native-swiper'
import { PropsBase } from '../_shared/LayoutContainer';
import { NavigationConstants } from '../_shared/ScreenConstants';
import { NavigationScreenProp } from 'react-navigation';
import { mixins } from "../../_utils";
import NBColor from "../../theme/variables/material.js";

interface Props extends PropsBase {    
    navigation: NavigationScreenProp<any, any>;
}

interface State {    
}

class OnBoardingScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props);        
    }

    private _skip = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.Profile);
    }

    render() {       

        return (
            <View style={{ flex: 1, flexDirection: "column"}}>    
                <TouchableOpacity onPress={this._skip} style={styles.skipButton}>
                        <Text style={styles.skipLabel}>Skip</Text>
                </TouchableOpacity>
                <Swiper showsButtons={false} loop={false} >
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
    skipButton: ViewStyle,
    skipLabel: TextStyle,
}
  
const styles = StyleSheet.create<Style>({    
    skipButton: {
        marginLeft: "80%",
        marginRight: "10%",
        marginTop: "7%"
    },
    skipLabel: {
        color: NBColor.brandPrimary,
        fontSize: 14,
        ...mixins.themes.fontNormal,
        lineHeight: 24
    }    
})