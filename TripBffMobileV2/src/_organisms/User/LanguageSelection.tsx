import * as React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { Container, Content, List, ListItem, Text, Left, Right, Icon, Button, Toast, Root } from "native-base";
import { StoreData } from "../../store/Interfaces";
import NBColor from "../../theme/variables/material.js";
import { mixins } from "../../_utils";
import { LOCALES } from "../../screens/_services/SystemConstants";
import { connect } from "react-redux";
import { updateLocaleFacebookUser } from "../../store/User/operations";
import { PropsBase } from "../../screens/_shared/LayoutContainer";
import { withNamespaces } from "react-i18next";

interface IMapDispatchToProps extends PropsBase {
  updateLocale: (userId: string, locale: string) => Promise<void>;
}

export interface Props extends IMapDispatchToProps {
  locale: string;
  userId: string;
}

interface State {
  locale: string;
}

class LanguageSelectionComponent extends React.Component<Props, State> {

   constructor(props) {
    super(props);

    this.state = {
        locale: this.props.locale
    }
  }  
  
  static navigationOptions = ({ navigation, screenProps }) => ({
    headerRight: (<Button transparent style={{
                    alignSelf: "center"
                        }}
                    onPress={navigation.getParam('_onConfirm')}>
                    <Text style={styles.button}>
                        {screenProps.t("action:save")}</Text>
                  </Button>)
  });

  componentDidMount() {
    this.props.navigation.setParams({ _onConfirm: this._onConfirm });
  }

  private _onConfirm = () => { 
    var { userId } = this.props;
    var { locale } = this.state;
    var tmp  = this;

    this.props.updateLocale(userId, locale).then(() => {
      tmp.props.i18n.changeLanguage(locale);
      
      Toast.show({
        text: this.props.t("setting:change_language_success"),
        buttonText: this.props.t("action:okay"),
        textStyle: {
            ...mixins.themes.fontNormal
          },
          buttonTextStyle: {
            ...mixins.themes.fontNormal
          },
        position: "top",
        type: "success",
        duration: 3000
    });
    });  
  }  

  private _getLocales = (locale) => {
    return LOCALES.map(lo => {
        return {
            isSelected: lo.locale == locale,
            label: lo.label,
            locale: lo.locale
        }
    });
  }

  private _onLanguagePress(locale) {
    this.setState({
        locale: locale
    });
  }

  render() {
    const { locale } = this.state;
    let locales = this._getLocales(locale);

    return (
      <Root>
          <Container>
              <Content>
                  <List>
                      {
                          locales.map(lo => {
                              var locale = lo.locale;

                              if (lo.isSelected)                                
                                  return (
                                      <ListItem selected key={locale}> 
                                          <Left>
                                              <Text>{lo.label}</Text>
                                          </Left>
                                          <Right>
                                              <Icon name="md-checkmark" type="Ionicons"></Icon>
                                          </Right>
                                      </ListItem>   
                                  )

                              return (
                                  <ListItem key={locale} onPress={() => this._onLanguagePress(locale)}>
                                      <Left>
                                          <Text>{lo.label}</Text>
                                      </Left>
                                  </ListItem>   
                              ) 
                          })
                      }
                  </List>
              </Content>
          </Container>
      </Root>             
    );
  }
}


interface Style {
  button: TextStyle;
}

const styles = StyleSheet.create<Style>({  
    button: {
      color: NBColor.brandPrimary,
      ...mixins.themes.fontNormal, 
      fontSize: 16,
      lineHeight: 18
    }
});

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {        
  return {
      locale: storeState.user.locale,
      userId: storeState.user.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
      updateLocale: (userId, locale) => dispatch(updateLocaleFacebookUser(userId, locale))
  }
};

const LanguageSelection = connect(mapStateToProps, mapDispatchToProps)(LanguageSelectionComponent);

export default withNamespaces(['action'])(LanguageSelection);


