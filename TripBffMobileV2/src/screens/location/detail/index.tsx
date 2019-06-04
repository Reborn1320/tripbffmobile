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
import moment, { Moment } from 'moment';
import { checkAndRequestPhotoPermissionAsync, runPromiseSeries, getCancelToken } from "../../../_function/commonFunc";
import { AnyAction } from 'redux';

interface IMapDispatchToProps {
    updateLocationAddress: (tripId: string, dateIdx: number, locationId: string, location: RawJsonData.LocationAddressVM, cancelToken: any) => Promise<void>
    addLocationImage: (tripId: string, dateIdx: number, locationId: string, url: string, time: Moment, cancelToken: any) => Promise<string>
    uploadLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, url: string, cancelToken: any) => Promise<any>
    deleteLocationImages: (tripId: string, dateIdx: number, locationId: string, locationImageIds: string[], cancelToken: any) => Promise<void>
    favoriteLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, isFavorite: boolean) => Promise<void>
    updateLocationHighlight: (tripId: string, dateIdx: number, locationId: string, highlights: Array<StoreData.LocationLikeItemVM>, cancelToken: AnyAction) => Promise<void>
    updateLocationDescription: (tripId: string, dateIdx: number, locationId: string, description: string, cancelToken: any) => Promise<void>
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
    isOpenImagePickerModalVisible: boolean,
    isMassSelection: boolean;
    selectedImageIds: string[]
}

class LocationDetail extends React.Component<Props, State> {

    _cancelRequest;
    _cancelToken;

    constructor(props) {
        super(props);

        this.state = {
            isUpdateLocationAddressModalVisible: false,
            isUpdateLocationHighlightModalVisible: false,
            isUpdateLocationDescriptionModalVisible: false,
            isOpenImagePickerModalVisible: false,
            isMassSelection: false,
            selectedImageIds: []
        }
    }

    componentDidMount() {
        let { cancelToken, cancelRequest } = getCancelToken(this._cancelRequest);
        this._cancelToken = cancelToken;
        this._cancelRequest = cancelRequest;
    }

    componentWillUnmount() {
        this._cancelRequest('Operation canceled by the user.');
    }

    private _openUpdateLocationAddressModal = () => {
        this.setState({isUpdateLocationAddressModalVisible: true});
    }

    private _confirmUpdateLocationAddress = (name, address, long, lat) => {
        var location: RawJsonData.LocationAddressVM = {
            name, address, long, lat
        };
        this.props.updateLocationAddress(this.props.tripId, this.props.dateIdx, this.props.locationId, location, this._cancelToken)
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
        this.props.updateLocationHighlight(this.props.tripId, this.props.dateIdx, this.props.locationId, highlights, this._cancelToken)
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
        this.props.deleteLocationImages(tripId, dateIdx, locationId, selectedImageIds, this._cancelToken)
        .then(() => {
            this.setState({ isMassSelection: false, selectedImageIds: [] })
        })
    }
    private _openUpdateLocationDescriptionModal = () => {
        this.setState({isUpdateLocationDescriptionModalVisible: true});
    }

    private _confirmUpdateLocationDescription = (description) => {
        this.props.updateLocationDescription(this.props.tripId, this.props.dateIdx, this.props.locationId, description, this._cancelToken)
            .then(() => {
                this.setState({
                    isUpdateLocationDescriptionModalVisible: false
                });
            });
    }

    private _cancelUpdateLocationDescription = () => {
        this.setState({isUpdateLocationDescriptionModalVisible: false});
    }
    
    private _openImagePickerModal = async () => {
        await checkAndRequestPhotoPermissionAsync();
        this.setState({
            isOpenImagePickerModalVisible: true
        });
    }
    
    private _confirmAddImage = async (images: Array<any>) => {
        let numberImagesUploaded = 0,
            imageFuncs = [],
            tmp = this;

        _.each(images, img => {
            let func = function() {                
                return tmp._onAddingImage(img.uri, moment()).then((isSuccess) => {
                    if (isSuccess) numberImagesUploaded++;
                });
            }
            
            imageFuncs.push(func);
        })        

        return runPromiseSeries(imageFuncs).then(results => {
            //console.log('numberImagesUploaded: ' + numberImagesUploaded);
            return numberImagesUploaded;
        }); 
    }

    private _cancelAddImage = () => {
        this.setState({
            isOpenImagePickerModalVisible: false
        });
    }

    private _onAddingImage = async (uri: string, time: Moment) => {
        //console.log("uri", uri);
        //console.log("time", time);
        const { tripId, dateIdx, locationId } = this.props;
        return this.props.addLocationImage(tripId, dateIdx, locationId, uri, time, this._cancelToken)
        .then(imageId => {
            return this.props.uploadLocationImage(tripId, dateIdx, locationId, imageId, uri, this._cancelToken);
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

                            isOpenImagePickerModalVisible={this.state.isOpenImagePickerModalVisible}
                            cancelAddImageHandler={this._cancelAddImage}
                            confirmAddImageHandler={this._confirmAddImage}
                            >
                        </LocationModal>
                </View>
                <View
                    style={{ position: "absolute", bottom: 20, right: 20 }}>
                    <AddLocationImageButton
                        openImagePickerModal={this._openImagePickerModal}/>
                </View>
            </Container>
        )
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId, dateIdx, locationId } = ownProps.navigation.state.params
    
    var dateVm = _.find(storeState.currentTrip.dates, (item) => item.dateIdx == dateIdx);
    var location = _.find(dateVm.locations, (item) => item.locationId == locationId); 

    return {
        tripId,
        dateIdx,
        locationId,
        name: location.name,
        address: location.location.address,
        long: location.location.long,
        lat: location.location.lat,
        likeItems: location.highlights,
        description: location.description,
        images: location.images
    };
};

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
        updateLocationAddress: (tripId, dateIdx, locationId, location, cancelToken) => dispatch(updateLocationAddress(tripId, dateIdx, locationId, location, cancelToken)),
        addLocationImage: (tripId, dateIdx, locationId, url, time, cancelToken) => dispatch(addLocationImage(tripId, dateIdx, locationId, url, time, cancelToken)),
        uploadLocationImage: (tripId, dateIdx, locationId, imageId, url, cancelToken) => dispatch(uploadLocationImage(tripId, dateIdx, locationId, imageId, url, cancelToken)),
        deleteLocationImages: (tripId, dateIdx, locationId, locationImageIds, cancelToken) => dispatch(deleteMultiLocationImages(tripId, dateIdx, locationId, locationImageIds, cancelToken)),
        favoriteLocationImage: (tripId, dateIdx, locationId, imageId, isFavorite) => dispatch(favorLocationImage(tripId, dateIdx, locationId, imageId, isFavorite)),
        updateLocationHighlight: (tripId, dateIdx, locationId, highlights, cancelToken) => dispatch(updateLocationHighlight(tripId, dateIdx, locationId, highlights, cancelToken)),
        updateLocationDescription: (tripId, dateIdx, locationId, description, cancelToken) => dispatch(updateLocationDescription(tripId, dateIdx, locationId, description, cancelToken))
    };
 };

const LocationDetailScreen = connect(mapStateToProps, mapDispatchToProps)(LocationDetail);

export default LocationDetailScreen;