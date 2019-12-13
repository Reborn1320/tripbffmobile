import * as React from "react";
import { View, Text, Button, ListItem,  List,  CheckBox, Icon, Body } from "native-base";
import { StyleSheet, ViewStyle, TextStyle, SafeAreaView , FlatList} from "react-native";
import Modal from 'react-native-modal';

import NBColor from "../../../../theme/variables/commonColor.js";
import { mixins } from "../../../../_utils";
import { connect } from "react-redux";
import { StoreData } from "../../../../store/Interfaces";
import { withNamespaces } from "react-i18next";
import { PropsBase } from "../../../../screens/_shared/LayoutContainer.js";
import { TripImportLocationVM, TripImportLocationDetailVM } from "../TripImportViewModels";

export interface Props extends PropsBase {
  isVisible: boolean;  
  location: TripImportLocationVM
  confirmHandler: (location: TripImportLocationVM) => void;
  cancelHandler: () => void;
}

interface State { 
  selectedLocation: TripImportLocationDetailVM
}

class LocationSuggestionModalComponent extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);  
    
    this.state = {
        selectedLocation: null
    }
  }    

  private _onCancel = () => {
    this.props.cancelHandler();
  };

  private _onSave = () => {
    let { selectedLocation } = this.state;

    if (selectedLocation.name != this.props.location.name) {
        let updatedLocation = Object.assign({}, this.props.location);
        updatedLocation.name = selectedLocation.name;
        updatedLocation.location = selectedLocation;
        this.props.confirmHandler(updatedLocation);
    }        
    else 
        this.props.cancelHandler();
  }    

  private _onPressLocation = (selectedLocation) => {
    this.setState({
      selectedLocation: selectedLocation
    });
  }  

  render() {
    const { isVisible, t, location } = this.props;    
    let { selectedLocation } = this.state;
    let otherLocationsSuggestion: TripImportLocationDetailVM[] = location ? location.nearerLocations : [];

    return (
      <Modal
          isVisible={isVisible}
          style={styles.bottomModal}
          swipeDirection="down"
          onBackButtonPress={this._onCancel}
          onSwipeComplete={this._onCancel}
        >
          <SafeAreaView style={styles.content}>
              <View style={styles.locationsContainer}>
                <List>
                {
                    otherLocationsSuggestion.map(lo => {
                      let isChecked = false;

                      if (selectedLocation) {
                        isChecked = lo.name == this.state.selectedLocation.name;
                      }
                      else {
                        isChecked = lo.name == location.name;
                      }

                      if (isChecked)                                
                          return (
                              <ListItem selected key={lo.name}>
                                  <CheckBox checked={true} />
                                  <Body>
                                    <Text style={styles.locationName}>{lo.name}</Text>
                                    <Text style={styles.locationAddress}>{lo.address}</Text>
                                  </Body>                                 
                              </ListItem>   
                          )

                        return (
                            <ListItem key={lo.name} onPress={() => this._onPressLocation(lo)}>
                                <CheckBox checked={false}  onPress={() => this._onPressLocation(lo)}/>
                                <Body>
                                    <Text style={styles.locationName}>{lo.name}</Text>
                                    <Text style={styles.locationAddress}>{lo.address}</Text>
                                </Body>
                            </ListItem>   
                        ) 
                    })
                }
                  </List>
              </View>                
              <View style={styles.buttons}>
                <Button
                    style={styles.buttonCancel}
                    onPress={this._onCancel}>
                    <Text style={[styles.buttonTitle, styles.buttonCancelTitle]}>{t("action:cancel")}</Text>
                </Button>
                <Button
                    style={[styles.buttonDone]}
                    onPress={this._onSave}>
                    <Text style={[styles.buttonTitle]}>{t("action:done")}</Text>         
                </Button>
            </View>
          </SafeAreaView>         
        </Modal>      
    );
  }
}

interface Style {
  buttons: ViewStyle;
  bottomModal: ViewStyle;
  content: ViewStyle;
  buttonCancel: ViewStyle;
  buttonTitle: TextStyle;
  buttonCancelTitle: TextStyle;
  buttonDone: ViewStyle;
  buttonDoneDisabled: ViewStyle;
  buttonDoneActived: ViewStyle;
  buttonDoneTitleDisabled: TextStyle;
  buttonDoneTitleActived: TextStyle;
  locationsContainer: ViewStyle;
  locationName: TextStyle;
  locationAddress: TextStyle;
}

const styles = StyleSheet.create<Style>({
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 10
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  content: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  buttonCancel: {
    backgroundColor: "transparent"
  },
  buttonTitle: {    
    fontFamily: mixins.themes.fontNormal.fontFamily,
    textTransform: "capitalize",
    fontSize: 17,
    lineHeight: 22
  },
  buttonCancelTitle: {
    color: NBColor.brandPrimary
  },
  buttonDone: {    
    width: 160,
    justifyContent: "center"
  },
  buttonDoneDisabled: {
    backgroundColor: "#F0F0F0"
  },
  buttonDoneActived: {
    backgroundColor: NBColor.brandPrimary
  },
  buttonDoneTitleDisabled: {
    color: "#A1A1A1"
  },
  buttonDoneTitleActived: {
    color: "#FFFFFF"
  },
  locationsContainer: {
    marginBottom: 10
  },
  locationName: {
    // color: NBColor.brandPrimary,
    fontSize: 18,
  },
  locationAddress: {
    fontSize: 14,
  }
})
  
const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => { 
  
  return {
      locale: storeState.user.locale
  };
};
const LocationSuggestionModal = connect(mapStateToProps, null)(LocationSuggestionModalComponent);
  
export default withNamespaces(['action', 'create'])(LocationSuggestionModal);
