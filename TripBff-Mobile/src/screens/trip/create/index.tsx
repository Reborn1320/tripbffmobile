import React, { Component } from "react";
import { Container, Header, Content, Button, Text, View } from 'native-base';
import { Form, Item, Label, Input, DatePicker } from 'native-base';
import { StoreData } from "../../../Interfaces";
import { connect } from "react-redux";
import { createTrip } from './actions';
import moment from "moment";
import { tripApi } from "../../_services/apis";
import { PropsBase } from "../../_shared/LayoutContainer";

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM,
    user: StoreData.UserVM
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
        console.log('cliked')

        // call ajax to create trip and get tripId
        var tripPost = {
            name: this.state.tripName,
            fromDate: moment(this.state.fromDate).startOf('day'),
            toDate: moment(this.state.toDate).endOf('day')
        };
        tripApi.post('/trips', tripPost).then((res) => {
            var tripId = res.data;          
            console.log('trip id: ' + tripId);

            // map trip info into Store
            var trip: StoreData.TripVM = {
                tripId: tripId,
                name: this.state.tripName,
                fromDate: moment(this.state.fromDate).startOf('day'),
                toDate: moment(this.state.toDate).endOf('day'),
                locations: [],
                infographicId: ''
            };
            this.props.createTrip(trip);

            // navigate to Trip Import page
            this.props.navigation.navigate("TripImportation", {tripId: tripId});  
        })
        .catch((err) => {
            console.log('error create trip api: ' + JSON.stringify(err));
        });        
    }

    renderImportBtn() {
        return (
            <Button
                style={{alignSelf: 'center'}}
                onPress={() => this.onClickCreateTrip()}>
                <Text>Import</Text>
          </Button>
        );
    }

    render() {

        return (
            <Container>
                <Header>
                    <View style={{ height: 100, paddingTop: 30, flex: 1 }}>
                        <Text style={{ color: "white" }}>Create new trip</Text>
                    </View>
                 </Header>
                <Content>
                    <Form> 
                         <Item fixedLabel>
                           <Label>Trip Name</Label>
                            <Input
                                  onChangeText={(tripName) => this.setState({tripName})} />
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
                            {!(this.state.tripName && this.state.fromDate && this.state.toDate) || this.renderImportBtn()}
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
