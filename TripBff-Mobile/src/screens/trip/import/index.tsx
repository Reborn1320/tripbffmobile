import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { Container, Header, Content, Button, Text, Footer, Spinner } from 'native-base';
import styled from "styled-components/native";
import { NavigationScreenProp } from "react-navigation";
import { StoreData } from "../../../Interfaces";
import _ from "lodash";
import { connect } from "react-redux";
import { cloneDeep } from 'lodash';
import 'react-native-console-time-polyfill';

import importImagesReducer from "./reducers";
import checkAndRequestPhotoPermissionAsync from "../../shared/photo/PhotoPermission";
import loadPhotosWithinAsync from "../../shared/photo/PhotosLoader";
import moment from "moment";
import GroupPhotosIntoLocations from "../../shared/photo/PhotosGrouping";
import ImportImageLocationItem from "./components/ImportImageLocationItem";
import { importSelectedLocations } from "./actions";
import tripApi from '../../apiBase/tripApi';
import Loading from "../../_components/Loading";

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
    // importImageSelectUnselectImage: (tripId: number, locationIdx: number, imageIdx: number) => void
    // importImageSelectUnselectAllImages: (tripId: number, locationIdx: number) => void
    importSelectedLocations: (tripId: number, locations: StoreData.LocationVM[]) => void
}

interface State {
    tripId: number
    name: string
    fromDate: moment.Moment
    toDate: moment.Moment
    locations: TripImportLocationVM[]
    isLoading: boolean
    loadingMessage: string
    forceUpdateOnlyItemIdx?: number
    UIState: UIState
}

export interface TripImportLocationVM {
    id: number
    location: TripImportLocationDetailVM
    fromTime: moment.Moment
    toTime: moment.Moment

    images: Array<TripImportImageVM>
}

export interface TripImportImageVM {
    url: string
    isSelected: boolean
}

export interface TripImportLocationDetailVM {
    long: number
    lat: number
    address: string
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
                id: idx,
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
                    url: img.image.uri,
                    isSelected: true
                })
            })
            adapterResult.push(location)
        }

        // console.log(adapterResult)

        this.setState({ locations: adapterResult, isLoading: false });
    }

    _importImageSelectUnselectImage = (tripId: number, locationIdx: number, imageIdx: number) => {

        var newLocations = cloneDeep(this.state.locations)
        var img = newLocations[locationIdx].images[imageIdx]

        img.isSelected = !img.isSelected

        this.setState({
            locations: newLocations,
            forceUpdateOnlyItemIdx: locationIdx,
        })
    }

    _importImageSelectUnselectAllImages = (tripId: number, locationIdx: number) => {

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
        var selectedLocations: StoreData.LocationVM[] = []
        
        _.reverse(this.state.locations).forEach((element, idx) => {
            var isLocationSelected = element.images.filter((img) => img.isSelected).length > 0;

            if (isLocationSelected) {
                var locationVM: StoreData.LocationVM = {
                    locationId: idx + 7, //TODO: random number to detect idx 
                    location: element.location,
                    fromTime: element.fromTime,
                    toTime: element.toTime,
                    images: element.images.filter((img) => img.isSelected)
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

        // call API to import locations and images
        var url = '/trips/' + this.state.tripId +'/locations';
        tripApi.post(url, selectedLocations)
                .then((res) => {
                    console.log('result after import trip: ' + JSON.stringify(res.data));      
                    // this.props.importSelectedLocations(this.state.tripId, selectedLocations);              
                    this.props.navigation.navigate("TripDetail", { tripId: this.state.tripId });
                })
                .catch((err) => {
                    console.log('error after import trip: ' + JSON.stringify(err));
                });        
    }

    _renderItem = (itemInfo) => {
        var location: TripImportLocationVM = itemInfo.item;

        return (
            <ImportImageLocationItem
                location={location}
                handleSelectAll={(locationIdx) => this._importImageSelectUnselectAllImages(this.state.tripId, locationIdx)}
                handleSelect={(locationIdx, imageIdx) => this._importImageSelectUnselectImage(this.state.tripId, locationIdx, imageIdx)}
                isForceUpdate={location.id == this.state.forceUpdateOnlyItemIdx}
            />
        );
    }

    _computeUIState = () => {
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

const mapDispatchToProps: IMapDispatchToProps = {
    // importImageSelectUnselectImage,
    // importImageSelectUnselectAllImages
    importSelectedLocations
};

const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default TripImportationScreen;
