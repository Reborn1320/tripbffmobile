import React from 'react'
import { Text } from 'native-base';
import _ from "lodash";
import { View, ViewStyle, StyleSheet, TextStyle, Image, Dimensions } from 'react-native';
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
        const windowHeight = Dimensions.get('window').height;
        const imgHeight = windowHeight * 0.4;

        return (
            <View style={styles.itemContainer}>    
                <View style={styles.pictureContainer}>
                    <Image
                    style={{height: imgHeight}}
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
        flex: 1,
        position: "absolute",
        top: "7%",
        left: "7%",
        right: "7%",
        alignItems: "center"
    },
    pictureContainer: {     
    },
    messageContainer: {
        flex: 1
    },
    primaryMessage: {
        marginTop: "10%",
        alignItems: "center",
        textAlign: "center",
        color: NBColor.brandPrimary,
        fontSize: 18,
        ...mixins.themes.fontBold,
        lineHeight: 24
    },
    secondaryMessage: {
        marginTop: "4%",
        textAlign: "center",
        color: "#383838",
        fontSize: 14,
        lineHeight: 20,
        ...mixins.themes.fontNormal
    }
})