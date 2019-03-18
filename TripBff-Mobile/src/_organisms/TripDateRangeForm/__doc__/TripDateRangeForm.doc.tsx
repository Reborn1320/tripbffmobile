import React, { Component } from "react";
import { Container, Header, Content, Text, Button, View } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import { StoreData } from "../../../store/Interfaces";
import { TripDateRangeForm, TripDateRangeFormEnum } from "../TripDateRangeForm";
import { Modal } from "../../../_atoms";
import { mixins } from "../../../_utils";
import { PropsBase } from "../../../screens/_shared/LayoutContainer";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps, PropsBase {
}

interface State {
  // tripId: number
  isLoaded: boolean;
  tripName: string;
  fromDate: Moment;
  toDate: Moment;
  isEditDateRangeModalVisible: boolean;
  isEditTripNameModalVisible: boolean;
}

class TestComponent extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoaded: false,
      isEditDateRangeModalVisible: false,
      isEditTripNameModalVisible: false,
      tripName: "",
      fromDate: moment("2019-03-10"),
      toDate: moment("2019-03-15"),
    }
  }

  onEdit = (tripName: string, fromDate: Moment, toDate: Moment) => {
    this.setState({ tripName, fromDate, toDate, isEditDateRangeModalVisible: false, isEditTripNameModalVisible: false });
  }

  onModalClose = () => {
    this.setState({ isEditDateRangeModalVisible: false, isEditTripNameModalVisible: false });
  }

  render() {
    const { isEditDateRangeModalVisible, isEditTripNameModalVisible, tripName, fromDate, toDate } = this.state
    return (
      <Container>
        <Header></Header>
        <Content scrollEnabled={true}>
          <TripDateRangeForm
            fields={[TripDateRangeFormEnum.Name, TripDateRangeFormEnum.DateRange]}
            fromDate={fromDate} toDate={toDate}
            onClickEdit={this.onEdit} />
          <TripDateRangeForm
            fields={[TripDateRangeFormEnum.DateRange]}
            fromDate={fromDate} toDate={toDate}
            onClickEdit={this.onEdit} />
          <TripDateRangeForm
            fields={[TripDateRangeFormEnum.Name]}
            fromDate={fromDate} toDate={toDate}
            onClickEdit={this.onEdit} />

          <Button
            style={{ alignSelf: 'center' }}
            onPress={() => this.setState({ isEditDateRangeModalVisible: true })}>
            <Text>Edit date range</Text>
          </Button>
          <Button
            style={{ alignSelf: 'center' }}
            onPress={() => this.setState({ isEditTripNameModalVisible: true })}>
            <Text>Edit trip name</Text>
          </Button>
          <Text>{tripName}</Text>
          <Text>{fromDate.format() + " - " + toDate.format()}</Text>

          <Modal
            title="Edit date range"
            isVisible={isEditDateRangeModalVisible} >
            <TripDateRangeForm
              fields={[TripDateRangeFormEnum.DateRange]}
              fromDate={fromDate} toDate={toDate}
              onClickEdit={this.onEdit}
              onCancel={this.onModalClose} />
          </Modal>
          <Modal
            title="Edit trip name"
            isVisible={isEditTripNameModalVisible} >
            <TripDateRangeForm
              fields={[TripDateRangeFormEnum.Name]}
              fromDate={fromDate} toDate={toDate}
              onClickEdit={this.onEdit}
              onCancel={this.onModalClose} />
          </Modal>
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

const TestComponentScreen = connect(mapStateToProps, mapDispatchToProps)(TestComponent);

export default TestComponentScreen;

