import React from 'react'
import { Text, Button } from 'native-base';
import _ from "lodash";
import { View, ViewStyle, StyleSheet, TextStyle, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import OnBoardingItem from './OnBoardingItem';
import Swiper from 'react-native-swiper'
import { PropsBase } from '../_shared/LayoutContainer';
import { NavigationConstants } from '../_shared/ScreenConstants';
import { NavigationScreenProp } from 'react-navigation';
import { mixins } from "../../_utils";
import NBColor from "../../theme/variables/material.js";
import { withNamespaces } from "react-i18next";
import { TouchableOpacity as TouchableOpacityGesture} from 'react-native-gesture-handler';
import Flurry from 'react-native-flurry-sdk';

interface Props extends PropsBase {    
    navigation: NavigationScreenProp<any, any>;
}

interface State { 
    stepIndex: number   
}

class OnBoardingScreen extends React.Component<Props, State> {

    constructor(props) {
        super(props); 
        
        this.state = {
            stepIndex: 0
        }
    }

    componentDidMount() {
        Flurry.logEvent('On Boarding');
    }

    private _skip = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.NewsFeed);
    }

    private _goNextStep = () => {
        if (this.state.stepIndex === 3) 
            this.props.navigation.navigate(NavigationConstants.Screens.NewsFeed);
        else 
            (this.refs.swiper as any).scrollBy(1);
    }

    private _onIndexChanged = (index) => {
        this.setState({ stepIndex: index });
    }

    render() {       
        var { t } = this.props;
        var { stepIndex } = this.state;

        return (
            <SafeAreaView style={styles.container}>   
                {
                    Platform.OS == "android" && 
                    <TouchableOpacity onPress={this._skip} style={styles.skipButton}>
                        <Text style={styles.skipLabel}>{t("action:skip")}</Text>
                    </TouchableOpacity>
                } 
                {
                    Platform.OS == 'ios' && 
                    <TouchableOpacityGesture onPress={this._skip} style={styles.skipButton}>
                        <Text style={styles.skipLabel}>{t("action:skip")}</Text>
                    </TouchableOpacityGesture>
                }
                <Swiper ref='swiper'
                        showsButtons={false}
                        loop={false} 
                        index={stepIndex}  
                        containerStyle={{flex: 4}}                     
                        paginationStyle={styles.paginationStyle}                 
                        activeDotColor={NBColor.brandPrimary}
                        onIndexChanged={this._onIndexChanged}
                >
                    <OnBoardingItem 
                        imageUri = {"image1"}
                        
                        primaryMessage = {t("onboarding:step1_primary_msg")} 
                        secondaryMessage = {t("onboarding:step1_secondary_msg")}  />
                    <OnBoardingItem 
                        imageUri = {"image2"}
                        primaryMessage = {t("onboarding:step2_primary_msg")}
                        secondaryMessage = {t("onboarding:step2_secondary_msg")} /> 
                    <OnBoardingItem 
                        imageUri = {"image3"}
                        primaryMessage = {t("onboarding:step3_primary_msg")}
                        secondaryMessage = {t("onboarding:step3_secondary_msg")} /> 
                    <OnBoardingItem 
                        imageUri = {"image4"}
                        primaryMessage = {t("onboarding:step4_primary_msg")}
                        secondaryMessage = {t("onboarding:step4_secondary_msg")} />                    
                </Swiper>  
                <View style={styles.buttonContainer}>
                    {
                        stepIndex == 3 && 
                        <Button
                            style={styles.button}
                            onPress={this._goNextStep}
                        >
                            <Text style={styles.buttonTitle}>
                            {t("action:letStart")}
                            </Text>
                        </Button> 
                    }
                    {
                        stepIndex != 3 && 
                        <Button
                            style={styles.button}
                            onPress={this._goNextStep}
                        >
                            <Text style={styles.buttonTitle}>
                            {t("action:next")}
                            </Text>
                        </Button> 
                    }
                    
                </View> 
                             
            </SafeAreaView>                  
        )
    }
}

export default withNamespaces(["action,onboarding"])(OnBoardingScreen);

interface Style {
    container: ViewStyle;
    skipButton: ViewStyle;
    skipLabel: TextStyle;
    paginationStyle: ViewStyle;
    buttonContainer: ViewStyle;
    button: ViewStyle;
    buttonTitle: TextStyle;
}
  
const styles = StyleSheet.create<Style>({    
    container: {
        flex: 1,
        justifyContent: "space-between"
    },
    skipButton: {
        marginLeft: "80%",
        marginRight: "5%",
        marginTop: "7%"
    },
    skipLabel: {
        color: NBColor.brandPrimary,
        fontSize: 14,
        ...mixins.themes.fontNormal,
        lineHeight: 24
    },
    paginationStyle: {
        bottom: '3.75%'
    },
    buttonContainer: {
        flex: 1
    },
    button: {
        width: 160,
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: NBColor.brandPrimary,
    },
    buttonTitle: {
        ...mixins.themes.fontSemiBold,
        textTransform: "capitalize",
        fontSize: 17,
        lineHeight: 22,
        color: "#FFFFFF",
    }
})