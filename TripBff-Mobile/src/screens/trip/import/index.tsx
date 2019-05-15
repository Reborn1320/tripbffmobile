import React, { Component } from "react";
import { FlatList, View, BackHandler } from "react-native";
import { Container, Header, Content, Button, Text, Footer } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _ from "lodash";
import { connect } from "react-redux";
import { cloneDeep } from 'lodash';

import checkAndRequestPhotoPermissionAsync from "../../shared/photo/PhotoPermission";
import loadPhotosWithinAsync from "../../shared/photo/PhotosLoader";
import moment from "moment";
import GroupPhotosIntoLocations from "../../shared/photo/PhotosGrouping";
import ImportImageLocationItem from "./components/ImportImageLocationItem";
import Loading from "../../../_atoms/Loading/Loading";
import { TripImportLocationVM } from "./TripImportViewModels";
import { PropsBase } from "../../_shared/LayoutContainer";
import { uploadLocationImage, addLocations, IImportLocation } from "../../../store/Trip/operations";
import { getAddressFromLocation } from "../../../_function/commonFunc";
import { NavigationConstants } from "../../_shared/ScreenConstants";
import Toast from 'react-native-easy-toast';

export interface Props extends IMapDispatchToProps, PropsBase {
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
    addLocations: (tripId: string, locations: IImportLocation[]) => Promise<void>;
    uploadLocationImage: (tripId: string, dateIdx: number, locationId: string, imageId: string, imageUrl: string) => Promise<void>;
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
    isHideFooter: boolean
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
            loadingMessage: "Loading image from your gallery",
            UIState: "select image",
            isHideFooter: true
        }

        console.log("constructor")
    }

    static navigationOptions = ({ navigation, navigationOptions }) => {
        const { params } = navigation.state;
    
        return {
          title: params ? params.otherParam : ''
        };
      };

    async getLocationFromCoordinate(long, lat) {
        if (long == 0 && lat == 0)
            return "";

        var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat +'&lon=' + long;
        return fetch(url)
                .then((response) => response.json())
                .then((responseJson) => {
                    return responseJson;
                })
                .catch((error) => {
                    console.error(error);
                });
    }    

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
        await checkAndRequestPhotoPermissionAsync();

        console.log("from date: " + this.state.fromDate.toDate());
        console.log("to date: " + this.state.toDate.toDate());

        console.log("request photo permission completed");
        var photos = await loadPhotosWithinAsync(this.state.fromDate.unix(), this.state.toDate.unix())
        console.log(`photos result = ${photos.length} photos`);

        var groupedPhotos = GroupPhotosIntoLocations(photos);
        var adapterResult: TripImportLocationVM[] = [];

        for (let idx = 0; idx < groupedPhotos.length; idx++) {
            const element = groupedPhotos[idx];

            var maxTimestamp = _.max(element.map(e => e.timestamp))
            var minTimestamp = _.min(element.map(e => e.timestamp))

            //call openstreetmap api to get location name and address
            var locationJson = await this.getLocationFromCoordinate(element[0].location.longitude, element[0].location.latitude);

            var location: TripImportLocationVM = {
                id: "",
                name: locationJson ? locationJson.name : "Location Unknown",
                location: {
                    lat: element[0].location.latitude,
                    long: element[0].location.longitude,
                    address: locationJson ? getAddressFromLocation(locationJson) : "Location Unknown"
                },
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
        this.refs.toast.show('Location maybe does not accurate, you can change it later!');
        this.setState({ locations: adapterResult, isLoading: false, isHideFooter: false });
    }

    private _handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
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
                    fromTime: element.fromTime,
                    toTime: element.toTime,
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
        console.log('selected locations: ' + JSON.stringify(selectedLocations))
        this.props.addLocations(this.state.tripId, selectedLocations)
        .then(() => {
            this.setState({ UIState: "import images", isHideFooter: true });
        })
    }
    
    private _renderItem = (itemInfo) => {
        var location: TripImportLocationVM = itemInfo.item;
        var locIdx: number = itemInfo.index;

        return (
            <ImportImageLocationItem
                locationIdx={locIdx}
                location={location}
                handleSelectAll={(locationIdx) => this._importImageSelectUnselectAllImages(locationIdx)}
                handleSelect={(locationIdx, imageIdx) => this._importImageSelectUnselectImage(locationIdx, imageIdx)}
                isForceUpdate={locIdx == this.state.forceUpdateOnlyItemIdx}
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
                                }
                            }
                        }
                    })
                });
            })            
    
            if (uploadedImages == totalImages && uploadedImages > 0) {
                isStartUploadImage = false;
                //navigate to next page
                this.props.navigation.navigate("TripDetail", { tripId: this.state.tripId })
            }
    
            // console.log("check status");
            // console.log(`trip id = ${this.state.tripId}, location id = ${locId}, imageId = ${imageIdToUpload}, url = ${imageUrlToUpload}`)
            // console.log(`uploading images ${uploadedImages}/${totalImages}`)
    
    
            if (isStartUploadImage) {
                console.log(`uploading image: trip id = ${this.state.tripId}, location id = ${locId}, imageId = ${imageIdToUpload}, url = ${imageUrlToUpload}`)
                this.setState({ UIState: "uploading image", isLoading: true, loadingMessage: `uploading images ${uploadedImages}/${totalImages}`});
                console.log("component will update with uploading image");


                this.props.uploadLocationImage(this.state.tripId, dateIdx, locId, imageIdToUpload, imageUrlToUpload)
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

    render() {
        console.log('trip import screen render');
        const { tripId, locations, isLoading, loadingMessage, isHideFooter } = this.state
        return (
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
                </Content>
                {
                    isHideFooter || 
                    <Footer
                        style={{
                            justifyContent: "space-between", alignItems: "stretch", padding: 0,
                            shadowColor: "black", elevation: 10,
                            backgroundColor: "white"
                        }}
                        >
                        <Button transparent success
                            onPress={() => this.props.navigation.navigate(NavigationConstants.Screens.TripDetail, { tripId: tripId })}
                            style={{
                                alignSelf: "stretch", margin: 5,
                            }}
                        >
                            <Text
                                style={{ color: "grey" }}
                            >Skip</Text>
                        </Button>

                        <Button transparent success
                            onPress={this._import}
                            style={{ alignSelf: "stretch", margin: 5, }}
                        >
                            <Text style={{ color: "orange" }}>Import</Text>
                        </Button>
                    </Footer>
                }  
                <Toast
                    ref="toast"
                    style={{backgroundColor:'#3498db'}}
                    position='top'
                    positionValue={50}
                    fadeInDuration={750}
                    fadeOutDuration={4000}
                    textStyle={{color:'white', fontSize: 16,}}
                />         
            </Container>
        );
    }
}

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId } = ownProps.navigation.state.params;
    var trip = _.find(storeState.trips, (item) => item.tripId == tripId)
    return {
        trip
    };
};

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
        // dispatch, //https://stackoverflow.com/questions/36850988/this-props-dispatch-not-a-function-react-redux
        addLocations: (tripId, selectedLocations) => dispatch(addLocations(tripId, selectedLocations)),
        uploadLocationImage: (tripId, dateIdx, locationId, imageId, imgUrl) => dispatch(uploadLocationImage(tripId, dateIdx, locationId, imageId, imgUrl)),
    }
};

const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default TripImportationScreen;
