import React, { Component } from "react";
import { Spinner, View } from 'native-base';
import { FlatList } from "react-native";
import _, { } from "lodash";
import DayItem from "./components/DayItem";
import * as RNa from "react-navigation";
import ConfirmationModal from "../../../_molecules/ConfirmationModal";

interface IMapDispatchToProps {
    removeLocation: (tripId: string, locationId: string) => Promise<void>
}

export interface Props extends IMapDispatchToProps {
    navigation: RNa.NavigationScreenProp<any, any>;
    tripId: string,
    days: DayVM[],
}

interface State {
    isLoaded: boolean,
    modalVisible: boolean,
    isConfirmationModalVisible: boolean,
    focusingLocationId?: string,
}

export interface DayVM {
    idx: number
    locations: LocationVM[]
}

export interface LocationVM {
    id: string
    address: string
    images: Array<ImageVM>
}

export interface ImageVM {
    url: string
    highlight: boolean
}

export class TripDetails extends Component<Props, State> {

    constructor(props: Props) {
        super(props)

        this.state = {
            isLoaded: false,
            modalVisible: false,
            isConfirmationModalVisible: false,
        }
    }

    _renderItem = (itemInfo) => {
        const day: DayVM = itemInfo.item;
        return (

            <DayItem
                locations={day.locations} dayIdx={day.idx}
                toLocationDetailHandler={(locationId) => {
                    this.props.navigation.navigate("LocationDetail", { tripId: this.props.tripId, locationId })
                }}
                removeLocationHandler={(locationId) => this.removeLocation(locationId)}
            />
        )
    };

    removeLocation(locationId) {
        console.log("removeLocation")
        this.setState({
            isConfirmationModalVisible: true,
            focusingLocationId: locationId,
        })
    }

    _removeLocationConfirmed = () => {
        let focusingLocationId = this.state.focusingLocationId;
        this.setState({
            isConfirmationModalVisible: false,
            focusingLocationId: null,
        });

        this.props.removeLocation(this.props.tripId, focusingLocationId);
    }

    _cancelModal = () => {
        this.setState({
            isConfirmationModalVisible: false,
            focusingLocationId: null,
        })
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        const { isLoaded, isConfirmationModalVisible } = this.state;
        const { days } = this.props;
        return (
            <View>
                {!isLoaded && <Spinner color='green' />}
                {isLoaded &&
                    <FlatList
                        // styles={styles.container}
                        data={days}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => String(index)}
                    />}
                <ConfirmationModal title="DELETE LOCATION" content="Do you want to delete this location ?"
                    confirmHandler={this._removeLocationConfirmed}
                    cancelHandler={this._cancelModal}
                    isVisible={isConfirmationModalVisible} />
            </View>
        );
    }
}

