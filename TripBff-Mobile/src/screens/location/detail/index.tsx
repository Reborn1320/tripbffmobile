import React from 'react'
import { Container, Header, Content, Button, Text } from 'native-base';
import { StoreData, RawJsonData } from '../../../store/Interfaces';
import { connect } from 'react-redux';
import { NavigationScreenProp, ScrollView } from 'react-navigation';
import _ from "lodash";
import LocationContent from '../../../_organisms/Location/LocationContent';
import LocationModal from '../../../_organisms/Location/LocationModal'
import { updateLocationAddress, updateLocationHighlight, updateLocationDescription, deleteMultiLocationImages, addLocationImage, uploadLocationImage } from '../../../store/Trip/operations';
import { View } from 'react-native';
import { favorLocationImage } from '../../../store/Trip/operations';
import { NavigationConstants } from '../../_shared/ScreenConstants';
import AddLocationImageButton from '../../../_organisms/Location/AddLocationImageButton';
import { Moment } from 'moment';

interface IMapDispatchToProps {
    updateLocationAddress: (tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM) => Promise<void>
    addLocationImage: (tripId: string, dateIdx: number, locationId: string, url: string, time: Moment) => Promise<string>
    uploadLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, url: string) => Promise<void>
    deleteLocationImages: (tripId: string, dateIdx: number, locationId: string, locationImageIds: string[]) => Promise<void>
    favoriteLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, isFavorite: boolean) => Promise<void>
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

    private _openUpdateLocationHighlightModal = () => {
        this.setState({isUpdateLocationHighlightModalVisible: true});
    }

    private _confirmUpdateLocationHighlight = (highlights) => {
        this.props.updateLocationHighlight(this.props.tripId, this.props.dateIdx, this.props.locationId, highlights)
                    .then(() => {
                        this.setState({isUpdateLocationHighlightModalVisible: false})
                    });
    }

    private _cancelUpdateLocationHighlight = () => {
        this.setState({isUpdateLocationHighlightModalVisible: false});
    }

    private onMassSelection = () => {
        this.setState({ isMassSelection: true });
    }

    private onFavorite = (imageId: string) => {
        if (!this.state.isMassSelection) {
            this.props.favoriteLocationImage(this.props.tripId,
                this.props.dateIdx,
                this.props.locationId,
                imageId,
                !_.find(this.props.images, im => im.imageId == imageId).isFavorite);
            return;
        }
    }

    private onSelect = (imageId: string) => {
        if (!this.state.isMassSelection) {
            const { tripId, dateIdx, locationId, images } = this.props;
            const img = _.find(images, im => im.imageId == imageId);
            const { externalUrl, isFavorite } = img;
            this.props.navigation.navigate(NavigationConstants.Screens.LocationImageDetails,
                { 
                    tripId, dateIdx, locationId,
                    imageId, url: externalUrl, isFavorite
                });
        }

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

    private onDeleteLocationImages = () => {
        const { tripId, dateIdx, locationId } = this.props;
        const selectedImageIds = this.state.selectedImageIds;
        this.props.deleteLocationImages(tripId, dateIdx, locationId, selectedImageIds)
        .then(() => {
            this.setState({ isMassSelection: false, selectedImageIds: [] })
        })
    }
    private _openUpdateLocationDescriptionModal = () => {
        this.setState({isUpdateLocationDescriptionModalVisible: true});
    }

    private _confirmUpdateLocationDescription = (description) => {
        console.log('tripId :' + this.props.tripId);
        console.log('locationId :' + this.props.locationId);
        this.props.updateLocationDescription(this.props.tripId, this.props.dateIdx, this.props.locationId, description)
            .then(() => {
                this.setState({
                    isUpdateLocationDescriptionModalVisible: false
                });
            });
    }

    private _cancelUpdateLocationDescription = () => {
        this.setState({isUpdateLocationDescriptionModalVisible: false});
    }

    private onAddingImage = (uri: string, time: Moment) => {
        console.log("uri", uri);
        console.log("time", time);
        const { tripId, dateIdx, locationId } = this.props;
        this.props.addLocationImage(tripId, dateIdx, locationId, uri, time)
        .then(imageId => {
            this.props.uploadLocationImage(tripId, dateIdx, locationId, imageId, uri);
        })
    }

    render() {
        const { isMassSelection } = this.state;
        return (
            <Container>
                {isMassSelection &&
                (
                    <Header>
                        <View style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "stretch" }}>
                        <Button transparent
                            onPress={() => this.setState({ isMassSelection: false, selectedImageIds: [] })}
                        >
                            <Text>CANCEL</Text>
                        </Button>
                        <Button transparent danger
                            onPress={this.onDeleteLocationImages}
                        >
                            <Text>DELETE</Text>
                        </Button>
                        </View>
                    </Header>)
                }
                <View style={{ flex: 1 }}>
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        <LocationContent
                            address={this.props.address}
                            name={this.props.name}
                            likeItems={this.props.likeItems}
                            description={this.props.description}
                            images={this.props.images}

                            isMassSelection={isMassSelection}
                            onMassSelection={this.onMassSelection}
                            onFavorite={this.onFavorite}
                            onSelect={this.onSelect}
                            selectedImageIds={this.state.selectedImageIds}
                            
                            openUpdateLocationAddressModalHanlder={this._openUpdateLocationAddressModal}
                            openUpdateLocationHighlightModalHanlder={this._openUpdateLocationHighlightModal}
                            openUpdateLocationDescriptionModalHandler={this._openUpdateLocationDescriptionModal}>
                        </LocationContent>
                    </ScrollView>
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
                </View>
                <View
                    style={{ position: "absolute", bottom: 20, right: 20 }}>
                    <AddLocationImageButton
                        onSelectImageFromGallery={this.onAddingImage}
                    />
                </View>
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
        addLocationImage: (tripId, dateIdx, locationId, url, time) => dispatch(addLocationImage(tripId, dateIdx, locationId, url, time)),
        uploadLocationImage: (tripId, dateIdx, locationId, imageId, url) => dispatch(uploadLocationImage(tripId, dateIdx, locationId, imageId, url)),
        deleteLocationImages: (tripId, dateIdx, locationId, locationImageIds) => dispatch(deleteMultiLocationImages(tripId, dateIdx, locationId, locationImageIds)),
        favoriteLocationImage: (tripId, dateIdx, locationId, imageId, isFavorite) => dispatch(favorLocationImage(tripId, dateIdx, locationId, imageId, isFavorite)),
        updateLocationHighlight: (tripId, dateIdx, locationId, highlights) => dispatch(updateLocationHighlight(tripId, dateIdx, locationId, highlights)),
        updateLocationDescription: (tripId, dateIdx, locationId, description) => dispatch(updateLocationDescription(tripId, dateIdx, locationId, description))
    };
 };

const LocationDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationDetail);

export default LocationDetailScreen;