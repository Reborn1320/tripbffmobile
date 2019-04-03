import React from 'react'
import { Container, Header, Text, Content, View } from 'native-base';
import { StoreData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import { Image, TextInput } from 'react-native';

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    location: StoreData.LocationVM
}

interface State {

}

class LocationDetail extends React.Component<Props, State> {
    render() {
        return (
            <Container>
                <Header>
                </Header>
                <Content>
                    <Text style={{ 
                        fontSize: 26,
                        fontWeight: "bold" }}>{this.props.location.name}</Text>
                    <TextInput
                        placeholder = "What are your feeling?"
                        multiline = {true}
                        numberOfLines = {4}
                        editable = {true}
                        maxLength = {80}
                        style={{ fontSize: 18, marginBottom: 20, maxHeight: 200 }}
                    />
                    <View
                        style={{flexDirection: "row", flexWrap: "wrap"}}
                    >
                        {this.props.location.images.map((img, idx) => <Image key={idx} source={{ uri: img.url }} style={{width: 120, height: 120 }} ></Image>)}
                    </View>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId, dateIdx, locationId } = ownProps.navigation.state.params
    var trip = _.find(storeState.trips, (item) => item.tripId == tripId)
    var dateVm = _.find(trip.dates, (item) => item.dateIdx == dateIdx);
    var location = _.find(dateVm.locations, (item) => item.locationId == locationId);
    
    return {
        location
    };
};

const mapDispatchToProps: IMapDispatchToProps = {
 };

const LocationDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationDetail);

export default LocationDetailScreen;