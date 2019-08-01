import React, { Component } from "react";
import { StyleSheet, ViewStyle, TextStyle } from "react-native"
import { Container, Content, View, Button, Text, Icon } from 'native-base';
import { connect } from "react-redux";
import * as RNa from "react-navigation";
import { isLoggedIn } from "../../store/User/operations";
import { NavigationConstants } from "../_shared/ScreenConstants";
import NBColor from "../../theme/variables/commonColor.js";

export interface Props {
  navigation: RNa.NavigationScreenProp<any, any>;
}

interface IMapDispatchToProps {
    isLoggedIn: () => Promise<boolean>
}

class LandingPageComponent extends Component<Props & IMapDispatchToProps, any> {

  _displayLandingPageTimer;

  componentDidMount() {
    this._displayLandingPageTimer = setTimeout(() => {
        this.props.isLoggedIn()
        .then(isLoggedIn => {
            if (isLoggedIn) {
                this.props.navigation.navigate(NavigationConstants.Screens.Profile);
            }
            else {
                this.props.navigation.navigate(NavigationConstants.Screens.Login);
            }
        })
    }, 500);    
  }  

  componentWillUnmount() {
      clearTimeout(this._displayLandingPageTimer);
  }

  render() {    
    return (
      <Container>
        <Content
          contentContainerStyle={styles.contentContainer}>
          <View style={styles.appNameContainer}>   
              <Text style={styles.firstAppName}>Trip</Text>    
              <Text style={styles.secondAppName}>BFF</Text>  
          </View>
        </Content>
      </Container>
    );
  }
}

interface Style {
    contentContainer: ViewStyle,
    appNameContainer: ViewStyle;
    firstAppName: TextStyle;
    secondAppName: TextStyle;
  }
  
  const styles = StyleSheet.create<Style>({
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'white'
    },
    appNameContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    firstAppName: {
        fontSize: 40,
        color: "black",
        fontWeight: "normal"
    },
    secondAppName: {
        fontSize: 40,
        color: NBColor.brandMainColor,
    }
  })
  
const mapDispatchToProps = (dispatch): IMapDispatchToProps => {
  return {
    isLoggedIn: () => dispatch(isLoggedIn())
  };
};

const LandingPageScreen = connect(null, mapDispatchToProps)(LandingPageComponent);

export default LandingPageScreen;
