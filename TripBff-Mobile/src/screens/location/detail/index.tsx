import React from 'react'
import { Container, Header, Content } from 'native-base';
import { StoreData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import LocationName from './LocationName'
import LocationLike from './LocationLike'
import LocationDescription from './LocationDescription'
import LocationMedia from './LocationMedia'

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
                    <LocationName 
                        locationName={this.props.location.name}
                        locationAddress={this.props.location.location.address}>                        
                    </LocationName>

                    <LocationLike
                        likeItems={this.props.location.likeItems}>                        
                    </LocationLike>

                    <LocationDescription
                        description={this.props.location.description}>                        
                    </LocationDescription>

                    <LocationMedia
                        images={this.props.location.images}>                        
                    </LocationMedia>
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