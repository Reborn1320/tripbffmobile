import React, { Component } from "react";
import { Container, Header, Content, Button, Text } from 'native-base';
import { Form, Item, Label, Input, DatePicker } from 'native-base';
import { StoreData } from "../../../Interfaces";
import { NavigationScreenProp } from "react-navigation";
import { connect } from "react-redux";
import { createTrip } from './actions';
import moment from "moment";

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
    createTrip: (trip: StoreData.TripVM) => void
}

class TripCreation extends Component<Props, any> {

    constructor(props) {
        super(props);
        this.state = { chosenDate: new Date() };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    onClickCreateTrip() {
        //TODO: call ajax to create trip and get tripId

        // map trip info into Store
        var trip: StoreData.TripVM = {
            id: 1000,
            name: this.state.tripName,
            fromDate: moment(this.state.fromDate),
            toDate: moment(this.state.toDate),
            locations: []
        };
        this.props.createTrip(trip);

        // navigate to Trip Import page
        this.props.navigation.navigate("TripImportation", {tripId: trip.id});
    }

    render() {

        return (
            <Container>
                <Header>
                    <Text>Create new trip</Text>
                </Header>
                <Content>
                    <Form>
                        <Item floatingLabel>
                            <Label>Trip name</Label>
                            <Input onChangeText={(tripName) => {this.setState({tripName})}} />
                        </Item>
                        <Item
                            style={{ flexDirection: 'row' }}>
                            <Item last
                                style={{ flexGrow: 1 }}>
                                <Label>From</Label>
                                <DatePicker
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Date"
                                    textStyle={{ color: "orange" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={(fromDate: any) => this.setState({fromDate})}
                                    style={{ width: '50%' }}
                                />
                            </Item>
                            <Item last
                                style={{ flexGrow: 1 }}>
                                <Label>To</Label>
                                <DatePicker
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Date"
                                    textStyle={{ color: "orange" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={(toDate: any) => this.setState({toDate})}
                                    style={{ width: '50%' }}
                                />
                            </Item>
                        </Item>
                        <Item
                        style={{justifyContent: 'center'}}>
                            <Button
                                onPress={() => this.onClickCreateTrip()}
                            ><Text>Import</Text></Button>
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}

const mapDispatchToProps: IMapDispatchToProps = {
    createTrip
};

const TripCreationScreen = connect(null, mapDispatchToProps)(TripCreation);

export default TripCreationScreen;
