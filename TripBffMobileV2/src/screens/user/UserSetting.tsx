import React, { Component } from "react";
import { Container, Content, List, ListItem, Text, View, Left, Right, Icon } from "native-base";
import _ from "lodash";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { NavigationScreenProp } from "react-navigation";
import { getLabel } from "../../../i18n";
import { logOut } from "../../store/User/operations";

interface IMapDispatchToProps {
    updateLocale: (locale: string) => Promise<void>;
}

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>;
}

interface State { 
}

export default class UserSettingsScreen extends Component<Props & IMapDispatchToProps, State> {

    static navigationOptions = ({ navigation }) => ({
        title: getLabel("setting.header_title"),
        headerRight: <View></View>
    });
   
    private _changeLanguage = () => {        
       this.props.navigation.navigate(NavigationConstants.Screens.LanguageSelection);
    }  

    private _handleEditBtnClick = () => {
        logOut()
        .then(() => {
            this.props.navigation.navigate(NavigationConstants.Screens.Login)
        })
    }

    render() {
        return (
            <Container>
                <Content>
                    <List>
                        <ListItem onPress={this._changeLanguage}>
                             <Left>
                                <Text>{getLabel("setting.language_setting_label")}</Text>
                             </Left>
                            <Right>  
                                <Icon name="arrow-forward" />
                            </Right>
                          </ListItem>
                                            
                        <ListItem>
                            <Left>
                                <Text>{getLabel("setting.feedback_setting_label")}</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>   

                        <ListItem onPress={this._handleEditBtnClick}>
                            <Left>
                                <Text>{getLabel("setting.logout_setting_label")}</Text>
                            </Left>                            
                        </ListItem> 
                    </List>  
                </Content>
            </Container>            
        );
    }
}