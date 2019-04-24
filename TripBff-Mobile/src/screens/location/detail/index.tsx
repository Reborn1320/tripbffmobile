import React from 'react'
import { Container, Header, Content, Button, Text } from 'native-base';
import { StoreData, RawJsonData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp } from 'react-navigation';
import _ from "lodash";
import LocationContent from '../../../_organisms/Location/LocationContent';
import LocationModal from '../../../_organisms/Location/LocationModal'
import { updateLocationAddress, updateLocationHighlight, updateLocationDescription } from '../../../store/Trip/operations';
import { View } from 'react-native';

interface IMapDispatchToProps {
    updateLocationAddress: (tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM) => Promise<void>
    updateLocationHighlight: (tripId: string, dateIdx: number, locationId: string, highlights: Array<StoreData.LocationLikeItemVM>) => Promise<void>
    updateLocationDescription: (tripId: string, dateIdx: number, locationId: string, description: string) => Promise<void>
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
    isUpdateLocationAddressModalVisible: boolean,
    isUpdateLocationHighlightModalVisible: boolean,
    isUpdateLocationDescriptionModalVisible: boolean,
    isMassSelection: boolean;
    selectedImageIds: string[]
}

class LocationDetail extends React.Component<Props, State> {

    constructor(props) {
        super(props);

        this.state = {
            isUpdateLocationAddressModalVisible: false,
            isUpdateLocationHighlightModalVisible: false,
            isUpdateLocationDescriptionModalVisible: false,
            isMassSelection: false,
            selectedImageIds: []
        }
    }

    private _openUpdateLocationAddressModal = () => {
        this.setState({isUpdateLocationAddressModalVisible: true});
    }

    private _confirmUpdateLocationAddress = (name, address, long, lat) => {
        var location: RawJsonData.LocationAddressVM = {
            name, address, long, lat
        };
        this.props.updateLocationAddress(this.props.tripId, this.props.dateIdx, this.props.locationId, location)
        .then(() => {
            this.setState({isUpdateLocationAddressModalVisible: false})
        });;
    }

    private _cancelUpdateLocationAddress = () => {
        this.setState({isUpdateLocationAddressModalVisible: false});
    }

    _openUpdateLocationHighlightModal = () => {
        this.setState({isUpdateLocationHighlightModalVisible: true});
    }

    _confirmUpdateLocationHighlight = (highlights) => {
        this.props.updateLocationHighlight(this.props.tripId, this.props.dateIdx, this.props.locationId, highlights)
                    .then(() => {
                        this.setState({isUpdateLocationHighlightModalVisible: false})
                    });
    }

    _cancelUpdateLocationHighlight = () => {
        this.setState({isUpdateLocationHighlightModalVisible: false});
    }

    private onMassSelection = () => {
        this.setState({ isMassSelection: true });
    }

    private onSelect = (imageId: string) => {
        if (_.indexOf(this.state.selectedImageIds, imageId) == -1) {
        this.setState({
            selectedImageIds: [...this.state.selectedImageIds, imageId]
        })
        }
        else {
        this.setState({
            selectedImageIds: _.remove(this.state.selectedImageIds, (id) => id != imageId)
        })
        }
    }

    _openUpdateLocationDescriptionModal = () => {
        this.setState({isUpdateLocationDescriptionModalVisible: true});
    }

    _confirmUpdateLocationDescription = (description) => {
        console.log('tripId :' + this.props.tripId);
        console.log('locationId :' + this.props.locationId);
        this.props.updateLocationDescription(this.props.tripId, this.props.dateIdx, this.props.locationId, description)
            .then(() => {
                this.setState({
                    isUpdateLocationDescriptionModalVisible: false
                });
            });
    }

    _cancelUpdateLocationDescription = () => {
        this.setState({isUpdateLocationDescriptionModalVisible: false});
    }

    render() {
        const { isMassSelection } = this.state;
        return (
            <Container>
                <Header>
                {isMassSelection &&
                (<View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" }}>
                    <Button transparent
                        onPress={() => this.setState({ isMassSelection: false, selectedImageIds: [] })}
                    >
                        <Text>CANCEL</Text>
                    </Button>
                    <Button transparent danger
                        onPress={() => this.setState({ isMassSelection: false, selectedImageIds: [] })}
                    >
                        <Text>DELETE</Text>
                    </Button>
                    </View>)
                }
                </Header>
                <Content>
                    <LocationContent
                        address={this.props.address}
                        name={this.props.name}
                        likeItems={this.props.likeItems}
                        description={this.props.description}
                        images={this.props.images}

                        isMassSelection={isMassSelection}
                        onMassSelection={this.onMassSelection}
                        onSelect={this.onSelect}
                        selectedImageIds={this.state.selectedImageIds}
                        
                        openUpdateLocationAddressModalHanlder={this._openUpdateLocationAddressModal}
                        openUpdateLocationHighlightModalHanlder={this._openUpdateLocationHighlightModal}
                        openUpdateLocationDescriptionModalHandler={this._openUpdateLocationDescriptionModal}>
                    </LocationContent>
                    <LocationModal
                        long={this.props.long}
                        lat={this.props.lat}

                        isUpdateLocationAddressModalVisible={this.state.isUpdateLocationAddressModalVisible}
                        confirmUpdateLocationAddressHandler={this._confirmUpdateLocationAddress}
                        cancelUpdateLocationAddressHandler={this._cancelUpdateLocationAddress}
                        
                        isUpdateLocationHighlightModalVisible={this.state.isUpdateLocationHighlightModalVisible}
                        confirmUpdateLocationHighlightHandler={this._confirmUpdateLocationHighlight}
                        cancelUpdateLocationHighlightHandler={this._cancelUpdateLocationHighlight}
                        likeItems={this.props.likeItems}
                        
                        isUpdateLocationDescriptionModalVisible={this.state.isUpdateLocationDescriptionModalVisible}
                        confirmUpdateLocationDescriptionHandler={this._confirmUpdateLocationDescription}
                        cancelUpdateLocationDescriptionHandler={this._cancelUpdateLocationDescription}
                        description={this.props.description}
                        >
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
        updateLocationAddress: (tripId, dateIdx, locationId, location) => dispatch(updateLocationAddress(tripId, dateIdx, locationId, location)),
        updateLocationHighlight: (tripId, dateIdx, locationId, highlights) => dispatch(updateLocationHighlight(tripId, dateIdx, locationId, highlights)),
        updateLocationDescription: (tripId, dateIdx, locationId, description) => dispatch(updateLocationDescription(tripId, dateIdx, locationId, description))
    };
 };

const LocationDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationDetail);

export default LocationDetailScreen;