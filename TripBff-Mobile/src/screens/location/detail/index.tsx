import React, { Component } from 'react'
import { Container, Header, Text, Content } from 'native-base';
import { StoreData } from '../../../Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";

interface IMapDispatchToProps {
}

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    trip: StoreData.TripVM
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
                    <Text>Location details here</Text>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId, locationId } = ownProps.navigation.state.params
    var trip = _.find(storeState.trips, (item) => item.id == tripId)
    return {
        trip
    };
};

const mapDispatchToProps: IMapDispatchToProps = {
    // importImageSelectUnselectImage,
    // importImageSelectUnselectAllImages
    // importSelectedLocations
};

const LocationDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationDetail);

export default LocationDetailScreen;