import React, { Component } from 'react'
import { Container, Header, Text, Content, View } from 'native-base';
import { StoreData } from '../../../Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import { FlatList, Image } from 'react-native';
import { url } from 'inspector';

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
                    <Text>Location details {this.props.location.locationId}</Text>
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
    const { tripId, locationId } = ownProps.navigation.state.params
    var trip = _.find(storeState.trips, (item) => item.id == tripId)
    var location = _.find(trip.locations, e => e.locationId == locationId)
    return {
        location
    };
};

const mapDispatchToProps: IMapDispatchToProps = {
    // importImageSelectUnselectImage,
    // importImageSelectUnselectAllImages
    // importSelectedLocations
};

const LocationDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationDetail);

export default LocationDetailScreen;