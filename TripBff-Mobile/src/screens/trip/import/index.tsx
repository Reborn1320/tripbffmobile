import React, { Component } from "react";
import { FlatList, View } from "react-native";
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

    async componentDidMount() {
        await checkAndRequestPhotoPermissionAsync();

        console.log("from date: " + this.state.fromDate.toDate());
        console.log("to date: " + this.state.toDate.toDate());

        console.log("request photo permission completed");
        var photos = await loadPhotosWithinAsync(this.state.fromDate.unix(), this.state.toDate.unix())
        console.log(`photos result = ${photos.length} photos`);

        var groupedPhotos = GroupPhotosIntoLocations(photos);
        //todo: will be removed
        var addresses = ["Vinpearl Land, Nha Trang", "Vịnh Ninh Vân, Nha Trang"];

        var adapterResult: TripImportLocationVM[] = []
        for (let idx = 0; idx < groupedPhotos.length; idx++) {
            const element = groupedPhotos[idx];

            var maxTimestamp = _.max(element.map(e => e.timestamp))
            var minTimestamp = _.min(element.map(e => e.timestamp))
            var location: TripImportLocationVM = {
                id: "",
                name: addresses[idx],
                location: {
                    lat: element[0].location.latitude,
                    long: element[0].location.longitude,
                    address: addresses[idx]
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
            this.setState({ UIState: "import images" });
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

const mapDispatchToProps = (dispatch) : IMapDispatchToProps => {
    return {
        // dispatch, //https://stackoverflow.com/questions/36850988/this-props-dispatch-not-a-function-react-redux
        addLocations: (tripId, selectedLocations) => dispatch(addLocations(tripId, selectedLocations)),
        uploadLocationImage: (tripId, dateIdx, locationId, imageId, imgUrl) => dispatch(uploadLocationImage(tripId, dateIdx, locationId, imageId, imgUrl)),
    }
};

const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default TripImportationScreen;
