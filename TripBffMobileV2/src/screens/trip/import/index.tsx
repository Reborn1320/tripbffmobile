import React, { Component } from "react";
import { FlatList, View, StyleSheet, ViewStyle } from "react-native";
import { Container, Content, Button, Text, Footer, Toast, Root } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _ from "lodash";
import { connect } from "react-redux";
import { cloneDeep } from 'lodash';

// import checkAndRequestPhotoPermissionAsync from "../../shared/photo/PhotoPermission";
import loadPhotosWithinAsync from "../../shared/photo/PhotosLoader";
import moment from "moment";
import GroupPhotosIntoLocations from "../../shared/photo/PhotosGrouping";
import ImportImageLocationItem from "./components/ImportImageLocationItem";
import Loading from "../../../_atoms/Loading/Loading";
import { TripImportLocationVM } from "./TripImportViewModels";
import { PropsBase } from "../../_shared/LayoutContainer";
import { uploadLocationImage, addLocations, IImportLocation } from "../../../store/Trip/operations";
import { getAddressFromLocation, checkAndRequestPhotoPermissionAsync } from "../../../_function/commonFunc";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import { toDateUtc as toDateUtcFunc } from "../../../_function/dateFuncs";
import Footer2Buttons from "../../../_atoms/Footer2Buttons";
import { mixins } from "../../../_utils";
import { withNamespaces } from "react-i18next";
import { getTopNearerLocationsByCoordinate } from "../../../store/DataSource/operations";
import  LocationSuggestionModal from "./components/ImportImageSuggestionsModal";
import Flurry from 'react-native-flurry-sdk';

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
    addLocations: (tripId: string, locations: IImportLocation[]) => Promise<void>;
    uploadLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, imageUrl: string, mimeType: StoreData.IMimeTypeImage) => Promise<void>;
}

interface State {
    tripId: string
    name: string
    fromDate: moment.Moment
    toDate: moment.Moment
    locations: TripImportLocationVM[]
    isLoading: boolean
    loadingMessage: string
    forceUpdateOnlyItemIdx?: number
    UIState: UIState,
    isHideFooter: boolean,
    isOpenOtherSuggestionsModal: boolean,
    selectedLocation: TripImportLocationVM
}

type UIState = "select image" | "import images" | "uploading image" 

