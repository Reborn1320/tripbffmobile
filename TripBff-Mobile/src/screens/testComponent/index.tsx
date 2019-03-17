import React, { Component } from "react";
import { Container, Header, Content, Text, Button, View } from 'native-base';
import { connect } from "react-redux";
import _, { } from "lodash";
import moment, { Moment } from "moment";
import { PropsBase } from "../_shared/LayoutContainer";
import { StoreData } from "../../store/Interfaces";
import { TripDateRangeForm } from "../../_organisms/Trip/TripDetails/TripDateRangeForm";
import { Modal } from "../../_atoms";
import { mixins } from "../../_utils";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps, PropsBase {
}

interface State {
  // tripId: number
  isLoaded: boolean;
  fromDate: Moment;
  toDate: Moment;
  isEditDateRangeModalVisible: boolean;
}

class TestComponent extends Component<Props, State> {

  constructor(props: Props) {
    super(props)

    this.state = {
      isLoaded: false,
      isEditDateRangeModalVisible: false,
      fromDate: moment("2019-03-10"),
      toDate: moment("2019-03-15"),
    }
  }

  onEdit = (fromDate: Moment, toDate: Moment) => {
    this.setState({ fromDate, toDate, isEditDateRangeModalVisible: false });
  }

  onModalClose = () => {
    this.setState({ isEditDateRangeModalVisible: false });
  }

  render() {
    const { isEditDateRangeModalVisible, fromDate, toDate } = this.state
    return (
      <Container style={{ height: 800 }}>
        <Header></Header>
        <Content scrollEnabled={true}>
          <TripDateRangeForm fromDate={fromDate} toDate={toDate} onClickEdit={this.onEdit}></TripDateRangeForm>
          <View>

            <Button
              style={{ alignSelf: 'center' }}
              onPress={() => this.setState({ isEditDateRangeModalVisible: true })}>
              <Text>Edit date range</Text>
            </Button>
          </View>
          <View>

            <Text style={{ height: 40 }}>{fromDate.format() + " - " + toDate.format()}</Text>

          </View>

          <Modal 
            title="Edit date range"
            isVisible={isEditDateRangeModalVisible} >
            <TripDateRangeForm fromDate={fromDate} toDate={toDate}
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

