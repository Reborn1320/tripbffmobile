import React, { Component, PureComponent } from "react";
import { View, H1, H2, H3, Button, Text } from "native-base";
import _ from "lodash";
import { StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Avatar } from "react-native-elements";
import { StoreData } from "../../store/Interfaces";
import { connect } from "react-redux";
import { getLabel } from "../../../i18n";
import { mixins } from "../../_utils";
import NBColor from "../../theme/variables/commonColor.js";

export interface IStateProps {
}

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
  userName: string;
  fullName: string;

  nTrips: number;

  onClickEdit: () => void;
}

interface State {
}

export class UserDetailsComponent extends PureComponent<Props & IStateProps, State> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { userName, fullName, nTrips } = this.props;

    return (
      <View style={styles.container}>
         <View style={styles.avatar}>
            <Avatar
              size="large"
              rounded
              source={{ uri: "http://placekitten.com/250/250" }}
              >
            </Avatar>
          </View>
          <View style={styles.footerContainer}>
              <Text 
                style={styles.username}>{fullName}</Text>
              <View style={styles.factContainer}>
                <Text style={styles.numberOfTrips}>{nTrips} {getLabel("profile.trips_label")}</Text>
              </View>
          </View>


            {/* <Button full light rounded bordered
              onPress={this.props.onClickEdit}>
              <Text>Edit Profile</Text>
            </Button> */}
      </View>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps) => {
  return {
    userName: storeState.user.username,
    fullName: storeState.user.fullName,
    nTrips: storeState.trips.length
  };
};

const UserDetails = connect(
  mapStateToProps,
  null
)(UserDetailsComponent);

export default UserDetails;

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
