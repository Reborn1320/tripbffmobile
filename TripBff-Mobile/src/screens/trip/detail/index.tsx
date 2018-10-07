import React, { Component } from "react";
import { Container, Header, Content } from 'native-base';
import { NavigationScreenProp } from "react-navigation";
import { FlatList } from "react-native";
import ImportImageLocationItem from "./components/ImportImageLocationItem";

export interface Props {
    navigation: NavigationScreenProp<any, any>
    locations: Array<any> //TODO
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
        const { locations } = this.props.navigation.state.params //TODO: locations should come from storeData
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

export default TripDetail;

