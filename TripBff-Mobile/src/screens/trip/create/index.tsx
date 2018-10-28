import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View } from 'native-base';
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
            fromDate: moment(this.state.fromDate).startOf('day'),
            toDate: moment(this.state.toDate.Date).endOf('day'),
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
                         <Item fixedLabel>
                           <Label>Trip Name</Label>
                            <Input
                                  onChangeText={(tripName) => {this.setState({tripName})}} />
                        </Item>
                        <Item>
                                <Label>From Date</Label>
                                <DatePicker
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select Date"
                                    textStyle={{ color: "orange" }}
                                    placeHolderTextStyle={{ color: "#a6a6a6" }}
                                    onDateChange={(fromDate: Date) => this.setState({fromDate})}
                                    
                                />
                            </Item>
                            <Item>
                                <Label>End Date</Label>
                                <DatePicker
                                    locale={"en"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select Date"
                                    textStyle={{ color: "orange" }}
                                    placeHolderTextStyle={{ color: "#a6a6a6" }}
                                    onDateChange={(toDate: Date) => this.setState({toDate})}
                                    
                                />
                            </Item>
                        <View style={{width: '100%',
                                        height: '30%',
                                        justifyContent: 'center',
                                        alignItems: 'center'}}>
                            <Button
                                style={{alignSelf: 'center'}}
                                onPress={() => this.onClickCreateTrip()}>
                                <Text>Import</Text>
                            </Button>
                        </View>                 
                        
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
