import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { Container, Header, Content, Button, Text, Footer, Spinner } from 'native-base';
import styled from "styled-components/native";
import { NavigationScreenProp, NavigationProp } from "react-navigation";
import { StoreData } from "../../../Interfaces";
import _ from "lodash";
import { connect, DispatchProp } from "react-redux";
import { cloneDeep } from 'lodash';
import 'react-native-console-time-polyfill';
import uuid1 from 'uuid/v1';

import importImagesReducer from "./reducers";
import checkAndRequestPhotoPermissionAsync from "../../shared/photo/PhotoPermission";
import loadPhotosWithinAsync from "../../shared/photo/PhotosLoader";
import moment from "moment";
import GroupPhotosIntoLocations from "../../shared/photo/PhotosGrouping";
import ImportImageLocationItem from "./components/ImportImageLocationItem";
import { importSelectedLocations, uploadedImage } from "./actions";
import tripApi from '../../apiBase/tripApi';
import Loading from "../../_components/Loading";
import { AxiosInstance } from "axios";
import thunk, {ThunkAction, ThunkDispatch} from 'redux-thunk';
import { TripImportLocationVM } from "./TripImportViewModels";

// type Actions = importloca;
type ThunkResult<R> = ThunkAction<R, State, { api: AxiosInstance }, any>;
export interface Props extends IMapDispatchToProps {
    dispatch: ThunkDispatch<State, null, any>
    navigation: NavigationScreenProp<any, any>
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
    // importImageSelectUnselectImage: (tripId: number, locationIdx: number, imageIdx: number) => void
    // importImageSelectUnselectAllImages: (tripId: number, locationIdx: number) => void
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

type UIState = "loading" | "select images" | "uploading images"

class TripImportation extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tripId: props.trip.id,
            name: props.trip.name,
            fromDate: props.trip.fromDate,
            toDate: props.trip.toDate,
            locations: [],
            isLoading: true,
            loadingMessage: "Loading image from your gallery",
            UIState: "loading"
        }
    }

    async componentDidMount() {
        await checkAndRequestPhotoPermissionAsync();

        console.log("from date: " + this.state.fromDate.toDate());
        console.log("to date: " + this.state.toDate.toDate());

        console.log("request photo permission completed");
        var photos = await loadPhotosWithinAsync(this.state.fromDate.unix(), this.state.toDate.unix())
        console.log(`photos result = ${photos.length} photos`);

        var groupedPhotos = GroupPhotosIntoLocations(photos);

        var adapterResult: TripImportLocationVM[] = []
        for (let idx = 0; idx < groupedPhotos.length; idx++) {
            const element = groupedPhotos[idx];

            var maxTimestamp = _.max(element.map(e => e.timestamp))
            var minTimestamp = _.min(element.map(e => e.timestamp))
            var location: TripImportLocationVM = {
                id: "",
                location: {
                    lat: element[0].location.latitude,
                    long: element[0].location.longitude,
                    address: "Ho Chi Minh City"
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

    _importImageSelectUnselectImage = (locationIdx: number, imageIdx: number) => {

        var newLocations = cloneDeep(this.state.locations)
        var img = newLocations[locationIdx].images[imageIdx]

        img.isSelected = !img.isSelected

        this.setState({
            locations: newLocations,
            forceUpdateOnlyItemIdx: locationIdx,
        })
    }

    _importImageSelectUnselectAllImages = (locationIdx: number) => {

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
        
        _.reverse(this.state.locations).forEach((element, idx) => {
            var isLocationSelected = element.images.filter((img) => img.isSelected).length > 0;

            if (isLocationSelected) {
                var locationVM = {
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
                console.log('result after import trip: ' + JSON.stringify(res.data));      
                dispatch(importSelectedLocations(tripId, res.data.locations));
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

    _uploadImage = function uploadImage(tripId, locationId, imgId, imgUrl): ThunkResult<void> {
        return function(dispatch, getState, extraArgument) {
            var externalStorageId = uuid1();
            return dispatch(uploadedImage(tripId, locationId, imgId, externalStorageId))

            //todo real implementation
            // // call API to import locations and images
            // var url = '/trips/' + tripId +'/locations';
            // extraArgument.api
            // .post(url, selectedLocations)
            // .then((res) => {
            //     console.log('result after import trip: ' + JSON.stringify(res.data));      
            //     dispatch(importSelectedLocations(tripId, res.data));
            // })
            // .catch((err) => {
            //     console.log('error after import trip: ' + JSON.stringify(err));
            // });      
    
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

        console.log("component will update");
        
        var totalImages = 0;
        var uploadedImages = 0;
        var isStartUploadImage = false;
        var locId = "";
        var imageIdToUpload: string;
        var imageUrlToUpload = "";
        _.each(this.props.trip.locations, loc => {
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
                            locId = loc.locationId;
                            imageIdToUpload = img.imageId;
                            imageUrlToUpload = img.url;
                        }
                    }
                }
            })
        });

        if (uploadedImages == totalImages) {
            isStartUploadImage = false;
            console.log("now I can move to next page");
            //todo navigate to next page
        }

        // console.log("check status");
        // console.log(`trip id = ${this.state.tripId}, location id = ${locId}, imageId = ${imageIdToUpload}, url = ${imageUrlToUpload}`)
        // console.log(`uploading images ${uploadedImages}/${totalImages}`)


        if (isStartUploadImage) {
            console.log(`uploading image: trip id = ${this.state.tripId}, location id = ${locId}, imageId = ${imageIdToUpload}, url = ${imageUrlToUpload}`)
            this.setState({ isLoading: true, loadingMessage: `uploading images ${uploadedImages}/${totalImages}`});
            this.props.dispatch(this._uploadImage(this.state.tripId, locId, imageIdToUpload, imageUrlToUpload))
        }
        else {
            if (this.state.isLoading) {
                this.setState({ isLoading: false, loadingMessage: ""})
            }
        }


    }


    render() {

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
                        <StyledFlatList
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


const StyledFlatList = styled(FlatList)`
  border-bottom-width: 0;
`

const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId } = ownProps.navigation.state.params;
    var trip = _.find(storeState.trips, (item) => item.id == tripId)
    return {
        trip
    };
};

function mapDispatchToProps(dispatch) {
    return {
        dispatch, //https://stackoverflow.com/questions/36850988/this-props-dispatch-not-a-function-react-redux
        // importImageSelectUnselectImage,
        // importImageSelectUnselectAllImages
        importSelectedLocations
    }
};

const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default TripImportationScreen;
