import React from 'react'
import { Container, Header, Content } from 'native-base';
import { StoreData, RawJsonData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import LocationContent from './LocationContent';
import LocationModal from './LocationModal'
import { updateLocationAddress } from '../../../store/Trip/operations';

interface IMapDispatchToProps {
    updateLocationAddress: (tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM) => Promise<void>
}

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    tripId: string,
    dateIdx: number,
    locationId: string,
    name: string,
    address: string,
    long: number,
    lat: number,
    likeItems: Array<StoreData.LocationLikeItemVM>,
    description: string,
    images: Array<StoreData.ImportImageVM>
}

interface State {
    isUpdateLocationAddressModalVisible: boolean
}

class LocationDetail extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            isUpdateLocationAddressModalVisible: false
        }
    }

    _openUpdateLocationAddressModal = () => {
        this.setState({isUpdateLocationAddressModalVisible: true});
    }

    _confirmUpdateLocationAddress = (name, address, long, lat) => {
        var location: RawJsonData.LocationAddressVM = {
            name, address, long, lat
        };
        this.props.updateLocationAddress(this.props.tripId, this.props.dateIdx, this.props.locationId, location);
    }

    _cancelUpdateLocationAddress = () => {
        this.setState({isUpdateLocationAddressModalVisible: false});
    }

    render() {
        return (
            <Container>
                <Header>
                </Header>
                <Content>
                    <LocationContent
                        address={this.props.address}
                        name={this.props.name}
                        likeItems={this.props.likeItems}
                        description={this.props.description}
                        images={this.props.images}
                        
                        openUpdateLocationAddressModalHanlder={this._openUpdateLocationAddressModal}>
                    </LocationContent>
                    <LocationModal
                        long={this.props.long}
                        lat={this.props.lat}

                        isUpdateLocationAddressModalVisible={this.state.isUpdateLocationAddressModalVisible}
                        confirmUpdateLocationAddressHandler={this._confirmUpdateLocationAddress}
                        cancelUpdateLocationAddressHandler={this._cancelUpdateLocationAddress}>
                    </LocationModal>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId, dateIdx, locationId } = ownProps.navigation.state.params
    
    var trip = _.find(storeState.trips, (item) => item.tripId == tripId);
    var dateVm = _.find(trip.dates, (item) => item.dateIdx == dateIdx);
    var location = _.find(dateVm.locations, (item) => item.locationId == locationId);
    
    return {
        tripId,
        dateIdx,
        locationId,
        name: location.name,
        address: location.location.address,
        long: location.location.long,
        lat: location.location.lat,
        likeItems: location.likeItems,
        description: location.description,
        images: location.images
    };
};

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
        updateLocationAddress: (tripId, dateIdx, locationId, location) => dispatch(updateLocationAddress(tripId, dateIdx, locationId, location))
    };
 };

const LocationDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationDetail);

export default LocationDetailScreen;