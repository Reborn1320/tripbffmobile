import * as React from "react";
import { StyleSheet, ViewStyle, FlatList, TouchableOpacity, ActivityIndicator, Dimensions, TextStyle } from "react-native";
import { Container, Content, List, ListItem, Text, View, Left, Right, Icon } from "native-base";
import { StoreData } from "../../store/Interfaces";
import { getLabel } from "../../../i18n";
import NBColor from "../../theme/variables/material.js";
import { mixins } from "../../_utils";
import ActionModal from "../../_molecules/ActionModal";
import { LOCALES } from "../../screens/_services/SystemConstants";

export interface Props {
  isVisible: boolean; 
  locale: string;
  confirmHandler: (locale) => void;
  cancelHandler: () => void;
}

interface State {
    locale: string;
}

export default class LanguageModal extends React.Component<Props, State> {

   constructor(props) {
    super(props);

    this.state = {
        locale: this.props.locale
    }
   } 
   
   private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onConfirm = () => { 
    this.props.confirmHandler(this.state.locale);
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
    const { isVisible } = this.props;
    const { locale } = this.state;

    let locales = this._getLocales(locale);

    return (
      <ActionModal
         title={""}
         isVisible={isVisible}
         onCancelHandler={this._onCancel}
         onConfirmHandler={this._onConfirm}>
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
      </ActionModal>        
    );
  }
}

interface Style {
  feelingContainer: ViewStyle;
  feelingPreDefinedContainer: ViewStyle;
  feeelingPreDefinedFlatList: ViewStyle;
  feelingItemContainer: ViewStyle;
  feelingNameContainer: ViewStyle;
  selectedFeelingItemContainer: ViewStyle;
  feelingIconSelectedIconContainer: ViewStyle;
  feelingNameSelectedContainer: ViewStyle;
  feelingItem: ViewStyle;
  feelingIcon: TextStyle;
  iconRemoved: TextStyle;
}

const styles = StyleSheet.create<Style>({  
  feelingContainer: {
    flex: 1,
    marginTop: 16
  },
  feelingPreDefinedContainer: {
    flex: 1
  },
  feeelingPreDefinedFlatList: {
    flex: 1,
    marginTop: 12
  },
  feelingItemContainer: {
    width: Dimensions.get('window').width / 2,
    height: 40,    
    borderWidth: 0.5,
    borderStyle: "solid",
    borderColor: '#DADADA'
  },
  feelingNameContainer: {
    maxWidth: "50%"
  },
  selectedFeelingItemContainer: {
    width: "94%",
    height: 44,
    marginLeft: "3%",
    marginRight: "3%",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderStyle: "solid",
    borderColor: '#DADADA',
    
    marginBottom: 10
  },
  feelingIconSelectedIconContainer: {
    width: "13%"
  },
  feelingNameSelectedContainer: {
    maxWidth: "75%"
  },
  feelingItem: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'flex-start',
    alignItems: "center"
  },
  feelingIcon: {
    marginRight: 10,
    marginLeft: 25
  },
  iconRemoved: {
    fontSize: 18,
    marginLeft: 10,
    marginTop: 3,
    color: "#383838"
  }
}) 

