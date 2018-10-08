import React, { Component } from "react";
import { Container, Header, Content } from 'native-base';
import { NavigationScreenProp } from "react-navigation";
import { FlatList } from "react-native";
import ImportImageLocationItem from "./components/ImportImageLocationItem";
import { StoreData } from "../../../Interfaces";
import { connect } from "react-redux";
import _ from "lodash";

export interface Props extends IMapDispatchToProps {
    navigation: NavigationScreenProp<any, any>
    // locations: Array<any> //TODO
    trip: StoreData.TripVM
}

interface IMapDispatchToProps {
}

interface State {
}

export interface TripImportLocationVM {
    id: number
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

class TripDetail extends Component<Props, State> {

    renderItem = (itemInfo) => {
        
        var location: TripImportLocationVM = itemInfo.item;
        return (

        <ImportImageLocationItem
            location={location}
        />
    )};

    render() {
        const { locations } = this.props.trip
        return (
            <Container>
                <Header>
                </Header>
                <Content>
                    <FlatList
                        // styles={styles.container}
                        data={locations}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />
                </Content>
            </Container>
        );
    }
}

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
    // importSelectedLocations
};

const TripDetailScreen = connect(mapStateToProps, mapDispatchToProps)(TripDetail);

export default TripDetailScreen;

