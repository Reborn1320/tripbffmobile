import React from 'react'
import { Text } from 'native-base';
import _ from "lodash";
import { View, ViewStyle, StyleSheet, TextStyle, Image } from 'react-native';
import onBoardingImages from './OnBoardingImages';
import { mixins } from "../../_utils";
import NBColor from "../../theme/variables/material.js";

interface IMapDispatchToProps {
   
}

export interface Props {
    imageUri: string,
    primaryMessage: string,
    secondaryMessage: string
}

interface State {
    
}

class OnBoardingItem extends React.Component<Props & IMapDispatchToProps, State> {

    constructor(props) {
        super(props);        
    }    

    render() {       
        const { primaryMessage, secondaryMessage, imageUri }  = this.props;

        return (
            <View style={styles.itemContainer}>    
                <View style={styles.pictureContainer}>
                    <Image
                        source={onBoardingImages[imageUri]}>
                    </Image>  
                </View>            
                <View style={styles.messageContainer}>
                    <Text style={styles.primaryMessage}>{primaryMessage}</Text>
                    <Text style={styles.secondaryMessage}>{secondaryMessage}</Text>
                </View>
            </View>
                   
        )
    }
}

export default OnBoardingItem;

interface Style {
    itemContainer: ViewStyle;
    pictureContainer: ViewStyle;
    messageContainer: ViewStyle;
    primaryMessage: TextStyle;
    secondaryMessage: TextStyle;
}
  
const styles = StyleSheet.create<Style>({
    itemContainer: {
        flex: 1
    },
    pictureContainer: {
        flex: 1,
        position: "absolute",
        top: "5%"
    },
    messageContainer: {
        flex: 1
    },
    primaryMessage: {
        position: "absolute",
        left: "13%",
        right: "13%",
        top: "62%",
        alignItems: "center",
        textAlign: "center",
        color: NBColor.brandPrimary,
        fontSize: 18,
        ...mixins.themes.fontBold,
        lineHeight: 24

    },
    secondaryMessage: {
        position: "absolute",       
        left: "10%",
        right: "10%",
        top: "68%",   
        textAlign: "center",
        color: "#383838",
        fontSize: 14,
        lineHeight: 20,
        ...mixins.themes.fontNormal
    }
})