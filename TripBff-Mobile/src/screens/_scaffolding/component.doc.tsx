import React, { Component } from "react";
import { Container, Header, Content } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import { StoreData } from "../../store/Interfaces";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
}

interface State {
  isLoaded: boolean;
}

class ImageListDoc extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoaded: false,
    }
  }

  render() {
    const { isLoaded } = this.state
    return (
      <Container>
        <Header></Header>
        <Content>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
  // const { tripId } = ownProps.navigation.state.params
  // var trip = _.find(storeState.trips, (item) => item.id == tripId)
  return {
    // trip
  };
};

const mapDispatchToProps: IMapDispatchToProps = {
};

const TestComponentScreen = connect(mapStateToProps, mapDispatchToProps)(ImageListDoc);

export default TestComponentScreen;

