import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { Container, Header, Content, Button, Text, Footer } from 'native-base';
import { StoreData } from "../../../store/Interfaces";
import _ from "lodash";
import { connect } from "react-redux";
import { cloneDeep } from 'lodash';
import 'react-native-console-time-polyfill';

import checkAndRequestPhotoPermissionAsync from "../../shared/photo/PhotoPermission";
import loadPhotosWithinAsync from "../../shared/photo/PhotosLoader";
import moment from "moment";
import GroupPhotosIntoLocations from "../../shared/photo/PhotosGrouping";
import ImportImageLocationItem from "./components/ImportImageLocationItem";
import Loading from "../../../_atoms/Loading/Loading";
import {ThunkDispatch} from 'redux-thunk';
import { TripImportLocationVM } from "./TripImportViewModels";
import { uploadFileApi } from "../../_services/apis";
import { PropsBase } from "../../_shared/LayoutContainer";
import { ThunkResultBase } from "../../../store";
import { importSelectedLocations, uploadedImage } from "../../../store/Trip/actions";

type ThunkResult<R> = ThunkResultBase<R, State>;

export interface Props extends IMapDispatchToProps, PropsBase {
    dispatch: ThunkDispatch<State, null, any>
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
    importSelectedLocations: (tripId: number, locations: StoreData.LocationVM[]) => void
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
    UIState: UIState
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
            UIState: "select image"
        }

        console.log("constructor")
    }

    async getLocationFromCoordinate(long, lat) {
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

    getAddressFromLocation(locationJson) {
        let address = "";

        if (locationJson.address) {
            let houseNumber = locationJson.address.house_number,
                road = locationJson.address.road,
                suburb = locationJson.address.suburb,
                county = locationJson.address.county,
                city = locationJson.address.city,
                country = locationJson.address.country;

            if (houseNumber) address = houseNumber
            if (road) address = address ? address + ', ' + road : road;
            if (suburb) address = address ? address + ', ' + suburb : suburb;
            if (county) address = address ? address + ', ' + county : county;
            if (city)  address = address ? address + ', ' + city : city;
            if (country) address = address ? address + ', ' + country : country;         
        }
        else
            address = locationJson.display_name;

        return address;
    }

    async componentDidMount() {
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
                name: locationJson.name,
                location: {
                    lat: element[0].location.latitude,
                    long: element[0].location.longitude,
                    address: this.getAddressFromLocation(locationJson)
                },
                fromTime: moment(minTimestamp, "X"),
                toTime: moment(maxTimestamp, "X"),
                images: []
            }

            element.forEach((img) => {
                location.images.push({
                    imageId: "",
                    url: img.image.uri,
                    isSelected: true
                })
            })
            adapterResult.push(location)
        }

        // console.log(adapterResult)

        this.setState({ locations: adapterResult, isLoading: false });
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

    _toLocationVM = () => {
        var selectedLocations = []
        
        _.reverse(this.state.locations).forEach((element) => {
            var isLocationSelected = element.images.filter((img) => img.isSelected).length > 0;

            if (isLocationSelected) {
                var locationVM = {
                    name: element.name,
                    location: element.location,
                    fromTime: element.fromTime,
                    toTime: element.toTime,
                    images: element.images.filter((img) => img.isSelected).map(img => {return {url: img.url}})
                }
                return selectedLocations.push(locationVM);
            }
        })

        return selectedLocations
    }

    _skip = () => {
        this.props.navigation.navigate("TripDetail", { tripId: this.state.tripId })
    }

    _import = () => {

        var selectedLocations = this._toLocationVM();
        this.setState({ UIState: "import images" })
        console.log('selected locations: ' + JSON.stringify(selectedLocations))
        this.props.dispatch(this._postLocations(this.state.tripId, selectedLocations));
    }

    _postLocations = function postLocations(tripId, selectedLocations): ThunkResult<void> {
        return function(dispatch, getState, extraArgument) {
            // call API to import locations and images
            var url = '/trips/' + tripId +'/locations';
            console.log(`fetch: ${url}`)
            extraArgument.api
            .post(url, selectedLocations)
            .then((res) => {
                console.log("import trip succeeded")
                console.log('result after import trip: ',res.data);      
                dispatch(importSelectedLocations(tripId, res.data.locations));
                // this.setState({ UIState: "import images" })
            })
            .catch(function (error) {
                // console.log(JSON.stringify(error));
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                //   console.log(error.response.data);
                  console.log(error.response.status);
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                  // http.ClientRequest in node.js
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Error', error.message);
                }
                console.log(error.config);
              });  
            
            return 
        }
    }

    _uploadImage = function uploadImage(tripId, dateIdx, locationId, imageId, imgUrl): ThunkResult<Promise<any>> {
        return async function(dispatch) {
            console.log(`imge url: ${imgUrl}`)
            var additionalData = {
                locationId,
                imageId,
                fileName: imgUrl,
            }

            var url = '/trips/' + tripId +'/uploadImage';

            return uploadFileApi.upload(url, imgUrl, additionalData)
            .then((res) => {
                //console.log('result after upload image: ' + JSON.stringify(res));
                //console.log('result after upload image: ' + JSON.stringify(res.data));
                var { externalId, thumbnailExternalUrl } = JSON.parse(res.response);      

                dispatch(uploadedImage(tripId, dateIdx, locationId, imageId, externalId, thumbnailExternalUrl))
                //todo replace by stop on error
            })
            .catch((err) => {
                console.log('error after import trip: ' + JSON.stringify(err));
            });

            // return api
            // .post(url, data)
            // .then((res) => {
            //     console.log('result after upload image: ' + JSON.stringify(res.data));
            //     var externalStorageId: string = res.data;      
            //     dispatch(uploadedImage(tripId, locationId, imageId, externalStorageId))

            // })
            // .catch((err) => {
            //     console.log('error after import trip: ' + JSON.stringify(err));
            // });   

            // var externalStorageId = uuid1();
            // return dispatch(uploadedImage(tripId, locationId, imageId, externalStorageId))
        }
    }
    
    _renderItem = (itemInfo) => {
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


                this.props.dispatch(this._uploadImage(this.state.tripId, dateIdx, locId, imageIdToUpload, imageUrlToUpload))
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
        const { name, locations, isLoading, loadingMessage } = this.state
        return (
            <Container>
                <Header>
                    <View style={{ height: 100, paddingTop: 30, flex: 1 }}>
                        <Text style={{ color: "white" }}>{name}</Text>
                    </View>
                </Header>
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
                <Footer
                    style={{
                        justifyContent: "space-between", alignItems: "stretch", padding: 0,
                        shadowColor: "black", elevation: 10,
                        backgroundColor: "white"
                    }}
                >
                    <Button transparent success
                        onPress={() => this.props.navigation.navigate("TripDetail", { locations: [] })}
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

function mapDispatchToProps(dispatch) {
    return {
        dispatch, //https://stackoverflow.com/questions/36850988/this-props-dispatch-not-a-function-react-redux
        importSelectedLocations
    }
};

const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default TripImportationScreen;
