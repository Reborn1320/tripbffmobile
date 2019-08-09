import React, { Component } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import { Container, Content, List, ListItem, Text, View, Left, Right, Icon } from "native-base";
import _ from "lodash";
import { NavigationConstants } from "../_shared/ScreenConstants";
import { StoreData } from "../../store/Interfaces";
import { NavigationScreenProp } from "react-navigation";
import { getLabel } from "../../../i18n";
import LanguageModal from "../../_organisms/User/LanguageModal";
import I18n from 'react-native-i18n';

export interface IStateProps { }

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>;
}

interface State { 
    isOpenLanguageModal: boolean   
}

export default class UserSettingsScreen extends Component<Props & IStateProps, State> {

    constructor(props) {
        super(props);

        this.state = {
            isOpenLanguageModal: false
        }
    }

    static navigationOptions = ({ navigation }) => ({
        title: "Settings",
        headerRight: <View></View>
    });
   
    private _changeLanguage = () => {
        this.setState({
            isOpenLanguageModal: true
        })
    }
    
    private _onConfirmLanguageHandler = (locale) => {
        I18n.locale =  locale;
        this.setState({
            isOpenLanguageModal: false
        })
    }

    private _onCancelLanguageHandler = () => {
        this.setState({
            isOpenLanguageModal: false
        })
    }

    render() {
        return (
            <Container>
                <Content>
                    <List>
                        <ListItem onPress={this._changeLanguage}>
                             <Left>
                                <Text>Language</Text>
                             </Left>
                            <Right>  
                                <Icon name="arrow-forward" />
                            </Right>
                          </ListItem>
                                            
                        <ListItem>
                            <Left>
                                <Text>App Feedback</Text>
                            </Left>
                            <Right>
                                <Icon name="arrow-forward" />
                            </Right>
                        </ListItem>   
                    </List>
                    <LanguageModal
                        isVisible={this.state.isOpenLanguageModal}
                        locale={"en"}
                        confirmHandler={this._onConfirmLanguageHandler}
                        cancelHandler={this._onCancelLanguageHandler}>
                    </LanguageModal>
                </Content>
            </Container>            
        );
    }
}

const styles = StyleSheet.create({
    });