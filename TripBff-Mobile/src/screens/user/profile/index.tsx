import React, { Component } from "react";
import { Container, Header, Content, Spinner, Text } from "native-base";
import { FlatList } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import { StoreData } from "../../../Interfaces";
import { Dispatch } from "redux";

export interface IStateProps {
}

interface IMapDispatchToProps {}

export interface Props {}

interface State {
  isLoaded: boolean;
//   trips: Array<ITrip>;
}

//todo add profile component
//todo add list trips component
//todo check if logged or not, then load components appropriately
class Profile extends Component<Props & IStateProps & IMapDispatchToProps, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoaded: true,
      trips: []
    };
  }

  _renderItem = itemInfo => {
    const trip = itemInfo.item;
    return (<Text>trip item</Text>);
  };

  render() {
    const { trips, isLoaded } = this.state;
    return (
      <Container>
        <Header />
        <Content>
          {!isLoaded && <Spinner color="green" />}
          {isLoaded && (
            <FlatList
              // styles={styles.container}
              data={days}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => String(index)}
            />
          )}
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (
  storeState: StoreData.BffStoreData,
  ownProps: Props
): IStateProps => {
  return {
  };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): IMapDispatchToProps => {
  return {}
};

const ProfileScreen = connect<IStateProps, IMapDispatchToProps, Props, StoreData.BffStoreData>(
  mapStateToProps,
  mapDispatchToProps
)(Profile);

export default ProfileScreen;
