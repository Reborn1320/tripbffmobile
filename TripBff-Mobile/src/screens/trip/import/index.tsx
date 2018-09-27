import React, { Component } from "react";
import { FlatList, View } from "react-native";
import { Container, Header, Content, Button, Text, Footer, ListItem, CheckBox } from 'native-base';
import ImportImageList from "./components/ImportImageList";
import ImportImageScreenData from "../../../fake_data";
import styled from "styled-components/native";
import { NavigationScreenProp } from "react-navigation";
import { LocationVM, BffStoreData, TripVM } from "../../../Interfaces";
import _, { cloneDeep } from "lodash";
import { connect } from "react-redux";
import { importImageSelectUnselectImage, importImageSelectUnselectAllImages } from "./actions";

export interface Props extends IMapDispatchToProps {
    // locations: Array<any> //TODO
    navigation: NavigationScreenProp<any, any>
    trip: TripVM
}

interface IMapDispatchToProps {
    importImageSelectUnselectImage: (tripId: number, locationIdx: number, imageIdx: number) => void
    importImageSelectUnselectAllImages: (tripId: number, locationIdx: number) => void
}

interface State {
    tripId: number
    name: string
    locations: Array<LocationVM>
}


class TripImportation extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            tripId: props.trip.id,
            name: props.trip.name,
            locations: props.trip.locations,
        }
    }

    _onSelectAll = (index: number) => {
        const newLocations = cloneDeep(this.state.locations);
        var newIsSelected = false;
        var nSelected = newLocations[index].images.filter((item) => item.isSelected == true).length;

        if (nSelected == 0) {
            newIsSelected = true;
        }
        newLocations[index].images.forEach((item) => item.isSelected = newIsSelected)

        this.setState({
            locations: newLocations
        });
    }

    _renderItem = (itemInfo) => {
        var item: LocationVM = itemInfo.item;
        var locationIdx: number = itemInfo.index;

        return (
            <StyledListItem noIndent
            >
                <View
                    style={{ position: "absolute", right: 10, top: 10 }}
                >
                    <CheckBox checked
                        onPress={() => this._onSelectAll(locationIdx)}
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
                        handleSelect={(imageIdx) => this.props.importImageSelectUnselectImage(this.state.tripId, locationIdx, imageIdx) } />
                </View>
            </StyledListItem>
        );
    }

    render() {
        const { name, locations } = this.props.trip
        return (
            <Container>
                <Header>
                    <View style={{height: 100, paddingTop: 30, flex: 1}}>
                        <Text style={{color: "white"}}>{name}</Text>
                    </View>
                </Header>
                <Content>
                    <StyledFlatList
                        // styles={styles.container}
                        data={locations}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />
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


const mapStateToProps = (storeState: BffStoreData, ownProps: Props) => {
    console.log(ownProps.navigation.state.params)
    const { tripId } = ownProps.navigation.state.params
    var trip = _.find(storeState.trips, (item) => item.id == tripId)
    return {
        trip
    };
};

const mapDispatchToProps: IMapDispatchToProps = {
    importImageSelectUnselectImage,
    importImageSelectUnselectAllImages
};

const TripImportationScreen = connect(mapStateToProps, mapDispatchToProps)(TripImportation);

export default TripImportationScreen;
