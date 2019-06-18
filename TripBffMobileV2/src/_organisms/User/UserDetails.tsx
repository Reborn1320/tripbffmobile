import React, { Component, PureComponent } from "react";
import { View, H1, H2, H3, Button } from "native-base";
import _ from "lodash";
import { StyleSheet, ViewStyle } from "react-native";
import { Avatar, Text } from "react-native-elements";
import { StoreData } from "../../store/Interfaces";
import { connect } from "react-redux";
import { getLabel } from "../../../i18n";

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
        <View style={styles.headerContainer}>
          <H3>{userName.slice(0, userName.length > 10 ? 10 : userName.length )}</H3>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.avatar}>
            <Avatar
              size="large"
              rounded
              source={{ uri: "http://placekitten.com/250/250" }}
            ></Avatar>
          </View>

          <View style={styles.rightGroup}>
            <View style={styles.factsContainer}>
              {/* Facts */}
              <View style={styles.factContainer}>
                <H2>{nTrips}</H2>
                <Text>{getLabel("profile.trips_label")}</Text>
              </View>
              {/* <View style={styles.factContainer}>
                <H2>2</H2>
                <Text>Trips</Text>
              </View>
              <View style={styles.factContainer}>
                <H2>2</H2>
                <Text>Trips</Text>
              </View> */}
            </View>
            <Button full light rounded bordered
              onPress={this.props.onClickEdit}>
              <Text>Edit Profile</Text>
            </Button>
          </View>
        </View>

        <View style={styles.footerContainer}>
          <H3>{fullName}</H3>
        </View>

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
  contentContainer: ViewStyle;
  footerContainer: ViewStyle;
  avatar: ViewStyle;
  rightGroup: ViewStyle;
  factsContainer: ViewStyle;
  factContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  headerContainer: {
    paddingLeft: 15,
    paddingTop: 20,
    paddingBottom: 20,
    elevation: 5,
    backgroundColor: "white"
  },
  contentContainer: {
    margin: 10,
    marginBottom: 0,
    display: "flex",
    flexDirection: "row",
    alignContent: "stretch",
  },
  footerContainer: {
    marginTop: 10,
    marginLeft: 20,
    marginBottom: 20,
  },
  avatar: {
    margin: 20
  },
  rightGroup: {
    flexGrow: 10,

    display: "flex",
  },
  factsContainer: {

    display: "flex",
    flexDirection: "row"
  },
  factContainer: {
    flexGrow: 1,
    margin: 10,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
})
