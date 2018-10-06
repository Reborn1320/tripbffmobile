import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { Container, Header, Content, Button, Text, Footer, ListItem, CheckBox, Spinner } from 'native-base';
import ImportImageList from "./components/ImportImageList";
import styled from "styled-components/native";
import { NavigationScreenProp } from "react-navigation";
import { StoreData } from "../../../Interfaces";
import _ from "lodash";
import { connect } from "react-redux";
import { cloneDeep } from 'lodash';
import { IMPORT_IMAGE_SELECT_UNSELECT_IMAGE, IMPORT_IMAGE_SELECT_UNSELECT_ALL_IMAGES } from "./actions";
// import importImagesReducer from "./reducers";
import checkAndRequestPhotoPermissionAsync from "../../shared/photo/PhotoPermission";
import loadPhotosWithinAsync from "../../shared/photo/PhotosLoader";
import moment from "moment";
import GroupPhotosIntoLocations from "../../shared/photo/PhotosGrouping";

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
    // importImageSelectUnselectImage: (tripId: number, locationIdx: number, imageIdx: number) => void
    // importImageSelectUnselectAllImages: (tripId: number, locationIdx: number) => void
}

interface State {
    tripId: number
    name: string
    fromDate: moment.Moment
    toDate: moment.Moment
    locations: TripImportLocationVM[]
    isLoaded: boolean
}

interface TripImportLocationVM {
    location: TripImportLocationDetailVM
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

class TripImportation extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tripId: props.trip.id,
            name: props.trip.name,
            fromDate: props.trip.fromDate,
            toDate: props.trip.toDate,
            locations: [],
            isLoaded: false,
        }
    }

    async componentDidMount() {
        await checkAndRequestPhotoPermissionAsync();

        console.log("request photo permission completed");
        var photos = await loadPhotosWithinAsync(moment("2018-09-27").unix(), moment("2018-09-29").add(1, "day").unix())
        console.log(`photos result = ${photos.length} photos`);

        var result = GroupPhotosIntoLocations(photos);

        var adapterResult: TripImportLocationVM[] = []
        result.forEach((element) => {
            var location: TripImportLocationVM = {
                location: element.location,
                images: []
            }

            element.images.forEach((img) => {
                location.images.push({
                    url: img.url,
                    isSelected: true
                })
            })
            adapterResult.push(location)
        })
        
        this.setState({ locations: adapterResult, isLoaded: true });
    }


    _importImageSelectUnselectImage = (tripId: number, locationIdx: number, imageIdx: number) => {

        //TODO: optimize
        var newLocations = cloneDeep(this.state.locations)
        var img = newLocations[locationIdx].images[imageIdx]

        img.isSelected = !img.isSelected

        this.setState({
            locations: newLocations
        })
    }

    _importImageSelectUnselectAllImages = (tripId: number, locationIdx: number) => {

        //TODO: optimize
        var newLocations = cloneDeep(this.state.locations)

        var newIsSelected = false;
        var nSelected = newLocations[locationIdx].images.filter((item) => item.isSelected).length;

        if (nSelected == 0) {
            newIsSelected = true;
        }
        newLocations[locationIdx].images.forEach((item) => item.isSelected = newIsSelected)

        this.setState({
            locations: newLocations
        })
    }

    _renderItem = (itemInfo) => {
        var item: TripImportLocationVM = itemInfo.item;
        var locationIdx: number = itemInfo.index;

        const location = this.state.locations[locationIdx]

        return (
            <StyledListItem noIndent
            >
                <View
                    style={{ position: "absolute", right: 10, top: 10 }}
                >
                    <CheckBox checked={location.images.filter((item) => item.isSelected).length == location.images.length}
                        onPress={() => this._importImageSelectUnselectAllImages(this.state.tripId, locationIdx)}
                        style={{ borderRadius: 10, backgroundColor: "green", borderColor: "white", borderWidth: 1, shadowColor: "black", elevation: 2 }}
                    ></CheckBox>

                </View>
                <View
                    style={{ flexDirection: "column", padding: 0, }}
                >
                    <Text
                        style={{ alignSelf: "stretch", marginTop: 5, }}
                    >
                        {item.location.address}
                    </Text>
                    <ImportImageList images={item.images}
                        handleSelect={(imageIdx) => this._importImageSelectUnselectImage(this.state.tripId, locationIdx, imageIdx)} />
                </View>
            </StyledListItem>
        );
    }

    render() {
        const { name, locations, isLoaded } = this.state
        return (
            <Container>
                <Header>
                    <View style={{ height: 100, paddingTop: 30, flex: 1 }}>
                        <Text style={{ color: "white" }}>{name}</Text>
                    </View>
                </Header>
                <Content>
                    {!isLoaded && <Spinner color='green' />}
                    {isLoaded &&
                        <StyledFlatList
                            data={locations}
                            renderItem={this._renderItem}
                            keyExtractor={(item, index) => String(index)}
                            removeClippedSubviews = {false}
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
                        onPress={() => this.props.navigation.navigate("TripDetail", { locations: locations })}
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

const StyledListItem = styled(ListItem)`
  border-bottom-width: 0;

  flex: 1;
  padding: 0;
`


const mapStateToProps = (storeState: StoreData.BffStoreData, ownProps: Props) => {
    const { tripId } = ownProps.navigation.state.params
    var trip = _.find(storeState.trips, (item) => item.id == tripId)
    return {
        trip
    };
};

const mapDispatchToProps: IMapDispatchToProps = {
    // importImageSelectUnselectImage,
    // importImageSelectUnselectAllImages
};

const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default TripImportationScreen;
