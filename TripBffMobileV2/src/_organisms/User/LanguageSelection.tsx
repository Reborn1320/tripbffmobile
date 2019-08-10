import * as React from "react";
import { StyleSheet, TextStyle } from "react-native";
import { Container, Content, List, ListItem, Text, Left, Right, Icon, Button } from "native-base";
import { StoreData } from "../../store/Interfaces";
import { getLabel } from "../../../i18n";
import NBColor from "../../theme/variables/material.js";
import { mixins } from "../../_utils";
import { LOCALES } from "../../screens/_services/SystemConstants";
import RNRestart from 'react-native-restart';
import { connect } from "react-redux";
import { updateLocaleFacebookUser } from "../../store/User/operations";
import { PropsBase } from "../../screens/_shared/LayoutContainer";

interface IMapDispatchToProps extends PropsBase {
  updateLocale: (userId: string, locale: string) => Promise<void>;
}

export interface Props {
  locale: string;
  userId: string;
}

interface State {
  locale: string;
}

class LanguageSelectionComponent extends React.Component<Props & IMapDispatchToProps, State> {

   constructor(props) {
    super(props);

    this.state = {
        locale: this.props.locale
    }
  }  
  
  static navigationOptions = ({ navigation }) => ({
    headerRight: (<Button transparent style={{
                    alignSelf: "center"
                        }}
                    onPress={navigation.getParam('_onConfirm')}>
                    <Text style={styles.button}>
                        {getLabel("action.save")}</Text>
                  </Button>)
  });

  componentDidMount() {
    this.props.navigation.setParams({ _onConfirm: this._onConfirm });
  }

  private _onConfirm = () => { 
    var { userId } = this.props;
    var { locale } = this.state;
    this.props.updateLocale(userId, locale).then(() => {
      RNRestart.Restart();
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

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {        
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

var LanguageSelection = connect(mapStateToProps, mapDispatchToProps)(LanguageSelectionComponent);

export default LanguageSelection;