class TripImportation extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tripId: props.trip.tripId,
            name: props.trip.name,
            fromDate: props.trip.fromDate,
            toDate: props.trip.toDate,
            locations: [],
            isLoading: true,
            loadingMessage: this.props.t("import:loading_image_from_gallery_message"),
            UIState: "select image",
            isHideFooter: true,
            isOpenOtherSuggestionsModal: false,
            selectedLocation: null
        }

        console.log("constructor")
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
    
        return {
          title: params ? params.otherParam : '',
          headerRight: (<View></View>)
        };
      };

    async getTopNearerLocationsByCoordinate(long, lat) {
        if (long == 0 && lat == 0)
            return [];

        var nearerLocations = await getTopNearerLocationsByCoordinate(lat, long);
        //console.log('nearer locations: ' + JSON.stringify(nearerLocations));

        if (!nearerLocations || nearerLocations.length == 0) {
            try {
                var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat +'&lon=' + long;
                var response = await fetch(url);
                let nearestLocation = await response.json();  
                nearestLocation.title = nearestLocation.name;
                // console.log('nearest location from OSM: ' + JSON.stringify(nearestLocation));
                nearerLocations.push(nearestLocation);
            }
            catch(error) {
                console.log(error);
            }                              
        }
        
        return nearerLocations;
    }    

    async componentDidMount() {       
        Flurry.logEvent('Trip Import', null, true);
        await checkAndRequestPhotoPermissionAsync();

        console.log("from date: " + this.state.fromDate.format());
        console.log("to date: " + this.state.toDate.format());

        console.log("request photo permission completed");
        var photos = await loadPhotosWithinAsync(this.state.fromDate.unix(), this.state.toDate.unix())
        console.log(`photos result = ${photos.length} photos`);

        var groupedPhotos = GroupPhotosIntoLocations(photos);
        var adapterResult: TripImportLocationVM[] = [];

        for (let idx = 0; idx < groupedPhotos.length; idx++) {
            const element = groupedPhotos[idx];

            var maxTimestamp = _.max(element.map(e => e.timestamp))
            var minTimestamp = _.min(element.map(e => e.timestamp))
            
            // get nearest location
            var nearerLocations = await this.getTopNearerLocationsByCoordinate(element[0].location.longitude, element[0].location.latitude);
            
            let nearestLocation = nearerLocations.length > 0 ? nearerLocations[0] : null;
            var location: TripImportLocationVM = {
                id: idx.toString(),
                name: nearestLocation ? nearestLocation.title : "Location Unknown",
                location: {
                    name: nearestLocation ? nearestLocation.title : "Location Unknown",
                    lat: element[0].location.latitude,
                    long: element[0].location.longitude,
                    address: nearestLocation ? getAddressFromLocation(nearestLocation) : "Location Unknown"
                },
                nearerLocations: nearerLocations.map(lo => {
                    return {
                        name: lo.title,
                        lat: element[0].location.latitude,
                        long: element[0].location.longitude,
                        address: getAddressFromLocation(lo)
                    }
                }),
                fromTime: moment(minTimestamp, "X"),
                toTime: moment(maxTimestamp, "X"),
                images: []
            }

            element.forEach((img) => {
                location.images.push({
                    imageId: "",
                    url: img.image.uri,
                    time: moment(img.timestamp * 1000),
                    isSelected: true
                })
            })
            adapterResult.push(location)
        }

        // console.log(adapterResult)
        Toast.show({
            text: this.props.t("import:location_information_text"),
            buttonText: this.props.t("action:okay"),
            textStyle: {
                ...mixins.themes.fontNormal
              },
              buttonTextStyle: {
                ...mixins.themes.fontNormal
              },
            position: "top",
            type: "success",
            duration: 5000
        });

        this.setState({ locations: adapterResult, isLoading: false, isHideFooter: false });
    }

    componentWillUnmount() {
        Flurry.endTimedEvent('Trip Import');
    }

    private _importImageSelectUnselectImage = (locationIdx: number, imageIdx: number) => {

        var newLocations = cloneDeep(this.state.locations)
        var img = newLocations[locationIdx].images[imageIdx]

        img.isSelected = !img.isSelected

        this.setState({
            locations: newLocations,
            forceUpdateOnlyItemIdx: locationIdx,
        })
    }

    private _importImageSelectUnselectAllImages = (locationIdx: number) => {

        var newLocations = cloneDeep(this.state.locations)

        var newIsSelected = false;
        var nSelected = newLocations[locationIdx].images.filter((item) => item.isSelected).length;

        if (nSelected == 0) {
            newIsSelected = true;
        }
        newLocations[locationIdx].images.forEach((item) => item.isSelected = newIsSelected)

        this.setState({
            locations: newLocations,
            forceUpdateOnlyItemIdx: locationIdx,
        })
    }

    private _toLocationVM = () => {
        var selectedLocations: IImportLocation[] = []
        
        _.reverse(this.state.locations).forEach((element) => {
            var isLocationSelected = element.images.filter((img) => img.isSelected).length > 0;

            if (isLocationSelected) {
                var locationVM: IImportLocation = {
                    name: element.name,
                    location: element.location,
                    fromTime: toDateUtcFunc(element.fromTime.clone()),
                    toTime: toDateUtcFunc(element.toTime.clone()),
                    images: element.images.filter((img) => img.isSelected)
                        .map(img => {
                            return {
                                url: img.url,
                                time: moment(img.time),
                            }
                        })
                }
                return selectedLocations.push(locationVM);
            }
        })

        return selectedLocations
    }

    private _skip = () => {
        this.props.navigation.navigate("TripDetail", { tripId: this.state.tripId })
    }

    private _import = () => {

        var selectedLocations = this._toLocationVM();        
        this.props.addLocations(this.state.tripId, selectedLocations)
        .then(() => {
            this.setState({ UIState: "import images", isHideFooter: true });
        })
    }

    private _handleOpenOtherSuggestionsModal = (location: TripImportLocationVM) => {
        this.setState({
            isOpenOtherSuggestionsModal: true, 
            selectedLocation: location
        });
    }
    
    private _handleCloseOtherSuggestionsModal = () => {
        this.setState({
            isOpenOtherSuggestionsModal: false,
            selectedLocation: null
        });
    }

    private _confirmUpdateLocation = (location: TripImportLocationVM) => {
        let updatedLocations = this.state.locations.map(lo => {
            return lo.id == location.id ? location : lo;
        });

        this.setState({
            isOpenOtherSuggestionsModal: false,
            selectedLocation: null,
            locations: updatedLocations,
            forceUpdateOnlyItemIdx: parseInt(location.id)
        });
    }

    private _renderItem = (itemInfo) => {
        var location: TripImportLocationVM = itemInfo.item;
        var locIdx: number = parseInt(location.id);

        return (
            <ImportImageLocationItem
                locationIdx={locIdx}
                location={location}
                handleSelectAll={(locationIdx) => this._importImageSelectUnselectAllImages(locationIdx)}
                handleSelect={(locationIdx, imageIdx) => this._importImageSelectUnselectImage(locationIdx, imageIdx)}
                isForceUpdate={locIdx == this.state.forceUpdateOnlyItemIdx}
                handleOpenOtherSuggestionsModal={this._handleOpenOtherSuggestionsModal}
            />
        );
    }

    componentDidUpdate() {

        //console.log("component did update");
        
        if (this.state.UIState == "import images") {
        //console.log("component will update with import images");

            var totalImages = 0;
            var uploadedImages = 0;
            var isStartUploadImage = false;
            var dateIdx = 0;
            var locId = "";
            var imageIdToUpload: string;
            var imageUrlToUpload = "";
            let imageMimeTypeToUpload: StoreData.IMimeTypeImage = "image/jpeg";
            
            _.each(this.props.trip.dates, date => {
                _.each(date.locations, loc => {
                    _.each(loc.images, img => {
                        totalImages++;
                        if (img.imageId) {
                            isStartUploadImage = true;
                            if (img.externalStorageId) {
                                uploadedImages++;
                            }
                            else {
                                if (!imageIdToUpload)
                                {
                                    dateIdx = date.dateIdx;
                                    locId = loc.locationId;
                                    imageIdToUpload = img.imageId;
                                    imageUrlToUpload = img.url;
                                    imageMimeTypeToUpload = img.type
                                }
                            }
                        }
                    })
                });
            })            
    
            if (uploadedImages == totalImages) {
                isStartUploadImage = false;
                //navigate to next page
                this.props.navigation.navigate("TripDetail", { tripId: this.state.tripId })
            }
    
            // console.log("check status");
            // console.log(`trip id = ${this.state.tripId}, location id = ${locId}, imageId = ${imageIdToUpload}, url = ${imageUrlToUpload}`)
            // console.log(`uploading images ${uploadedImages}/${totalImages}`)
    
    
            if (isStartUploadImage) {
                console.log(`uploading image: trip id = ${this.state.tripId}, location id = ${locId}, imageId = ${imageIdToUpload}, url = ${imageUrlToUpload}`)
                this.setState({ UIState: "uploading image", isLoading: true, loadingMessage: `${this.props.t("import:image_uploading_message")} ${uploadedImages}/${totalImages}`});
                console.log("component will update with uploading image");


                this.props.uploadLocationImage(this.state.tripId, dateIdx, locId, imageIdToUpload, imageUrlToUpload, imageMimeTypeToUpload)
                .then(() => {
                    this.setState({UIState: "import images"});
                })
            }
            else {
                if (this.state.isLoading) {
                    this.setState({ isLoading: false, loadingMessage: ""})
                }
            }
        }


    }

    private _onCancelImport = () => {
        this.props.navigation.navigate(NavigationConstants.Screens.TripDetail, { tripId: this.state.tripId });
    }
    
    render() {
        console.log('trip import screen render');
        const { tripId, locations, isLoading, loadingMessage, isHideFooter } = this.state
        return (
            <Root>
            <Container> 
                <Content>

                        {isLoading && <Loading message={loadingMessage} />}
                        {!isLoading &&
                            <FlatList style={{ borderBottomWidth: 0 }}
                                data={locations}
                                renderItem={this._renderItem}
                                keyExtractor={(item, index) => String(index)}
                                removeClippedSubviews={false}
                            />
                        }    
                        <View>
                            <LocationSuggestionModal 
                                isVisible={this.state.isOpenOtherSuggestionsModal}
                                location={this.state.selectedLocation}
                                confirmHandler={this._confirmUpdateLocation}
                                cancelHandler={this._handleCloseOtherSuggestionsModal}></LocationSuggestionModal>
                        </View>
                </Content>
                {
                    isHideFooter || 
                    <Footer2Buttons 
                        onCancel={this._onCancelImport }
                        onAction={this._import}
                        cancelText="import:skip_button"
                        actionText="import:import_button"
                        primary
                    />
                }             
                      
            </Container>
            </Root>
        );
    }
}


interface Style {
    footerButton: ViewStyle;
}

const styles = StyleSheet.create<Style>({
    footerButton: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        flexGrow: 1,
        justifyContent: "center",
        shadowColor: null,
    }
})


const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    return {
        trip: storeState.currentTrip
    };
};

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
        // dispatch, //https://stackoverflow.com/questions/36850988/this-props-dispatch-not-a-function-react-redux
        addLocations: (tripId, selectedLocations) => dispatch(addLocations(tripId, selectedLocations)),
        uploadLocationImage: (tripId, dateIdx, locationId, imageId, imgUrl, mimeType) => dispatch(uploadLocationImage(tripId, dateIdx, locationId, imageId, imgUrl, mimeType)),
    }
};



const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default withNamespaces(['import', 'action'])(TripImportationScreen);
