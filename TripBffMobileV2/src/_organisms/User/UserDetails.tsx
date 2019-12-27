import React, { PureComponent } from "react";
import { View, Text } from "native-base";
import _ from "lodash";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Avatar } from "react-native-elements";
import { StoreData } from "../../store/Interfaces";
import { connect } from "react-redux";
import { mixins } from "../../_utils";
import NBColor from "../../theme/variables/commonColor.js";
import { withNamespaces } from 'react-i18next';
import { PropsBase } from "../../screens/_shared/LayoutContainer";

interface Props extends PropsBase {
  userName: string;
  fullName: string;

  nTrips: number;
  facebookId: string;
}

interface State {
}

class UserDetailsComponent extends PureComponent<Props, State> {

  render() {
    const { fullName, nTrips } = this.props;
    const { t } = this.props;
    let tripLabel = nTrips > 1 ? 'profile:trips_label' : 'profile:trip_label';

    return (
      <View style={styles.container}>
         <View style={styles.avatar}>
            <Avatar
              size="large"
              rounded
              source={{ uri: "https://graph.facebook.com/" + this.props.facebookId + "/picture?type=normal" }}
              >
            </Avatar>
          </View>
          <View style={styles.footerContainer}>
              <Text 
                style={styles.username}>{fullName}</Text>
              <View style={styles.factContainer}>
                <Text style={styles.numberOfTrips}>{nTrips} {t(tripLabel)} </Text>
              </View>
          </View>
      </View>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  return {
    userName: storeState.user.username,
    fullName: storeState.user.fullName,
    nTrips: storeState.trips.length,
    facebookId: storeState.user.facebook ? storeState.user.facebook.id : ""
  };
};

const UserDetails = connect(
  mapStateToProps,
  null
)(UserDetailsComponent);

export default withNamespaces(['profile'])(UserDetails);

interface Style {
  container: ViewStyle;
  headerContainer: ViewStyle;
  footerContainer: ViewStyle;
  avatar: ViewStyle;
  factContainer: ViewStyle;
  username: TextStyle;
  numberOfTrips: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  headerContainer: {
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
    elevation: 5,
    backgroundColor: "white"
  },  
  footerContainer: {
  },
  avatar: {
    margin: 24
  },
  factContainer: {
    flexDirection: "row",    
  },
  username: {
    ...mixins.themes.fontExtraBold, 
    fontSize: 22,
    color: NBColor.brandPrimary,
    lineHeight: 26,
    fontStyle: "normal"
  },
  numberOfTrips: {
    ...mixins.themes.fontBold, 
    fontSize: 16,
    color: "#FF647C",
    lineHeight: 20,
    fontStyle: "normal"
  }
})
