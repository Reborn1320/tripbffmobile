import React, { Component } from "react";
import { Container, Header, Content, Spinner } from "native-base";
import { FlatList, View } from "react-native";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";
import { PropsBase } from "../../_shared/LayoutContainer";
import { StoreData } from "../../../Interfaces";

interface IMapDispatchToProps {}

export interface Props extends IMapDispatchToProps, PropsBase {}

interface State {
  // tripId: number
}

class TripDetail extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  _renderItem = itemInfo => {
    const day = itemInfo.item;
    return <View />;
  };

  render() {
    const { days, isLoaded } = this.state;
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
) => {
  const { tripId } = ownProps.navigation.state.params;
  var trip = _.find(storeState.trips, item => item.id == tripId);
  return {
    trip
  };
};

const mapDispatchToProps: IMapDispatchToProps = {};

const TripDetailScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(TripDetail);

export default TripDetailScreen;
